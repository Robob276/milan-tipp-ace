export interface OlympicEvent {
  id: number;
  date: string;
  time: string;
  sport: string;
  discipline: string;
  gender: string;
  category: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface User {
  id: number;
  name: string;
  pin: string;
}

export interface Prediction {
  eventId: number;
  gold: string;
  silver: string;
  bronze: string;
}

export interface Result {
  eventId: number;
  gold: string;
  silver: string;
  bronze: string;
}

// Alle Sportarten der Olympischen Winterspiele 2026 in Mailand-Cortina
export const olympicEvents: OlympicEvent[] = [
  // Biathlon
  { id: 1, date: "2026-02-07", time: "11:00", sport: "Biathlon", discipline: "Sprint", gender: "Frauen", category: "Biathlon" },
  { id: 2, date: "2026-02-08", time: "11:00", sport: "Biathlon", discipline: "Sprint", gender: "Männer", category: "Biathlon" },
  { id: 3, date: "2026-02-09", time: "14:30", sport: "Biathlon", discipline: "Verfolgung", gender: "Frauen", category: "Biathlon" },
  { id: 4, date: "2026-02-10", time: "14:30", sport: "Biathlon", discipline: "Verfolgung", gender: "Männer", category: "Biathlon" },
  { id: 5, date: "2026-02-11", time: "11:00", sport: "Biathlon", discipline: "Einzel", gender: "Frauen", category: "Biathlon" },
  { id: 6, date: "2026-02-12", time: "11:00", sport: "Biathlon", discipline: "Einzel", gender: "Männer", category: "Biathlon" },
  { id: 7, date: "2026-02-14", time: "14:00", sport: "Biathlon", discipline: "Staffel", gender: "Frauen", category: "Biathlon" },
  { id: 8, date: "2026-02-15", time: "14:00", sport: "Biathlon", discipline: "Staffel", gender: "Männer", category: "Biathlon" },
  { id: 9, date: "2026-02-17", time: "14:00", sport: "Biathlon", discipline: "Mixed-Staffel", gender: "Mixed", category: "Biathlon" },
  { id: 10, date: "2026-02-20", time: "12:30", sport: "Biathlon", discipline: "Massenstart", gender: "Frauen", category: "Biathlon" },
  { id: 11, date: "2026-02-21", time: "12:30", sport: "Biathlon", discipline: "Massenstart", gender: "Männer", category: "Biathlon" },

  // Ski Alpin
  { id: 12, date: "2026-02-08", time: "10:30", sport: "Ski Alpin", discipline: "Abfahrt", gender: "Männer", category: "Ski Alpin" },
  { id: 13, date: "2026-02-09", time: "10:30", sport: "Ski Alpin", discipline: "Abfahrt", gender: "Frauen", category: "Ski Alpin" },
  { id: 14, date: "2026-02-11", time: "10:30", sport: "Ski Alpin", discipline: "Super-G", gender: "Männer", category: "Ski Alpin" },
  { id: 15, date: "2026-02-12", time: "10:30", sport: "Ski Alpin", discipline: "Super-G", gender: "Frauen", category: "Ski Alpin" },
  { id: 16, date: "2026-02-14", time: "10:00", sport: "Ski Alpin", discipline: "Riesenslalom", gender: "Frauen", category: "Ski Alpin" },
  { id: 17, date: "2026-02-15", time: "10:00", sport: "Ski Alpin", discipline: "Riesenslalom", gender: "Männer", category: "Ski Alpin" },
  { id: 18, date: "2026-02-17", time: "10:00", sport: "Ski Alpin", discipline: "Slalom", gender: "Frauen", category: "Ski Alpin" },
  { id: 19, date: "2026-02-18", time: "10:00", sport: "Ski Alpin", discipline: "Slalom", gender: "Männer", category: "Ski Alpin" },
  { id: 20, date: "2026-02-19", time: "10:00", sport: "Ski Alpin", discipline: "Kombination", gender: "Frauen", category: "Ski Alpin" },
  { id: 21, date: "2026-02-20", time: "10:00", sport: "Ski Alpin", discipline: "Kombination", gender: "Männer", category: "Ski Alpin" },
  { id: 22, date: "2026-02-22", time: "10:00", sport: "Ski Alpin", discipline: "Team", gender: "Mixed", category: "Ski Alpin" },

  // Skispringen
  { id: 23, date: "2026-02-08", time: "17:30", sport: "Skispringen", discipline: "Normalschanze", gender: "Frauen", category: "Skispringen" },
  { id: 24, date: "2026-02-09", time: "17:30", sport: "Skispringen", discipline: "Normalschanze", gender: "Männer", category: "Skispringen" },
  { id: 25, date: "2026-02-13", time: "17:30", sport: "Skispringen", discipline: "Großschanze", gender: "Frauen", category: "Skispringen" },
  { id: 26, date: "2026-02-14", time: "17:30", sport: "Skispringen", discipline: "Großschanze", gender: "Männer", category: "Skispringen" },
  { id: 27, date: "2026-02-16", time: "17:30", sport: "Skispringen", discipline: "Team", gender: "Männer", category: "Skispringen" },
  { id: 28, date: "2026-02-17", time: "17:30", sport: "Skispringen", discipline: "Mixed Team", gender: "Mixed", category: "Skispringen" },

  // Langlauf
  { id: 29, date: "2026-02-08", time: "12:00", sport: "Langlauf", discipline: "Skiathlon", gender: "Frauen", category: "Langlauf" },
  { id: 30, date: "2026-02-09", time: "12:00", sport: "Langlauf", discipline: "Skiathlon", gender: "Männer", category: "Langlauf" },
  { id: 31, date: "2026-02-11", time: "12:00", sport: "Langlauf", discipline: "Sprint", gender: "Frauen", category: "Langlauf" },
  { id: 32, date: "2026-02-11", time: "13:00", sport: "Langlauf", discipline: "Sprint", gender: "Männer", category: "Langlauf" },
  { id: 33, date: "2026-02-13", time: "12:00", sport: "Langlauf", discipline: "Team Sprint", gender: "Frauen", category: "Langlauf" },
  { id: 34, date: "2026-02-13", time: "14:00", sport: "Langlauf", discipline: "Team Sprint", gender: "Männer", category: "Langlauf" },
  { id: 35, date: "2026-02-15", time: "09:00", sport: "Langlauf", discipline: "10km/15km", gender: "Frauen", category: "Langlauf" },
  { id: 36, date: "2026-02-16", time: "09:00", sport: "Langlauf", discipline: "10km/15km", gender: "Männer", category: "Langlauf" },
  { id: 37, date: "2026-02-18", time: "11:00", sport: "Langlauf", discipline: "Staffel", gender: "Frauen", category: "Langlauf" },
  { id: 38, date: "2026-02-19", time: "11:00", sport: "Langlauf", discipline: "Staffel", gender: "Männer", category: "Langlauf" },
  { id: 39, date: "2026-02-21", time: "09:00", sport: "Langlauf", discipline: "30km/50km", gender: "Frauen", category: "Langlauf" },
  { id: 40, date: "2026-02-22", time: "09:00", sport: "Langlauf", discipline: "30km/50km", gender: "Männer", category: "Langlauf" },

  // Nordische Kombination
  { id: 41, date: "2026-02-10", time: "10:00", sport: "Nordische Kombination", discipline: "Normalschanze", gender: "Männer", category: "Nordische Kombination" },
  { id: 42, date: "2026-02-14", time: "10:00", sport: "Nordische Kombination", discipline: "Großschanze", gender: "Männer", category: "Nordische Kombination" },
  { id: 43, date: "2026-02-18", time: "10:00", sport: "Nordische Kombination", discipline: "Team", gender: "Männer", category: "Nordische Kombination" },

  // Bob
  { id: 44, date: "2026-02-14", time: "19:30", sport: "Bob", discipline: "Monobob", gender: "Frauen", category: "Bob" },
  { id: 45, date: "2026-02-16", time: "19:30", sport: "Bob", discipline: "Zweierbob", gender: "Männer", category: "Bob" },
  { id: 46, date: "2026-02-18", time: "19:30", sport: "Bob", discipline: "Zweierbob", gender: "Frauen", category: "Bob" },
  { id: 47, date: "2026-02-22", time: "19:30", sport: "Bob", discipline: "Viererbob", gender: "Männer", category: "Bob" },

  // Skeleton
  { id: 48, date: "2026-02-13", time: "19:30", sport: "Skeleton", discipline: "Einzel", gender: "Frauen", category: "Skeleton" },
  { id: 49, date: "2026-02-14", time: "09:30", sport: "Skeleton", discipline: "Einzel", gender: "Männer", category: "Skeleton" },

  // Rodeln
  { id: 50, date: "2026-02-08", time: "19:00", sport: "Rodeln", discipline: "Einzel", gender: "Männer", category: "Rodeln" },
  { id: 51, date: "2026-02-10", time: "19:00", sport: "Rodeln", discipline: "Einzel", gender: "Frauen", category: "Rodeln" },
  { id: 52, date: "2026-02-12", time: "19:00", sport: "Rodeln", discipline: "Doppelsitzer", gender: "Mixed", category: "Rodeln" },
  { id: 53, date: "2026-02-13", time: "19:00", sport: "Rodeln", discipline: "Team-Staffel", gender: "Mixed", category: "Rodeln" },

  // Eiskunstlauf
  { id: 54, date: "2026-02-07", time: "10:00", sport: "Eiskunstlauf", discipline: "Team", gender: "Mixed", category: "Eiskunstlauf" },
  { id: 55, date: "2026-02-12", time: "19:00", sport: "Eiskunstlauf", discipline: "Einzel", gender: "Männer", category: "Eiskunstlauf" },
  { id: 56, date: "2026-02-14", time: "19:00", sport: "Eiskunstlauf", discipline: "Paarlauf", gender: "Mixed", category: "Eiskunstlauf" },
  { id: 57, date: "2026-02-17", time: "19:00", sport: "Eiskunstlauf", discipline: "Eistanz", gender: "Mixed", category: "Eiskunstlauf" },
  { id: 58, date: "2026-02-20", time: "19:00", sport: "Eiskunstlauf", discipline: "Einzel", gender: "Frauen", category: "Eiskunstlauf" },

  // Eisschnelllauf
  { id: 59, date: "2026-02-08", time: "16:00", sport: "Eisschnelllauf", discipline: "5000m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 60, date: "2026-02-09", time: "16:00", sport: "Eisschnelllauf", discipline: "3000m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 61, date: "2026-02-10", time: "14:30", sport: "Eisschnelllauf", discipline: "1500m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 62, date: "2026-02-11", time: "14:30", sport: "Eisschnelllauf", discipline: "1500m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 63, date: "2026-02-13", time: "16:00", sport: "Eisschnelllauf", discipline: "500m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 64, date: "2026-02-14", time: "16:00", sport: "Eisschnelllauf", discipline: "500m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 65, date: "2026-02-15", time: "14:00", sport: "Eisschnelllauf", discipline: "Team-Verfolgung", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 66, date: "2026-02-16", time: "14:00", sport: "Eisschnelllauf", discipline: "Team-Verfolgung", gender: "Männer", category: "Eisschnelllauf" },
  { id: 67, date: "2026-02-18", time: "16:00", sport: "Eisschnelllauf", discipline: "10000m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 68, date: "2026-02-19", time: "14:00", sport: "Eisschnelllauf", discipline: "1000m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 69, date: "2026-02-20", time: "14:00", sport: "Eisschnelllauf", discipline: "1000m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 70, date: "2026-02-21", time: "14:00", sport: "Eisschnelllauf", discipline: "5000m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 71, date: "2026-02-22", time: "14:00", sport: "Eisschnelllauf", discipline: "Massenstart", gender: "Mixed", category: "Eisschnelllauf" },

  // Short Track
  { id: 72, date: "2026-02-08", time: "18:00", sport: "Short Track", discipline: "Mixed Staffel", gender: "Mixed", category: "Short Track" },
  { id: 73, date: "2026-02-10", time: "18:00", sport: "Short Track", discipline: "500m", gender: "Frauen", category: "Short Track" },
  { id: 74, date: "2026-02-12", time: "18:00", sport: "Short Track", discipline: "1000m", gender: "Männer", category: "Short Track" },
  { id: 75, date: "2026-02-14", time: "18:00", sport: "Short Track", discipline: "1500m", gender: "Frauen", category: "Short Track" },
  { id: 76, date: "2026-02-16", time: "18:00", sport: "Short Track", discipline: "500m", gender: "Männer", category: "Short Track" },
  { id: 77, date: "2026-02-19", time: "18:00", sport: "Short Track", discipline: "1000m", gender: "Frauen", category: "Short Track" },
  { id: 78, date: "2026-02-21", time: "18:00", sport: "Short Track", discipline: "1500m", gender: "Männer", category: "Short Track" },
  { id: 79, date: "2026-02-22", time: "18:00", sport: "Short Track", discipline: "Staffel", gender: "Mixed", category: "Short Track" },

  // Curling
  { id: 80, date: "2026-02-08", time: "14:00", sport: "Curling", discipline: "Mixed Doubles", gender: "Mixed", category: "Curling" },
  { id: 81, date: "2026-02-20", time: "14:00", sport: "Curling", discipline: "Turnier", gender: "Frauen", category: "Curling" },
  { id: 82, date: "2026-02-21", time: "14:00", sport: "Curling", discipline: "Turnier", gender: "Männer", category: "Curling" },

  // Eishockey
  { id: 83, date: "2026-02-20", time: "12:00", sport: "Eishockey", discipline: "Finale", gender: "Frauen", category: "Eishockey" },
  { id: 84, date: "2026-02-22", time: "12:00", sport: "Eishockey", discipline: "Finale", gender: "Männer", category: "Eishockey" },

  // Freestyle Skiing
  { id: 85, date: "2026-02-07", time: "10:00", sport: "Freestyle", discipline: "Moguls", gender: "Frauen", category: "Freestyle" },
  { id: 86, date: "2026-02-08", time: "10:00", sport: "Freestyle", discipline: "Moguls", gender: "Männer", category: "Freestyle" },
  { id: 87, date: "2026-02-10", time: "10:00", sport: "Freestyle", discipline: "Aerials", gender: "Frauen", category: "Freestyle" },
  { id: 88, date: "2026-02-11", time: "10:00", sport: "Freestyle", discipline: "Aerials", gender: "Männer", category: "Freestyle" },
  { id: 89, date: "2026-02-12", time: "10:00", sport: "Freestyle", discipline: "Ski Cross", gender: "Frauen", category: "Freestyle" },
  { id: 90, date: "2026-02-13", time: "10:00", sport: "Freestyle", discipline: "Ski Cross", gender: "Männer", category: "Freestyle" },
  { id: 91, date: "2026-02-14", time: "10:00", sport: "Freestyle", discipline: "Halfpipe", gender: "Frauen", category: "Freestyle" },
  { id: 92, date: "2026-02-15", time: "10:00", sport: "Freestyle", discipline: "Halfpipe", gender: "Männer", category: "Freestyle" },
  { id: 93, date: "2026-02-17", time: "10:00", sport: "Freestyle", discipline: "Slopestyle", gender: "Frauen", category: "Freestyle" },
  { id: 94, date: "2026-02-18", time: "10:00", sport: "Freestyle", discipline: "Slopestyle", gender: "Männer", category: "Freestyle" },
  { id: 95, date: "2026-02-19", time: "10:00", sport: "Freestyle", discipline: "Big Air", gender: "Frauen", category: "Freestyle" },
  { id: 96, date: "2026-02-20", time: "10:00", sport: "Freestyle", discipline: "Big Air", gender: "Männer", category: "Freestyle" },
  { id: 97, date: "2026-02-21", time: "10:00", sport: "Freestyle", discipline: "Dual Moguls", gender: "Frauen", category: "Freestyle" },
  { id: 98, date: "2026-02-22", time: "10:00", sport: "Freestyle", discipline: "Dual Moguls", gender: "Männer", category: "Freestyle" },
  { id: 99, date: "2026-02-22", time: "18:00", sport: "Freestyle", discipline: "Mixed Aerials", gender: "Mixed", category: "Freestyle" },

  // Snowboard
  { id: 100, date: "2026-02-08", time: "09:30", sport: "Snowboard", discipline: "Slopestyle", gender: "Frauen", category: "Snowboard" },
  { id: 101, date: "2026-02-09", time: "09:30", sport: "Snowboard", discipline: "Slopestyle", gender: "Männer", category: "Snowboard" },
  { id: 102, date: "2026-02-11", time: "10:00", sport: "Snowboard", discipline: "Parallel Riesenslalom", gender: "Frauen", category: "Snowboard" },
  { id: 103, date: "2026-02-12", time: "10:00", sport: "Snowboard", discipline: "Parallel Riesenslalom", gender: "Männer", category: "Snowboard" },
  { id: 104, date: "2026-02-14", time: "09:30", sport: "Snowboard", discipline: "Halfpipe", gender: "Frauen", category: "Snowboard" },
  { id: 105, date: "2026-02-15", time: "09:30", sport: "Snowboard", discipline: "Halfpipe", gender: "Männer", category: "Snowboard" },
  { id: 106, date: "2026-02-17", time: "13:00", sport: "Snowboard", discipline: "Snowboard Cross", gender: "Frauen", category: "Snowboard" },
  { id: 107, date: "2026-02-18", time: "13:00", sport: "Snowboard", discipline: "Snowboard Cross", gender: "Männer", category: "Snowboard" },
  { id: 108, date: "2026-02-19", time: "13:00", sport: "Snowboard", discipline: "Mixed Snowboard Cross", gender: "Mixed", category: "Snowboard" },
  { id: 109, date: "2026-02-20", time: "09:30", sport: "Snowboard", discipline: "Big Air", gender: "Frauen", category: "Snowboard" },
  { id: 110, date: "2026-02-21", time: "09:30", sport: "Snowboard", discipline: "Big Air", gender: "Männer", category: "Snowboard" },

  // Ski Mountaineering (NEU!)
  { id: 111, date: "2026-02-19", time: "10:00", sport: "Ski Mountaineering", discipline: "Sprint", gender: "Frauen", category: "Ski Mountaineering" },
  { id: 112, date: "2026-02-20", time: "10:00", sport: "Ski Mountaineering", discipline: "Sprint", gender: "Männer", category: "Ski Mountaineering" },
  { id: 113, date: "2026-02-21", time: "10:00", sport: "Ski Mountaineering", discipline: "Mixed Staffel", gender: "Mixed", category: "Ski Mountaineering" },
];

export const countries: Country[] = [
  { id: 1, name: "Norwegen", code: "NOR" },
  { id: 2, name: "Deutschland", code: "GER" },
  { id: 3, name: "Frankreich", code: "FRA" },
  { id: 4, name: "USA", code: "USA" },
  { id: 5, name: "Österreich", code: "AUT" },
  { id: 6, name: "Niederlande", code: "NED" },
  { id: 7, name: "Schweiz", code: "SUI" },
  { id: 8, name: "Kanada", code: "CAN" },
  { id: 9, name: "Italien", code: "ITA" },
  { id: 10, name: "Schweden", code: "SWE" },
  { id: 11, name: "Finnland", code: "FIN" },
  { id: 12, name: "Tschechien", code: "CZE" },
  { id: 13, name: "Polen", code: "POL" },
  { id: 14, name: "Australien", code: "AUS" },
  { id: 15, name: "Belgien", code: "BEL" },
  { id: 16, name: "Bulgarien", code: "BUL" },
  { id: 17, name: "Dänemark", code: "DEN" },
  { id: 18, name: "Estland", code: "EST" },
  { id: 19, name: "Großbritannien", code: "GBR" },
  { id: 20, name: "Japan", code: "JPN" },
  { id: 21, name: "Kasachstan", code: "KAZ" },
  { id: 22, name: "Kroatien", code: "CRO" },
  { id: 23, name: "Lettland", code: "LAT" },
  { id: 24, name: "Liechtenstein", code: "LIE" },
  { id: 25, name: "Luxemburg", code: "LUX" },
  { id: 26, name: "Neuseeland", code: "NZL" },
  { id: 27, name: "Rumänien", code: "ROU" },
  { id: 28, name: "Slowakei", code: "SVK" },
  { id: 29, name: "Slowenien", code: "SLO" },
  { id: 30, name: "Spanien", code: "ESP" },
  { id: 31, name: "Südkorea", code: "KOR" },
  { id: 32, name: "Ukraine", code: "UKR" },
  { id: 33, name: "Ungarn", code: "HUN" },
  { id: 34, name: "China", code: "CHN" },
  { id: 35, name: "Russland (Neutral)", code: "AIN" },
];

export const users: User[] = [
  { id: 1, name: "Robert Bernau", pin: "1234" },
  { id: 2, name: "Marcus Genz", pin: "1234" },
  { id: 3, name: "Marcel Käding", pin: "1234" },
  { id: 4, name: "Marcus Benoit", pin: "1234" },
  { id: 5, name: "Sebastian Schilling", pin: "1234" },
];

export const sportCategories = [
  "Alle",
  "Biathlon",
  "Ski Alpin",
  "Skispringen",
  "Langlauf",
  "Nordische Kombination",
  "Bob",
  "Skeleton",
  "Rodeln",
  "Eiskunstlauf",
  "Eisschnelllauf",
  "Short Track",
  "Curling",
  "Eishockey",
  "Freestyle",
  "Snowboard",
  "Ski Mountaineering"
];

export const sportIcons: Record<string, string> = {
  "Biathlon": "🎿",
  "Ski Alpin": "⛷️",
  "Skispringen": "🦅",
  "Langlauf": "🎿",
  "Nordische Kombination": "🎿",
  "Bob": "🛷",
  "Skeleton": "🛷",
  "Rodeln": "🛷",
  "Eiskunstlauf": "⛸️",
  "Eisschnelllauf": "⛸️",
  "Short Track": "⛸️",
  "Curling": "🥌",
  "Eishockey": "🏒",
  "Freestyle": "🎿",
  "Snowboard": "🏂",
  "Ski Mountaineering": "🏔️"
};
