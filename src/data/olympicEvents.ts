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
  flag?: string;
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

// Events werden später hinzugefügt
export const olympicEvents: OlympicEvent[] = [];

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
  { id: 6, name: "Aurore", pin: "1234" },
  { id: 7, name: "Andrew", pin: "1234" },
];

export const sportCategories = [
  "Alle",
  "Biathlon",
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
