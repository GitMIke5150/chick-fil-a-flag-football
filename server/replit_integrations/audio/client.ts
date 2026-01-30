import OpenAI, { toFile } from "openai";
import { Buffer } from "node:buffer";
import { spawn } from "child_process";
import { writeFile, unlink, readFile } from "fs/promises";
import { randomUUID } from "crypto";
import { tmpdir } from "os";
import { join } from "path";

export const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export type AudioFormat = "wav" | "mp3" | "webm" | "mp4" | "ogg" | "unknown";

/**
 * Detect audio format from buffer magic bytes.
 * Supports: WAV, MP3, WebM (Chrome/Firefox), MP4/M4A/MOV (Safari/iOS), OGG
 */
export function detectAudioFormat(buffer: Buffer): AudioFormat {
  if (buffer.length < 12) return "unknown";

  // WAV: RIFF....WAVE
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    return "wav";
  }
  // WebM: EBML header
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return "webm";
  }
  // MP3: ID3 tag or frame sync
  if (
    (buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xfa || buffer[1] === 0xf3)) ||
    (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33)
  ) {
    return "mp3";
  }
  // MP4/M4A/MOV: ....ftyp (Safari/iOS records in these containers)
  if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    return "mp4";
  }
  // OGG: OggS
  if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) {
    return "ogg";
  }
  return "unknown";
}

/**
 * Convert any audio/video format to WAV using ffmpeg.
 * Uses temp files instead of pipes because video containers (MP4/MOV)
 * require seeking to find the audio track.
 */
export async function convertToWav(audioBuffer: Buffer): Promise<Buffer> {
  const inputPath = join(tmpdir(), `input-${randomUUID()}`);
  const outputPath = join(tmpdir(), `output-${randomUUID()}.wav`);

  try {
    // Write input to temp file (required for video containers that need seeking)
    await writeFile(inputPath, audioBuffer);

    // Run ffmpeg with file paths
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i", inputPath,
        "-vn",              // Extract audio only (ignore video track)
        "-f", "wav",
        "-ar", "16000",     // 16kHz sample rate (good for speech)
        "-ac", "1",         // Mono
        "-acodec", "pcm_s16le",
        "-y",               // Overwrite output
        outputPath,
      ]);

      ffmpeg.stderr.on("data", () => {}); // Suppress logs
      ffmpeg.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });
      ffmpeg.on("error", reject);
    });

    // Read converted audio
    return await readFile(outputPath);
  } finally {
    // Clean up temp files
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}

/**
 * Auto-detect and convert audio to OpenAI-compatible format.
 * - WAV/MP3: Pass through (already compatible)
 * - WebM/MP4/OGG: Convert to WAV via ffmpeg
 */
export async function ensureCompatibleFormat(
  audioBuffer: Buffer
): Promise<{ buffer: Buffer; format: "wav" | "mp3" }> {
  const detected = detectAudioFormat(audioBuffer);
  if (detected === "wav") return { buffer: audioBuffer, format: "wav" };
  if (detected === "mp3") return { buffer: audioBuffer, format: "mp3" };
  // Convert WebM, MP4, OGG, or unknown to WAV
  const wavBuffer = await convertToWav(audioBuffer);
  return { buffer: wavBuffer, format: "wav" };
}

/**
 * Extract audio from video file and return as base64-encoded WAV.
 * Used for iOS Safari which doesn't support separate audio MediaRecorder.
 * This extracts the audio track from a video file using ffmpeg.
 */
export async function extractAudioFromVideo(base64Video: string): Promise<string> {
  console.log("[extractAudioFromVideo] Starting, input length:", base64Video.length);
  
  const videoBuffer = Buffer.from(base64Video, "base64");
  console.log("[extractAudioFromVideo] Video buffer size:", videoBuffer.length);
  
  const inputPath = join(tmpdir(), `video-input-${randomUUID()}`);
  const outputPath = join(tmpdir(), `audio-output-${randomUUID()}.wav`);

  try {
    await writeFile(inputPath, videoBuffer);
    console.log("[extractAudioFromVideo] Written video to:", inputPath);

    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i", inputPath,
        "-vn",              // No video output
        "-f", "wav",
        "-ar", "16000",     // 16kHz sample rate (good for speech)
        "-ac", "1",         // Mono
        "-acodec", "pcm_s16le",
        "-y",               // Overwrite output
        outputPath,
      ]);

      let stderr = "";
      ffmpeg.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      ffmpeg.on("close", (code) => {
        if (code === 0) {
          console.log("[extractAudioFromVideo] ffmpeg extraction successful");
          resolve();
        } else {
          console.error("[extractAudioFromVideo] ffmpeg error:", stderr);
          reject(new Error(`ffmpeg exited with code ${code}`));
        }
      });
      ffmpeg.on("error", reject);
    });

    const audioBuffer = await readFile(outputPath);
    console.log("[extractAudioFromVideo] Extracted audio size:", audioBuffer.length);
    
    const base64Audio = audioBuffer.toString("base64");
    console.log("[extractAudioFromVideo] Base64 audio length:", base64Audio.length);
    
    return base64Audio;
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}

