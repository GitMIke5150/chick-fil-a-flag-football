import type { Express } from "express";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

// Track the current video path per game - ephemeral model (one video at a time)
const currentVideoByGame: Map<number, string> = new Map();

// Track all uploaded videos with timestamps for 24-hour cleanup
interface VideoUpload {
  objectPath: string;
  uploadedAt: number; // Unix timestamp
  gameId?: number;
}
const allUploadedVideos: VideoUpload[] = [];

// 24-hour retention in milliseconds
const RETENTION_PERIOD_MS = 24 * 60 * 60 * 1000;

// Cleanup function - deletes videos older than 24 hours
async function cleanupExpiredVideos(objectStorageService: ObjectStorageService): Promise<number> {
  const now = Date.now();
  const expiredVideos = allUploadedVideos.filter(v => (now - v.uploadedAt) > RETENTION_PERIOD_MS);
  
  let deletedCount = 0;
  for (const video of expiredVideos) {
    try {
      console.log(`[24HR CLEANUP] Deleting expired video: ${video.objectPath}`);
      await objectStorageService.deleteObject(video.objectPath);
      
      // Remove from tracking arrays
      const idx = allUploadedVideos.findIndex(v => v.objectPath === video.objectPath);
      if (idx !== -1) allUploadedVideos.splice(idx, 1);
      
      if (video.gameId && currentVideoByGame.get(video.gameId) === video.objectPath) {
        currentVideoByGame.delete(video.gameId);
      }
      
      deletedCount++;
    } catch (error) {
      console.error(`[24HR CLEANUP] Failed to delete ${video.objectPath}:`, error);
    }
  }
  
  if (deletedCount > 0) {
    console.log(`[24HR CLEANUP] Deleted ${deletedCount} expired videos`);
  }
  
  return deletedCount;
}

/**
 * Register object storage routes for file uploads.
 *
 * This provides example routes for the presigned URL upload flow:
 * 1. POST /api/uploads/request-url - Get a presigned URL for uploading
 * 2. The client then uploads directly to the presigned URL
 *
 * IMPORTANT: These are example routes. Customize based on your use case:
 * - Add authentication middleware for protected uploads
 * - Add file metadata storage (save to database after upload)
 * - Add ACL policies for access control
 */
export function registerObjectStorageRoutes(app: Express): void {
  const objectStorageService = new ObjectStorageService();

  // Run cleanup on startup (async, don't block)
  console.log('[24HR CLEANUP] Starting initial cleanup check...');
  cleanupExpiredVideos(objectStorageService).catch(err => {
    console.error('[24HR CLEANUP] Initial cleanup error:', err);
  });

  // Run cleanup every hour (3600000ms)
  setInterval(() => {
    console.log('[24HR CLEANUP] Running hourly cleanup...');
    cleanupExpiredVideos(objectStorageService).catch(err => {
      console.error('[24HR CLEANUP] Hourly cleanup error:', err);
    });
  }, 60 * 60 * 1000);

  /**
   * Request a presigned URL for file upload.
   *
   * Request body (JSON):
   * {
   *   "name": "filename.jpg",
   *   "size": 12345,
   *   "contentType": "image/jpeg"
   * }
   *
   * Response:
   * {
   *   "uploadURL": "https://storage.googleapis.com/...",
   *   "objectPath": "/objects/uploads/uuid"
   * }
   *
   * IMPORTANT: The client should NOT send the file to this endpoint.
   * Send JSON metadata only, then upload the file directly to uploadURL.
   */
  app.post("/api/uploads/request-url", async (req, res) => {
    try {
      const { name, size, contentType, gameId: rawGameId } = req.body;
      
      // Normalize gameId to number for consistent lookups
      const gameId = rawGameId ? parseInt(String(rawGameId), 10) : undefined;

      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name",
        });
      }

      // EPHEMERAL VIDEO MODEL: Delete the previous video for this game
      if (gameId) {
        const previousVideoPath = currentVideoByGame.get(gameId);
        if (previousVideoPath) {
          console.log(`Deleting previous video for game ${gameId}: ${previousVideoPath}`);
          await objectStorageService.deleteObject(previousVideoPath);
          currentVideoByGame.delete(gameId);
          
          // Also remove from allUploadedVideos tracking
          const prevIdx = allUploadedVideos.findIndex(v => v.objectPath === previousVideoPath);
          if (prevIdx !== -1) allUploadedVideos.splice(prevIdx, 1);
        }
      }

      const uploadURL = await objectStorageService.getObjectEntityUploadURL();

      // Extract object path from the presigned URL for later reference
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

      // Track the new video path for this game
      if (gameId) {
        currentVideoByGame.set(gameId, objectPath);
        console.log(`Tracking new video for game ${gameId}: ${objectPath}`);
      }

      // Track for 24-hour cleanup
      allUploadedVideos.push({
        objectPath,
        uploadedAt: Date.now(),
        gameId,
      });
      console.log(`[UPLOAD] Video tracked for 24-hour retention: ${objectPath}`);

      res.json({
        uploadURL,
        objectPath,
        // Echo back the metadata for client convenience
        metadata: { name, size, contentType },
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  /**
   * Delete all videos for a game when marked FINAL.
   * Stats are preserved, only video storage is cleaned up.
   */
  app.post("/api/uploads/cleanup-game/:gameId", async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      if (isNaN(gameId)) {
        return res.status(400).json({ error: "Invalid game ID" });
      }

      const previousVideoPath = currentVideoByGame.get(gameId);
      if (previousVideoPath) {
        console.log(`[FINAL] Cleaning up video for game ${gameId}: ${previousVideoPath}`);
        await objectStorageService.deleteObject(previousVideoPath);
        currentVideoByGame.delete(gameId);
        res.json({ success: true, deleted: previousVideoPath });
      } else {
        console.log(`[FINAL] No video to clean up for game ${gameId}`);
        res.json({ success: true, deleted: null });
      }
    } catch (error) {
      console.error("Error cleaning up game videos:", error);
      res.status(500).json({ error: "Failed to cleanup videos" });
    }
  });

  /**
   * Serve uploaded objects.
   *
   * GET /objects/:objectPath(*)
   *
   * This serves files from object storage. For public files, no auth needed.
   * For protected files, add authentication middleware and ACL checks.
   */
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      return res.status(500).json({ error: "Failed to serve object" });
    }
  });
}

