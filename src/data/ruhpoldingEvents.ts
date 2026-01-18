export interface RuhpoldingEvent {
  id: number;
  date: string;
  time: string;
  sport: string;
  discipline: string;
  gender: string;
  category: string;
  predictionDeadline?: string; // Optional early deadline for predictions (ISO datetime format)
}

// Biathlon Weltcup Ruhpolding 2026 - 6 Wettbewerbe
export const ruhpoldingEvents: RuhpoldingEvent[] = [
  { id: 1001, date: "2026-01-14", time: "14:30", sport: "Biathlon", discipline: "Staffel", gender: "Frauen", category: "Biathlon" },
  { id: 1002, date: "2026-01-15", time: "14:30", sport: "Biathlon", discipline: "Staffel", gender: "Männer", category: "Biathlon" },
  { id: 1003, date: "2026-01-16", time: "14:30", sport: "Biathlon", discipline: "Sprint", gender: "Frauen", category: "Biathlon" },
  { id: 1004, date: "2026-01-17", time: "14:30", sport: "Biathlon", discipline: "Sprint", gender: "Männer", category: "Biathlon" },
  { id: 1005, date: "2026-01-18", time: "12:30", sport: "Biathlon", discipline: "Verfolgung", gender: "Frauen", category: "Biathlon" },
  { id: 1006, date: "2026-01-18", time: "15:00", sport: "Biathlon", discipline: "Verfolgung", gender: "Männer", category: "Biathlon" },
];