/**
 * Voice Chat: User speaks, LLM responds with audio (audio-in, audio-out).
 * Uses gpt-audio model via Replit AI Integrations.
 * Note: Browser records WebM/opus - convert to WAV using ffmpeg before calling this.
 */
export async function voiceChat(
  audioBuffer: Buffer,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy",
  inputFormat: "wav" | "mp3" = "wav",
  outputFormat: "wav" | "mp3" = "mp3"
): Promise<{ transcript: string; audioResponse: Buffer }> {
  const audioBase64 = audioBuffer.toString("base64");
  const response = await openai.chat.completions.create({
    model: "gpt-audio",
    modalities: ["text", "audio"],
    audio: { voice, format: outputFormat },
    messages: [{
      role: "user",
      content: [
        { type: "input_audio", input_audio: { data: audioBase64, format: inputFormat } },
      ],
    }],
  });
  const message = response.choices[0]?.message as any;
  const transcript = message?.audio?.transcript || message?.content || "";
  const audioData = message?.audio?.data ?? "";
  return {
    transcript,
    audioResponse: Buffer.from(audioData, "base64"),
  };
}

/**
 * Streaming Voice Chat: For real-time audio responses.
 * Note: Streaming only supports pcm16 output format.
 *
 * @example
 * // Converting browser WebM to WAV before calling:
 * const webmBuffer = Buffer.from(req.body.audio, "base64");
 * const wavBuffer = await convertWebmToWav(webmBuffer);
 * for await (const chunk of voiceChatStream(wavBuffer)) { ... }
 */
export async function voiceChatStream(
  audioBuffer: Buffer,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy",
  inputFormat: "wav" | "mp3" = "wav"
): Promise<AsyncIterable<{ type: "transcript" | "audio"; data: string }>> {
  const audioBase64 = audioBuffer.toString("base64");
  const stream = await openai.chat.completions.create({
    model: "gpt-audio",
    modalities: ["text", "audio"],
    audio: { voice, format: "pcm16" },
    messages: [{
      role: "user",
      content: [
        { type: "input_audio", input_audio: { data: audioBase64, format: inputFormat } },
      ],
    }],
    stream: true,
  });

  return (async function* () {
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta as any;
      if (!delta) continue;
      if (delta?.audio?.transcript) {
        yield { type: "transcript", data: delta.audio.transcript };
      }
      if (delta?.audio?.data) {
        yield { type: "audio", data: delta.audio.data };
      }
    }
  })();
}

/**
 * Text-to-Speech: Converts text to speech verbatim.
 * Uses gpt-audio model via Replit AI Integrations.
 */
export async function textToSpeech(
  text: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy",
  format: "wav" | "mp3" | "flac" | "opus" | "pcm16" = "wav"
): Promise<Buffer> {
  const response = await openai.chat.completions.create({
    model: "gpt-audio",
    modalities: ["text", "audio"],
    audio: { voice, format },
    messages: [
      { role: "system", content: "You are an assistant that performs text-to-speech." },
      { role: "user", content: `Repeat the following text verbatim: ${text}` },
    ],
  });
  const audioData = (response.choices[0]?.message as any)?.audio?.data ?? "";
  return Buffer.from(audioData, "base64");
}

/**
 * Streaming Text-to-Speech: Converts text to speech with real-time streaming.
 * Uses gpt-audio model via Replit AI Integrations.
 * Note: Streaming only supports pcm16 output format.
 */
export async function textToSpeechStream(
  text: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy"
): Promise<AsyncIterable<string>> {
  const stream = await openai.chat.completions.create({
    model: "gpt-audio",
    modalities: ["text", "audio"],
    audio: { voice, format: "pcm16" },
    messages: [
      { role: "system", content: "You are an assistant that performs text-to-speech." },
      { role: "user", content: `Repeat the following text verbatim: ${text}` },
    ],
    stream: true,
  });

  return (async function* () {
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta as any;
      if (!delta) continue;
      if (delta?.audio?.data) {
        yield delta.audio.data;
      }
    }
  })();
}

