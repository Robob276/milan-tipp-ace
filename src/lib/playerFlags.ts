// Player name to flag mapping
// Uses country/regional flag images

import brandenburgFlag from '@/assets/flags/brandenburg.jpg';
import berlinFlag from '@/assets/flags/berlin.png';
import bayernFlag from '@/assets/flags/bayern.png';
import ddrFlag from '@/assets/flags/ddr.png';

export const playerFlags: Record<string, string> = {
  "Robert B": "🇩🇪",           // Deutschland
  "Aurore": "🇫🇷",             // Frankreich
  "Marcus G": brandenburgFlag,  // Brandenburg
  "Sebastian S": "🇦🇹",        // Österreich
  "Marcus B": "🇫🇷",           // Frankreich
  "Marcel K": berlinFlag,       // Berlin
  "Rainer": ddrFlag,            // DDR
  "Hasenmatz": "🇳🇴",          // Norwegen
  "TillAnton": bayernFlag,      // Bayern
};

export function getPlayerFlag(playerName: string): string {
  return playerFlags[playerName] || "";
}
