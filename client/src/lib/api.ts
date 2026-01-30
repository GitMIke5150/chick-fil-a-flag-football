import type { Game, InsertGame, UpdateGame } from "@shared/schema";

export async function fetchGames(): Promise<Game[]> {
  const response = await fetch("/api/games");
  if (!response.ok) throw new Error("Failed to fetch games");
  return response.json();
}

export async function fetchGame(id: number): Promise<Game> {
  const response = await fetch(`/api/games/${id}`);
  if (!response.ok) throw new Error("Failed to fetch game");
  return response.json();
}

export async function createGame(game: InsertGame): Promise<Game> {
  const response = await fetch("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game),
  });
  if (!response.ok) throw new Error("Failed to create game");
  return response.json();
}

export async function updateGame(id: number, game: UpdateGame): Promise<Game> {
  const response = await fetch(`/api/games/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game),
  });
  if (!response.ok) throw new Error("Failed to update game");
  return response.json();
}

export async function deleteGame(id: number): Promise<void> {
  const response = await fetch(`/api/games/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete game");
}
