// Player name to flag mapping
// Uses country/regional flag images

import brandenburgFlag from '@/assets/flags/brandenburg.jpg';
import berlinFlag from '@/assets/flags/berlin.png';
import bayernFlag from '@/assets/flags/bayern.png';
import ddrFlag from '@/assets/flags/ddr.png';
import frankreichFlag from '@/assets/flags/frankreich.png';
import deutschlandFlag from '@/assets/flags/deutschland.png';
import oesterreichFlag from '@/assets/flags/oesterreich.png';
import norwegenFlag from '@/assets/flags/norwegen.jpg';

export const playerFlags: Record<string, string> = {
  "Robert B": deutschlandFlag,      // Deutschland
  "Aurore": frankreichFlag,          // Frankreich
  "Marcus G": brandenburgFlag,       // Brandenburg
  "Sebastian S": oesterreichFlag,    // Österreich
  "Marcus B": frankreichFlag,        // Frankreich
  "Marcel K": berlinFlag,            // Berlin
  "Rainer": ddrFlag,                 // DDR
  "Hasenmatz": norwegenFlag,         // Norwegen
  "TillAnton": bayernFlag,           // Bayern
};

export function getPlayerFlag(playerName: string): string {
  return playerFlags[playerName] || "";
}

// All flags are now images, so this always returns true if flag exists
export function isImageFlag(flag: string): boolean {
  return flag.length > 0;
}