/**
 * Speech-to-Text: Transcribes audio using dedicated transcription model.
 * Uses gpt-4o-mini-transcribe for accurate transcription.
 */
export async function speechToText(
  audioBuffer: Buffer,
  format: "wav" | "mp3" | "webm" = "wav",
  prompt?: string
): Promise<string> {
  const file = await toFile(audioBuffer, `audio.${format}`);
  const response = await openai.audio.transcriptions.create({
    file,
    model: "gpt-4o-mini-transcribe",
    prompt,
  });
  return response.text;
}

/**
 * Streaming Speech-to-Text: Transcribes audio with real-time streaming.
 * Uses gpt-4o-mini-transcribe for accurate transcription.
 */
export async function speechToTextStream(
  audioBuffer: Buffer,
  format: "wav" | "mp3" | "webm" = "wav"
): Promise<AsyncIterable<string>> {
  const file = await toFile(audioBuffer, `audio.${format}`);
  const stream = await openai.audio.transcriptions.create({
    file,
    model: "gpt-4o-mini-transcribe",
    stream: true,
  });

  return (async function* () {
    for await (const event of stream) {
      if (event.type === "transcript.text.delta") {
        yield event.delta;
      }
    }
  })();
}

/**
 * Transcribe audio from base64 encoded data.
 * Handles format detection and conversion automatically.
 */
export async function transcribeAudio(base64Audio: string, prompt?: string): Promise<string> {
  const audioBuffer = Buffer.from(base64Audio, "base64");
  const { buffer, format } = await ensureCompatibleFormat(audioBuffer);
  return speechToText(buffer, format, prompt);
}

/**
 * Generate player highlights from coach commentary using AI.
 */
export async function generatePlayerHighlights(
  commentary: Array<{ text: string; quarter: number }>,
  playerStats: Record<string, any>,
  roster: string[]
): Promise<string> {
  const commentaryText = commentary
    .map(c => `Q${c.quarter}: ${c.text}`)
    .join("\n");
  
  const statsText = Object.entries(playerStats)
    .filter(([name]) => roster.includes(name))
    .map(([name, stats]) => {
      const s = stats as any;
      const highlights = [];
      if ((s.touchdowns || 0) + (s.qbTouchdowns || 0) > 0) highlights.push(`${(s.touchdowns || 0) + (s.qbTouchdowns || 0)} TDs`);
      if (s.catches > 0) highlights.push(`${s.catches} catches`);
      if (s.flagPulls > 0) highlights.push(`${s.flagPulls} flag pulls`);
      if (s.interceptions > 0) highlights.push(`${s.interceptions} INTs`);
      return `${name}: ${highlights.join(", ") || "team contributor"}`;
    })
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a sports commentator writing brief, exciting player highlights for a youth flag football game recap. Keep it positive and encouraging. Maximum 3-4 sentences total covering top performers."
      },
      {
        role: "user",
        content: `Based on this coach commentary and stats, write brief player highlights:\n\nCoach Commentary:\n${commentaryText || "No commentary recorded"}\n\nPlayer Stats:\n${statsText}`
      }
    ],
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content || "Great game by the team!";
}

/**
 * Parse natural language play command into structured play data.
 * Uses AI to extract QB, receiver, play type, and descriptive notes.
 */
export interface ParsedPlay {
  playType: 'pass' | 'run' | 'defense' | 'conversion' | 'unknown';
  qb?: string;
  receiver?: string;
  runner?: string;
  defender?: string;
  opponentAction?: 'pass' | 'run' | 'scramble';
  opponentResult?: 'firstDown' | 'touchdown' | 'incomplete' | 'noGain' | 'shortGain';
  result: 'catch' | 'firstDown' | 'touchdown' | 'incomplete' | 'interception' | 'drop' | 
          'run' | 'runFirstDown' | 'flagPull' | 'sack' | 'extraPoint' | 'twoPoint' | 'pick6' | 'unknown';
  description?: string;
  tickerText?: string;
  cleanedCommentary?: string;
  confidence: 'high' | 'medium' | 'low';
}

