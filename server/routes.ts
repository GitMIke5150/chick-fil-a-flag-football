import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, updateGameSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { transcribeAudio, generatePlayerHighlights, parsePlayCommand, type ParsedPlay } from "./replit_integrations/audio/client";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

// Team roster and aliases for AI play parsing
// Uses FULL NAMES for display in stats
const roster = [
  'Davis Olson',
  'Hampton Wells', 
  'Bryce Halter',
  'Nasty Nate',
  'Sly Willis',
  'Hudson Paulus',
  'Bennett Walters',
  'Caleb',
  'Knox Hager',
];

const playerAliases: Record<string, string[]> = {
  'Davis Olson': ['Davis', 'Olson', 'Olsen', 'Davis Olson', 'Davis Olsen', 'DO', '#3', 'Dave'],
  'Hampton Wells': ['Hampton', 'Wells', 'Hampton Wells', 'Hamp', '#12'],
  'Bryce Halter': ['Bryce', 'Halter', 'Bryce Halter', '#4'],
  'Nasty Nate': ['Nate', 'Nasty', 'Nasty Nate', '#9'],
  'Sly Willis': ['Sly', 'Slides', 'Slide', 'Willis', 'Sly Willis', '#5'],
  'Hudson Paulus': ['Hudson', 'Hudson Paulus', 'Hud', '#7'],
  'Bennett Walters': ['Bennett', 'Walters', 'Bennett Walters', 'Ben', '#1'],
  'Caleb': ['Caleb', '#2'],
  'Knox Hager': ['Knox', 'Hager', 'Knox Hager', 'Max', 'Max Hager', '#6'],
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid game ID" });
      }

      const game = await storage.getGame(id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      res.json(game);
    } catch (error) {
      console.error("Error fetching game:", error);
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      const validation = insertGameSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: fromError(validation.error).toString() 
        });
      }

      const game = await storage.createGame(validation.data);
      res.status(201).json(game);
    } catch (error) {
      console.error("Error creating game:", error);
      res.status(500).json({ error: "Failed to create game" });
    }
  });

  app.patch("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid game ID" });
      }

      const validation = updateGameSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: fromError(validation.error).toString() 
        });
      }

      const game = await storage.updateGame(id, validation.data);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      res.json(game);
    } catch (error) {
      console.error("Error updating game:", error);
      res.status(500).json({ error: "Failed to update game" });
    }
  });

  app.delete("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid game ID" });
      }

      const deleted = await storage.deleteGame(id);
      if (!deleted) {
        return res.status(404).json({ error: "Game not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting game:", error);
      res.status(500).json({ error: "Failed to delete game" });
    }
  });

  // Roster and player aliases for voice recognition
  const roster = ['Davis', 'Hampton', 'Bryce', 'Nasty Nate', 'Sly', 'Hudson', 'Bennett', 'Caleb', 'Knox'];
  const playerAliases: Record<string, string[]> = {
    'Davis': ['Davis', 'Olson', 'Olsen', 'Davis Olson', 'Davis Olsen', '#3', 'number 3'],
    'Hampton': ['Hampton', 'Wells', 'Hampton Wells', '#12', 'number 12'],
    'Bryce': ['Bryce', 'Halter', 'Bryce Halter', '#4', 'number 4'],
    'Nasty Nate': ['Nasty Nate', 'Nate', 'Smith', 'Nate Smith', '#9', 'number 9'],
    'Sly': ['Sly', 'Slides', 'Slide', 'Willis', 'Sly Willis', '#5', 'number 5'],
    'Hudson': ['Hudson', 'Paulus', 'Hudson Paulus', '#7', 'number 7'],
    'Bennett': ['Bennett', 'Walters', 'Bennett Walters', '#1', 'number 1'],
    'Caleb': ['Caleb', 'McElveen', 'Caleb McElveen', '#2', 'number 2'],
    'Knox': ['Knox', 'Hager', 'Knox Hager', '#6', 'number 6'],
  };

  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audio } = req.body;
      if (!audio) {
        return res.status(400).json({ error: "Audio data required" });
      }
      const text = await transcribeAudio(audio);
      
      // Detect player names mentioned in the transcription
      const textLower = text.toLowerCase();
      const detectedPlayers = roster.filter(player => 
        textLower.includes(player.toLowerCase())
      );
      
      res.json({ text, detectedPlayers });
    } catch (error) {
      console.error("Error transcribing audio:", error);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  // Voice-controlled play parsing - transcribes audio and parses the play command
  // Supports both audio-only and video input (extracts audio from video for iOS Safari)
  app.post("/api/parse-play", async (req, res) => {
    try {
      const { audio, video, inputType } = req.body;
      
      let audioData = audio;
      
      // If video is provided (iOS Safari fallback), extract audio server-side
      if (video && !audio) {
        console.log("[parse-play] Video provided, extracting audio server-side...");
        console.log("[parse-play] Video base64 length:", video.length);
        
        try {
          const { extractAudioFromVideo } = await import("./replit_integrations/audio/client");
          audioData = await extractAudioFromVideo(video);
          console.log("[parse-play] Extracted audio base64 length:", audioData.length);
        } catch (extractError) {
          console.error("[parse-play] Audio extraction failed:", extractError);
          return res.status(400).json({ error: "Failed to extract audio from video" });
        }
      }
      
      if (!audioData) {
        console.log("[parse-play] No audio data provided, inputType:", inputType);
        return res.status(400).json({ error: "Audio data required" });
      }
      
      console.log("[parse-play] Transcribing audio, base64 length:", audioData.length);
      // Football-specific prompt to help transcription accuracy
      const footballPrompt = `Flag football play call. Player names: ${roster.join(", ")}. Examples: "Davis to Olson touchdown", "Hampton catch first down", "Slide to Bryant extra point", "Tucker flag pull", "Davis runs for first down".`;
      
      // First transcribe the audio with football context
      const text = await transcribeAudio(audioData, footballPrompt);
      console.log("[parse-play] Transcription:", text);
      
      // Then parse the transcription into a structured play
      console.log("[parse-play] Parsing play command...");
      const parsedPlay = await parsePlayCommand(text, roster, playerAliases);
      console.log("[parse-play] Parsed play:", JSON.stringify(parsedPlay));
      
      res.json({ 
        transcription: text, 
        parsedPlay,
        roster,
      });
    } catch (error) {
      console.error("Error parsing play:", error);
      res.status(500).json({ error: "Failed to parse play" });
    }
  });

  app.post("/api/games/:id/generate-highlights", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid game ID" });
      }
      
      const game = await storage.getGame(id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      const roster = ['Davis', 'Hampton', 'Bryce', 'Nasty Nate', 'Sly', 'Hudson', 'Bennett', 'Caleb', 'Knox'];
      const commentary = (game.coachCommentary as Array<{ text: string; quarter: number; timestamp: number }>) || [];
      
      const highlights = await generatePlayerHighlights(
        commentary,
        game.playerStats,
        roster
      );

      const updatedGame = await storage.updateGame(id, { aiHighlights: highlights });
      res.json({ highlights, game: updatedGame });
    } catch (error) {
      console.error("Error generating highlights:", error);
      res.status(500).json({ error: "Failed to generate highlights" });
    }
  });

  // Register object storage routes for video uploads
  registerObjectStorageRoutes(app);

  return httpServer;
}
