// Player name to flag mapping
// Uses country emojis for national flags and regional symbols where available

export const playerFlags: Record<string, string> = {
  "Robert B": "🇩🇪",      // Deutschland
  "Aurore": "🇫🇷",        // Frankreich
  "Marcus G": "🦅",        // Brandenburg (Roter Adler)
  "Sebastian S": "🇦🇹",   // Österreich
  "Marcus B": "🇫🇷",      // Frankreich
  "Marcel K": "🐻",        // Berlin (Berliner Bär)
  "Rainer": "⚒️",          // DDR (Hammer und Zirkel Symbol)
  "Hasenmatz": "🇳🇴",     // Norwegen
  "TillAnton": "🏔️",       // Bayern (Alpen-Symbol)
};

export function getPlayerFlag(playerName: string): string {
  return playerFlags[playerName] || "";
}