export async function parsePlayCommand(
  transcription: string,
  roster: string[],
  playerAliases: Record<string, string[]>
): Promise<ParsedPlay> {
  const aliasMapping = Object.entries(playerAliases)
    .map(([name, aliases]) => `${name}: ${aliases.join(", ")}`)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an ELITE professional sports commentator and play-by-play analyst for flag football. Your job is to:
1. Parse spoken play descriptions into structured data
2. Transform ANY speech (even mumbled, unclear, or incomplete) into PROFESSIONAL broadcast-quality commentary
3. Handle MULTIPLE plays in one recording (offense AND defense together)
4. For OPPONENT PLAYS: Capture WHAT the opponent did AND who stopped them!

YOU ARE THE VOICE OF THE GAME. Make everything sound like ESPN Sunday Night Football!

ROSTER (CRITICAL - use ONLY these EXACT strings for qb/receiver/runner/defender fields):
${roster.join(", ")}

IMPORTANT NAME MATCHING RULES:
- For qb, receiver, runner, defender fields: Output MUST be EXACTLY one of the roster names above
- CRITICAL: "Slides" or "Slide" = Sly Willis! When you hear "Slides" it's the player Sly, NOT an action verb!
- If you hear "Sly", "Slides", "Slide", "Willis", or "Sly Willis" → output "Sly" (the player Sly Willis)
- If you hear "Davis Olson" or "Olson" → output "Davis" (not "Davis Olson")
- SPELLING: It's always "Olson" (never "Olsen") - Davis Olson, not Davis Olsen
- If you hear "Knox Hager" or "Hager" or "Max" or "Max Hager" → output "Knox" (not "Knox Hager")
- If you hear "Hudson Paulus" or "Paulus" → output "Hudson" (not "Hudson Paulus")
- NEVER output full names in qb/receiver/runner/defender - ONLY the first name from roster
- For cleanedCommentary text, you CAN use full names for dramatic effect

PLAYER ALIASES (match any of these to the roster name):
${aliasMapping}

PLAY TYPES TO RECOGNIZE:
- OUR OFFENSE PASS: "[QB] to [Receiver] [result]" - results: catch, firstDown, touchdown, incomplete, drop
  IMPORTANT RESULT PRIORITY FOR PASSES:
  - If "touchdown" or "TD" is mentioned → result = "touchdown" (QB gets qbTouchdowns, receiver gets touchdowns)
  - If "first down" is mentioned → result = "firstDown" (QB gets qbFirstDownThrows, receiver gets catchFirstDowns)
  - If just "catch" or "complete" with no first down/TD → result = "catch"
  - ALWAYS prefer "firstDown" or "touchdown" over plain "catch" when applicable!
- OUR OFFENSE RUN: "[Runner] runs [result]" - results: run, runFirstDown, touchdown
  - If runner gets a "first down" → result = "runFirstDown" (NOT "run")
- TRICK PLAYS / PITCHES / LATERALS: Listen for multi-step plays!
  - "Hudson pitched to Bennett, Bennett threw TD to Knox" = Bennett is QB (he THREW the pass!), Knox catches TD
  - "Sly laterals to Bennett, Bennett launches to Knox" = Bennett is QB (thrower), Knox is receiver
  - CRITICAL: The player who THROWS THE FORWARD PASS is the QB! Not the pitcher/lateral-er!
  - A pitch/lateral/toss backwards is NOT a pass - it's just a handoff! Only the THROW counts as a pass!
  - The commentary MUST mention ALL players involved in sequence!
- DEFENSE/OPPONENT PLAYS: When describing what the OTHER TEAM did + who stopped them
  - Examples: "opponent scrambles, throws for first down, Bryce pulls the flag"
  - Examples: "they ran it up the middle, Hudson makes the stop"
  - Examples: "other team passes for a touchdown" (even without a defender mentioned)
  - results: flagPull, interception, sack, pick6
  - "pick 6", "pick six", "interception for touchdown" = pick6 (6 POINTS for defense!)
- CONVERSIONS: "extra point/XP/2-point" - results: extraPoint, twoPoint

OPPONENT PLAY DETECTION - CRITICAL:
When you hear words like "opponent", "other team", "they", "them", "their", or descriptions of the opposing team making plays:
- Set playType to "defense" 
- Set opponentAction: what they did (pass, run, scramble)
- Set opponentResult: what happened (firstDown, touchdown, incomplete, noGain, shortGain)
- Set defender: which of OUR players made the stop (if mentioned)
- The commentary MUST describe BOTH what opponent did AND our defensive response!

Extract:
1. playType: pass, run, defense, conversion, or unknown
2. qb: quarterback/thrower (OUR pass/conversion only)
3. receiver: receiver/catcher (OUR pass/conversion only)
4. runner: ball carrier (OUR run plays only)
5. defender: OUR defensive player who made the stop (defense plays only)
6. opponentAction: what opponent did (pass, run, scramble) - for defense plays only
7. opponentResult: opponent's play result (firstDown, touchdown, incomplete, noGain, shortGain) - for defense plays only
8. result: exact value from above lists, or pick6 for defensive TDs
9. description: colorful details ("diving", "one-handed", "toe-drag swag", "circus catch", "scrambles out of pressure")
10. tickerText: ELITE BROADCAST HEADLINE (max 80 chars) - DESCRIBE THE FULL PLAY! Examples:
   - TRICK PLAYS: "HUDSON PITCHES TO BENNETT - BENNETT FIRES THE TD PASS TO KNOX!"
   - TRICK PLAYS: "SLY LATERALS TO HAMPTON WHO THROWS DEEP - TOUCHDOWN!"
   - OPPONENT: "OPPONENT QB SCRAMBLES AND FIRES FOR FIRST DOWN - BRYCE HALTER MAKES THE STOP!"
   - OPPONENT: "THEY RUN IT UP THE MIDDLE - HUDSON CLOSES IN FOR THE FLAG PULL!"
11. cleanedCommentary: POLISHED version. DESCRIBE ALL PLAYERS INVOLVED:
   - TRICK PLAY Raw: "Hudson pitched to Bennett, Bennett threw touchdown to Knox"
   - TRICK PLAY Cleaned: "Hudson Paulus pitches to Bennett Walters, who fires a beautiful touchdown pass to Knox Hager!"
   - OPPONENT Raw: "opponent scrambles throws first down Bryce pulls flag"
   - OPPONENT Cleaned: "The opponent QB scrambles and fires a pass for a first down, but Bryce Halter is there to make the stop!"
12. confidence: high/medium/low

CRITICAL RULES:
- TRICK PLAYS: When you hear "pitched", "lateral", "toss", or one player giving to another who then throws:
  * The player who THROWS THE FORWARD PASS is the QB (gets passing stats)
  * The pitcher/lateral-er does NOT get QB credit (they just handed off)
  * Example: "Hudson pitches to Bennett, Bennett throws TD" = Bennett is QB (he threw!), NOT Hudson
- OPPONENT PLAYS: Always describe what the opponent did + our defensive response in both tickerText AND cleanedCommentary!
- ALWAYS include play action details in tickerText (cuts, dodges, dives, leaps, breaks tackles, scrambles)
- cleanedCommentary must be professional - clean up stutters, filler words, rambling
- Sound like an ESPN primetime commentator at ALL times
- Use player names correctly from the roster
- Defense plays ALWAYS use "defender" field, offense uses "qb"/"receiver"/"runner"
- If unclear, make your BEST guess and sound confident about it!

Respond with ONLY valid JSON, no markdown.`
      },
      {
        role: "user",
        content: transcription
      }
    ],
    max_tokens: 300,
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content || "{}";
  
  // Helper to normalize player names to roster names (handle full names like "Sly Willis" -> "Sly")
  const normalizeToRoster = (name: string | undefined): string | undefined => {
    if (!name) return undefined;
    // First check if it's already an exact roster match
    if (roster.includes(name)) return name;
    // Check if any roster name is contained in the input (handles "Sly Willis" -> "Sly")
    const lowerName = name.toLowerCase();
    for (const rosterName of roster) {
      if (lowerName.includes(rosterName.toLowerCase()) || lowerName.startsWith(rosterName.toLowerCase())) {
        return rosterName;
      }
    }
    // Check aliases
    for (const [rosterName, aliases] of Object.entries(playerAliases)) {
      for (const alias of aliases) {
        if (lowerName.includes(alias.toLowerCase())) {
          return rosterName;
        }
      }
    }
    return name; // Return original if no match found
  };
  
  try {
    const cleanJson = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return {
      playType: parsed.playType || 'unknown',
      qb: normalizeToRoster(parsed.qb),
      receiver: normalizeToRoster(parsed.receiver),
      runner: normalizeToRoster(parsed.runner),
      defender: normalizeToRoster(parsed.defender),
      opponentAction: parsed.opponentAction,
      opponentResult: parsed.opponentResult,
      result: parsed.result || 'unknown',
      description: parsed.description,
      tickerText: parsed.tickerText,
      cleanedCommentary: parsed.cleanedCommentary,
      confidence: parsed.confidence || 'low',
    };
  } catch {
    return {
      playType: 'unknown',
      result: 'unknown',
      confidence: 'low',
    };
  }
}
