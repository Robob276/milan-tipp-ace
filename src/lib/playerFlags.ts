// Player name to flag mapping
// Uses country emojis and Unicode Tag Sequences for regional flags

// Regional flags use Unicode Tag Sequences (may not display on all platforms)
// Format: 🏴 + tag characters for ISO 3166-2 subdivision codes

export const playerFlags: Record<string, string> = {
  "Robert B": "🇩🇪",           // Deutschland
  "Aurore": "🇫🇷",             // Frankreich
  "Marcus G": "🏴󠁤󠁥󠁢󠁢󠁿",         // Brandenburg (DE-BB)
  "Sebastian S": "🇦🇹",        // Österreich
  "Marcus B": "🇫🇷",           // Frankreich
  "Marcel K": "🏴󠁤󠁥󠁢󠁥󠁿",         // Berlin (DE-BE)
  "Rainer": "🇩🇪",             // DDR - using German flag as DDR flag not available
  "Hasenmatz": "🇳🇴",          // Norwegen
  "TillAnton": "🏴󠁤󠁥󠁢󠁹󠁿",        // Bayern (DE-BY)
};

export function getPlayerFlag(playerName: string): string {
  return playerFlags[playerName] || "";
}
