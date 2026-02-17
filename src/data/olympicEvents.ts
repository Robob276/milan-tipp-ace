export interface OlympicEvent {
  id: number;
  date: string;
  time: string;
  sport: string;
  discipline: string;
  gender: string;
  category: string;
  predictionDeadline?: string; // Optional early deadline for predictions (ISO datetime format)
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

// Milano Cortina 2026 - Alle 116 Medaillenentscheidungen
export const olympicEvents: OlympicEvent[] = [
  // Samstag, 7. Februar (5 Entscheidungen)
  { id: 1, date: "2026-02-07", time: "11:30", sport: "Ski Alpin", discipline: "Abfahrt", gender: "Männer", category: "Ski Alpin" },
  { id: 2, date: "2026-02-07", time: "13:00", sport: "Skilanglauf", discipline: "Skiathlon 20 km", gender: "Frauen", category: "Langlauf" },
  { id: 3, date: "2026-02-07", time: "16:00", sport: "Eisschnelllauf", discipline: "3000 m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 4, date: "2026-02-07", time: "18:45", sport: "Skispringen", discipline: "Normalschanze Einzel", gender: "Frauen", category: "Skispringen" },
  { id: 5, date: "2026-02-07", time: "19:30", sport: "Snowboard", discipline: "Big Air", gender: "Männer", category: "Snowboard" },
  
  // Sonntag, 8. Februar (8 Entscheidungen)
  { id: 6, date: "2026-02-08", time: "11:30", sport: "Ski Alpin", discipline: "Abfahrt", gender: "Frauen", category: "Ski Alpin" },
  { id: 7, date: "2026-02-08", time: "12:30", sport: "Skilanglauf", discipline: "Skiathlon 20 km", gender: "Männer", category: "Langlauf" },
  { id: 8, date: "2026-02-08", time: "13:00", sport: "Snowboard", discipline: "Parallel-Riesenslalom", gender: "Frauen", category: "Snowboard" },
  { id: 9, date: "2026-02-08", time: "13:30", sport: "Snowboard", discipline: "Parallel-Riesenslalom", gender: "Männer", category: "Snowboard" },
  { id: 10, date: "2026-02-08", time: "14:00", sport: "Biathlon", discipline: "Mixed-Staffel", gender: "Mixed", category: "Biathlon" },
  { id: 11, date: "2026-02-08", time: "16:00", sport: "Eisschnelllauf", discipline: "5000 m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 12, date: "2026-02-08", time: "17:00", sport: "Rodeln", discipline: "Einsitzer", gender: "Männer", category: "Rodeln" },
  { id: 13, date: "2026-02-08", time: "19:30", sport: "Eiskunstlauf", discipline: "Team-Event", gender: "Mixed", category: "Eiskunstlauf" },
  
  // Montag, 9. Februar (5 Entscheidungen)
  { id: 14, date: "2026-02-09", time: "10:30", sport: "Ski Alpin", discipline: "Team-Kombination", gender: "Männer", category: "Ski Alpin" },
  { id: 15, date: "2026-02-09", time: "12:30", sport: "Freestyle", discipline: "Slopestyle", gender: "Frauen", category: "Freestyle" },
  { id: 16, date: "2026-02-09", time: "17:30", sport: "Eisschnelllauf", discipline: "1000 m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 17, date: "2026-02-09", time: "19:00", sport: "Skispringen", discipline: "Normalschanze Einzel", gender: "Männer", category: "Skispringen" },
  { id: 18, date: "2026-02-09", time: "19:30", sport: "Snowboard", discipline: "Big Air", gender: "Frauen", category: "Snowboard" },
  
  // Dienstag, 10. Februar (9 Entscheidungen)
  { id: 19, date: "2026-02-10", time: "10:30", sport: "Ski Alpin", discipline: "Team-Kombination", gender: "Frauen", category: "Ski Alpin" },
  { id: 20, date: "2026-02-10", time: "10:30", sport: "Short Track", discipline: "Mixed-Staffel", gender: "Mixed", category: "Short Track" },
  { id: 21, date: "2026-02-10", time: "11:45", sport: "Skilanglauf", discipline: "Sprint Klassisch", gender: "Frauen", category: "Langlauf" },
  { id: 22, date: "2026-02-10", time: "12:15", sport: "Skilanglauf", discipline: "Sprint Klassisch", gender: "Männer", category: "Langlauf" },
  { id: 23, date: "2026-02-10", time: "12:30", sport: "Freestyle", discipline: "Slopestyle", gender: "Männer", category: "Freestyle" },
  { id: 24, date: "2026-02-10", time: "13:30", sport: "Biathlon", discipline: "Einzel 20 km", gender: "Männer", category: "Biathlon" },
  { id: 25, date: "2026-02-10", time: "17:00", sport: "Rodeln", discipline: "Einsitzer", gender: "Frauen", category: "Rodeln" },
  { id: 26, date: "2026-02-10", time: "18:00", sport: "Curling", discipline: "Mixed Doubles", gender: "Mixed", category: "Curling", predictionDeadline: "2026-02-04T19:00:00" },
  { id: 27, date: "2026-02-10", time: "18:45", sport: "Skispringen", discipline: "Mixed-Team", gender: "Mixed", category: "Skispringen" },
  
  // Mittwoch, 11. Februar (8 Entscheidungen)
  { id: 28, date: "2026-02-11", time: "10:00", sport: "Nordische Kombination", discipline: "Einzel Normalschanze/10 km", gender: "Männer", category: "Nordische Kombination" },
  { id: 29, date: "2026-02-11", time: "11:30", sport: "Ski Alpin", discipline: "Super-G", gender: "Männer", category: "Ski Alpin" },
  { id: 30, date: "2026-02-11", time: "14:15", sport: "Biathlon", discipline: "Einzel 15 km", gender: "Frauen", category: "Biathlon" },
  { id: 31, date: "2026-02-11", time: "14:15", sport: "Freestyle", discipline: "Buckelpiste", gender: "Frauen", category: "Freestyle" },
  { id: 32, date: "2026-02-11", time: "17:00", sport: "Rodeln", discipline: "Doppelsitzer", gender: "Männer", category: "Rodeln" },
  { id: 33, date: "2026-02-11", time: "17:00", sport: "Rodeln", discipline: "Doppelsitzer", gender: "Frauen", category: "Rodeln", predictionDeadline: "2026-02-11T17:00:00" },
  { id: 34, date: "2026-02-11", time: "18:30", sport: "Eisschnelllauf", discipline: "1000 m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 35, date: "2026-02-11", time: "19:30", sport: "Eiskunstlauf", discipline: "Eistanz Kür", gender: "Mixed", category: "Eiskunstlauf" },
  
  // Donnerstag, 12. Februar (9 Entscheidungen)
  { id: 36, date: "2026-02-12", time: "11:30", sport: "Ski Alpin", discipline: "Super-G", gender: "Frauen", category: "Ski Alpin" },
  { id: 37, date: "2026-02-12", time: "12:15", sport: "Freestyle", discipline: "Buckelpiste", gender: "Männer", category: "Freestyle" },
  { id: 38, date: "2026-02-12", time: "13:00", sport: "Skilanglauf", discipline: "10 km Klassisch", gender: "Frauen", category: "Langlauf" },
  { id: 39, date: "2026-02-12", time: "13:45", sport: "Snowboard", discipline: "Snowboardcross", gender: "Männer", category: "Snowboard" },
  { id: 40, date: "2026-02-12", time: "16:30", sport: "Eisschnelllauf", discipline: "5000 m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 41, date: "2026-02-12", time: "18:30", sport: "Rodeln", discipline: "Team-Staffel", gender: "Mixed", category: "Rodeln" },
  { id: 42, date: "2026-02-12", time: "19:30", sport: "Snowboard", discipline: "Halfpipe", gender: "Frauen", category: "Snowboard" },
  { id: 43, date: "2026-02-12", time: "20:00", sport: "Short Track", discipline: "500 m", gender: "Frauen", category: "Short Track" },
  { id: 44, date: "2026-02-12", time: "20:30", sport: "Short Track", discipline: "1000 m", gender: "Männer", category: "Short Track" },
  
  // Freitag, 13. Februar (7 Entscheidungen)
  { id: 45, date: "2026-02-13", time: "11:45", sport: "Skilanglauf", discipline: "10 km Klassisch", gender: "Männer", category: "Langlauf" },
  { id: 46, date: "2026-02-13", time: "13:30", sport: "Snowboard", discipline: "Snowboardcross", gender: "Frauen", category: "Snowboard" },
  { id: 47, date: "2026-02-13", time: "14:00", sport: "Biathlon", discipline: "Sprint 10 km", gender: "Männer", category: "Biathlon" },
  { id: 48, date: "2026-02-13", time: "16:00", sport: "Eisschnelllauf", discipline: "10000 m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 49, date: "2026-02-13", time: "19:00", sport: "Eiskunstlauf", discipline: "Kür", gender: "Männer", category: "Eiskunstlauf" },
  { id: 50, date: "2026-02-13", time: "19:30", sport: "Skeleton", discipline: "Einzel", gender: "Männer", category: "Skeleton" },
  { id: 51, date: "2026-02-13", time: "19:30", sport: "Snowboard", discipline: "Halfpipe", gender: "Männer", category: "Snowboard" },
  
  // Samstag, 14. Februar (8 Entscheidungen)
  { id: 52, date: "2026-02-14", time: "10:00", sport: "Ski Alpin", discipline: "Riesenslalom", gender: "Männer", category: "Ski Alpin" },
  { id: 53, date: "2026-02-14", time: "10:30", sport: "Freestyle", discipline: "Dual Moguls", gender: "Frauen", category: "Freestyle" },
  { id: 54, date: "2026-02-14", time: "12:00", sport: "Skilanglauf", discipline: "Staffel 4x5 km", gender: "Frauen", category: "Langlauf" },
  { id: 55, date: "2026-02-14", time: "14:00", sport: "Biathlon", discipline: "Sprint 7,5 km", gender: "Frauen", category: "Biathlon" },
  { id: 56, date: "2026-02-14", time: "16:00", sport: "Eisschnelllauf", discipline: "500 m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 57, date: "2026-02-14", time: "18:00", sport: "Skeleton", discipline: "Einzel", gender: "Frauen", category: "Skeleton" },
  { id: 58, date: "2026-02-14", time: "18:45", sport: "Skispringen", discipline: "Großschanze Einzel", gender: "Männer", category: "Skispringen" },
  { id: 59, date: "2026-02-14", time: "20:15", sport: "Short Track", discipline: "1500 m", gender: "Männer", category: "Short Track" },
  
  // Sonntag, 15. Februar (9 Entscheidungen)
  { id: 60, date: "2026-02-15", time: "10:00", sport: "Ski Alpin", discipline: "Riesenslalom", gender: "Frauen", category: "Ski Alpin" },
  { id: 61, date: "2026-02-15", time: "10:30", sport: "Freestyle", discipline: "Dual Moguls", gender: "Männer", category: "Freestyle" },
  { id: 62, date: "2026-02-15", time: "11:15", sport: "Biathlon", discipline: "Verfolgung 12,5 km", gender: "Männer", category: "Biathlon" },
  { id: 63, date: "2026-02-15", time: "12:00", sport: "Skilanglauf", discipline: "Staffel 4x10 km", gender: "Männer", category: "Langlauf" },
  { id: 64, date: "2026-02-15", time: "13:45", sport: "Snowboard", discipline: "Snowboardcross Mixed-Team", gender: "Mixed", category: "Snowboard" },
  { id: 65, date: "2026-02-15", time: "14:30", sport: "Biathlon", discipline: "Verfolgung 10 km", gender: "Frauen", category: "Biathlon" },
  { id: 66, date: "2026-02-15", time: "16:00", sport: "Eisschnelllauf", discipline: "500 m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 67, date: "2026-02-15", time: "18:00", sport: "Skeleton", discipline: "Mixed-Team", gender: "Mixed", category: "Skeleton" },
  { id: 68, date: "2026-02-15", time: "18:45", sport: "Skispringen", discipline: "Großschanze Einzel", gender: "Frauen", category: "Skispringen" },
  
  // Montag, 16. Februar (6 Entscheidungen)
  { id: 69, date: "2026-02-16", time: "10:00", sport: "Ski Alpin", discipline: "Slalom", gender: "Männer", category: "Ski Alpin" },
  { id: 70, date: "2026-02-16", time: "11:00", sport: "Short Track", discipline: "1000 m", gender: "Frauen", category: "Short Track" },
  { id: 71, date: "2026-02-16", time: "19:00", sport: "Bob", discipline: "Monobob", gender: "Frauen", category: "Bob" },
  { id: 72, date: "2026-02-16", time: "19:00", sport: "Skispringen", discipline: "Super-Team", gender: "Männer", category: "Skispringen" },
  { id: 73, date: "2026-02-16", time: "19:30", sport: "Freestyle", discipline: "Big Air", gender: "Frauen", category: "Freestyle" },
  { id: 74, date: "2026-02-16", time: "20:00", sport: "Eiskunstlauf", discipline: "Kür Paare", gender: "Mixed", category: "Eiskunstlauf" },
  
  // Dienstag, 17. Februar (7 Entscheidungen)
  { id: 75, date: "2026-02-17", time: "10:00", sport: "Nordische Kombination", discipline: "Einzel Großschanze/10 km", gender: "Männer", category: "Nordische Kombination" },
  { id: 76, date: "2026-02-18", time: "14:30", sport: "Snowboard", discipline: "Slopestyle", gender: "Frauen", category: "Snowboard" },
  { id: 77, date: "2026-02-17", time: "14:30", sport: "Biathlon", discipline: "Staffel 4x7,5 km", gender: "Männer", category: "Biathlon" },
  { id: 78, date: "2026-02-17", time: "14:30", sport: "Eisschnelllauf", discipline: "Teamverfolgung", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 79, date: "2026-02-17", time: "15:30", sport: "Eisschnelllauf", discipline: "Teamverfolgung", gender: "Männer", category: "Eisschnelllauf" },
  { id: 80, date: "2026-02-17", time: "19:00", sport: "Bob", discipline: "Zweier", gender: "Männer", category: "Bob" },
  { id: 81, date: "2026-02-17", time: "19:30", sport: "Freestyle", discipline: "Big Air", gender: "Männer", category: "Freestyle" },
  
  // Mittwoch, 18. Februar (8 Entscheidungen)
  { id: 82, date: "2026-02-18", time: "10:00", sport: "Ski Alpin", discipline: "Slalom", gender: "Frauen", category: "Ski Alpin" },
  { id: 83, date: "2026-02-18", time: "11:30", sport: "Freestyle", discipline: "Aerials", gender: "Frauen", category: "Freestyle" },
  { id: 84, date: "2026-02-18", time: "11:45", sport: "Skilanglauf", discipline: "Teamsprint Freistil", gender: "Frauen", category: "Langlauf" },
  { id: 85, date: "2026-02-18", time: "12:30", sport: "Snowboard", discipline: "Slopestyle", gender: "Männer", category: "Snowboard" },
  { id: 86, date: "2026-02-18", time: "13:15", sport: "Skilanglauf", discipline: "Teamsprint Freistil", gender: "Männer", category: "Langlauf" },
  { id: 87, date: "2026-02-18", time: "14:45", sport: "Biathlon", discipline: "Staffel 4x6 km", gender: "Frauen", category: "Biathlon" },
  { id: 88, date: "2026-02-18", time: "20:00", sport: "Short Track", discipline: "Staffel 3000 m", gender: "Frauen", category: "Short Track" },
  { id: 89, date: "2026-02-18", time: "20:30", sport: "Short Track", discipline: "500 m", gender: "Männer", category: "Short Track" },
  
  // Donnerstag, 19. Februar (7 Entscheidungen)
  { id: 90, date: "2026-02-19", time: "10:00", sport: "Nordische Kombination", discipline: "Teamsprint Großschanze/2x7,5 km", gender: "Männer", category: "Nordische Kombination" },
  { id: 91, date: "2026-02-19", time: "11:30", sport: "Freestyle", discipline: "Aerials", gender: "Männer", category: "Freestyle" },
  { id: 92, date: "2026-02-19", time: "12:55", sport: "Skibergsteigen", discipline: "Sprint", gender: "Frauen", category: "Ski Mountaineering" },
  { id: 93, date: "2026-02-19", time: "13:30", sport: "Skibergsteigen", discipline: "Sprint", gender: "Männer", category: "Ski Mountaineering" },
  { id: 94, date: "2026-02-19", time: "16:30", sport: "Eisschnelllauf", discipline: "1500 m", gender: "Männer", category: "Eisschnelllauf" },
  { id: 95, date: "2026-02-19", time: "19:00", sport: "Eiskunstlauf", discipline: "Kür", gender: "Frauen", category: "Eiskunstlauf" },
  { id: 96, date: "2026-02-19", time: "19:10", sport: "Eishockey", discipline: "Finale", gender: "Frauen", category: "Eishockey", predictionDeadline: "2026-02-04T19:00:00" },
  
  // Freitag, 20. Februar (6 Entscheidungen)
  { id: 97, date: "2026-02-20", time: "12:00", sport: "Freestyle", discipline: "Skicross", gender: "Frauen", category: "Freestyle" },
  { id: 98, date: "2026-02-20", time: "14:15", sport: "Biathlon", discipline: "Massenstart 15 km", gender: "Männer", category: "Biathlon" },
  { id: 99, date: "2026-02-20", time: "16:30", sport: "Eisschnelllauf", discipline: "1500 m", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 100, date: "2026-02-20", time: "19:30", sport: "Freestyle", discipline: "Halfpipe", gender: "Männer", category: "Freestyle" },
  { id: 101, date: "2026-02-20", time: "20:00", sport: "Short Track", discipline: "1500 m", gender: "Frauen", category: "Short Track" },
  { id: 102, date: "2026-02-20", time: "20:30", sport: "Short Track", discipline: "Staffel 5000 m", gender: "Männer", category: "Short Track" },
  { id: 103, date: "2026-02-20", time: "21:00", sport: "Curling", discipline: "Finale", gender: "Männer", category: "Curling", predictionDeadline: "2026-02-04T19:00:00" },
  
  // Samstag, 21. Februar (9 Entscheidungen)
  { id: 104, date: "2026-02-21", time: "10:00", sport: "Skilanglauf", discipline: "50 km Massenstart Freistil", gender: "Männer", category: "Langlauf" },
  { id: 105, date: "2026-02-21", time: "10:45", sport: "Freestyle", discipline: "Mixed-Team Aerials", gender: "Mixed", category: "Freestyle" },
  { id: 106, date: "2026-02-21", time: "12:00", sport: "Freestyle", discipline: "Skicross", gender: "Männer", category: "Freestyle" },
  { id: 107, date: "2026-02-21", time: "13:30", sport: "Skibergsteigen", discipline: "Mixed-Staffel", gender: "Mixed", category: "Ski Mountaineering" },
  { id: 108, date: "2026-02-21", time: "14:15", sport: "Biathlon", discipline: "Massenstart 12,5 km", gender: "Frauen", category: "Biathlon" },
  { id: 109, date: "2026-02-21", time: "15:00", sport: "Eisschnelllauf", discipline: "Massenstart", gender: "Frauen", category: "Eisschnelllauf" },
  { id: 110, date: "2026-02-21", time: "16:00", sport: "Eisschnelllauf", discipline: "Massenstart", gender: "Männer", category: "Eisschnelllauf" },
  { id: 111, date: "2026-02-21", time: "19:00", sport: "Bob", discipline: "Zweier", gender: "Frauen", category: "Bob" },
  { id: 112, date: "2026-02-21", time: "19:30", sport: "Freestyle", discipline: "Halfpipe", gender: "Frauen", category: "Freestyle" },
  
  // Sonntag, 22. Februar (4 Entscheidungen)
  { id: 113, date: "2026-02-22", time: "10:00", sport: "Skilanglauf", discipline: "50 km Massenstart Freistil", gender: "Frauen", category: "Langlauf" },
  { id: 114, date: "2026-02-22", time: "11:00", sport: "Curling", discipline: "Finale", gender: "Frauen", category: "Curling", predictionDeadline: "2026-02-04T19:00:00" },
  { id: 115, date: "2026-02-22", time: "14:10", sport: "Eishockey", discipline: "Finale", gender: "Männer", category: "Eishockey", predictionDeadline: "2026-02-04T19:00:00" },
  { id: 116, date: "2026-02-22", time: "19:00", sport: "Bob", discipline: "Vierer", gender: "Männer", category: "Bob" },
];

// Olympische Winterspiele 2026 Milano-Cortina - Alle 92 teilnehmenden Nationen (alphabetisch nach deutschem Namen)
export const countries: Country[] = [
  { id: 1, name: "Albanien", code: "ALB" },
  { id: 2, name: "Andorra", code: "AND" },
  { id: 3, name: "Argentinien", code: "ARG" },
  { id: 4, name: "Armenien", code: "ARM" },
  { id: 5, name: "Aserbaidschan", code: "AZE" },
  { id: 6, name: "Australien", code: "AUS" },
  { id: 7, name: "Belgien", code: "BEL" },
  { id: 8, name: "Benin", code: "BEN" },
  { id: 9, name: "Bolivien", code: "BOL" },
  { id: 10, name: "Bosnien und Herzegowina", code: "BIH" },
  { id: 11, name: "Brasilien", code: "BRA" },
  { id: 12, name: "Bulgarien", code: "BUL" },
  { id: 13, name: "Chile", code: "CHI" },
  { id: 14, name: "China", code: "CHN" },
  { id: 15, name: "Chinesisch Taipeh", code: "TPE" },
  { id: 16, name: "Dänemark", code: "DEN" },
  { id: 17, name: "Deutschland", code: "GER" },
  { id: 18, name: "Ecuador", code: "ECU" },
  { id: 19, name: "Eritrea", code: "ERI" },
  { id: 20, name: "Estland", code: "EST" },
  { id: 21, name: "Finnland", code: "FIN" },
  { id: 22, name: "Frankreich", code: "FRA" },
  { id: 23, name: "Georgien", code: "GEO" },
  { id: 24, name: "Griechenland", code: "GRE" },
  { id: 25, name: "Großbritannien", code: "GBR" },
  { id: 26, name: "Guinea-Bissau", code: "GBS" },
  { id: 27, name: "Haiti", code: "HAI" },
  { id: 28, name: "Hongkong", code: "HKG" },
  { id: 29, name: "Indien", code: "IND" },
  { id: 30, name: "Iran", code: "IRI" },
  { id: 31, name: "Irland", code: "IRL" },
  { id: 32, name: "Island", code: "ISL" },
  { id: 33, name: "Israel", code: "ISR" },
  { id: 34, name: "Italien", code: "ITA" },
  { id: 35, name: "Jamaika", code: "JAM" },
  { id: 36, name: "Japan", code: "JPN" },
  { id: 37, name: "Kanada", code: "CAN" },
  { id: 38, name: "Kasachstan", code: "KAZ" },
  { id: 39, name: "Kenia", code: "KEN" },
  { id: 40, name: "Kirgisistan", code: "KGZ" },
  { id: 41, name: "Kolumbien", code: "COL" },
  { id: 42, name: "Kosovo", code: "KOS" },
  { id: 43, name: "Kroatien", code: "CRO" },
  { id: 44, name: "Lettland", code: "LAT" },
  { id: 45, name: "Libanon", code: "LBN" },
  { id: 46, name: "Liechtenstein", code: "LIE" },
  { id: 47, name: "Litauen", code: "LTU" },
  { id: 48, name: "Luxemburg", code: "LUX" },
  { id: 49, name: "Malaysia", code: "MAS" },
  { id: 50, name: "Malta", code: "MLT" },
  { id: 51, name: "Marokko", code: "MAR" },
  { id: 52, name: "Mexiko", code: "MEX" },
  { id: 53, name: "Moldau", code: "MDA" },
  { id: 54, name: "Monaco", code: "MON" },
  { id: 55, name: "Mongolei", code: "MGL" },
  { id: 56, name: "Montenegro", code: "MNE" },
  { id: 57, name: "Neuseeland", code: "NZL" },
  { id: 58, name: "Niederlande", code: "NED" },
  { id: 59, name: "Nigeria", code: "NGR" },
  { id: 60, name: "Nordmazedonien", code: "MKD" },
  { id: 61, name: "Norwegen", code: "NOR" },
  { id: 62, name: "Österreich", code: "AUT" },
  { id: 63, name: "Pakistan", code: "PAK" },
  { id: 64, name: "Philippinen", code: "PHI" },
  { id: 65, name: "Polen", code: "POL" },
  { id: 66, name: "Portugal", code: "POR" },
  { id: 67, name: "Rumänien", code: "ROU" },
  { id: 68, name: "San Marino", code: "SMR" },
  { id: 69, name: "Saudi-Arabien", code: "KSA" },
  { id: 70, name: "Schweden", code: "SWE" },
  { id: 71, name: "Schweiz", code: "SUI" },
  { id: 72, name: "Serbien", code: "SRB" },
  { id: 73, name: "Singapur", code: "SGP" },
  { id: 74, name: "Slowakei", code: "SVK" },
  { id: 75, name: "Slowenien", code: "SLO" },
  { id: 76, name: "Spanien", code: "ESP" },
  { id: 77, name: "Südkorea", code: "KOR" },
  { id: 78, name: "Thailand", code: "THA" },
  { id: 79, name: "Trinidad und Tobago", code: "TTO" },
  { id: 80, name: "Tschechien", code: "CZE" },
  { id: 81, name: "Türkei", code: "TUR" },
  { id: 82, name: "Ukraine", code: "UKR" },
  { id: 83, name: "Ungarn", code: "HUN" },
  { id: 84, name: "Uruguay", code: "URU" },
  { id: 85, name: "USA", code: "USA" },
  { id: 86, name: "Usbekistan", code: "UZB" },
  { id: 87, name: "Venezuela", code: "VEN" },
  { id: 88, name: "Vereinigte Arabische Emirate", code: "UAE" },
  { id: 89, name: "Zypern", code: "CYP" },
  { id: 90, name: "Individuelle Neutrale Athleten", code: "AIN" },
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
  "Bob",
  "Curling",
  "Eishockey",
  "Eiskunstlauf",
  "Eisschnelllauf",
  "Freestyle",
  "Langlauf",
  "Nordische Kombination",
  "Rodeln",
  "Short Track",
  "Skeleton",
  "Ski Alpin",
  "Ski Mountaineering",
  "Skispringen",
  "Snowboard",
];

export const sportIcons: Record<string, string> = {
  "Biathlon": "🎿",
  "Ski Alpin": "⛷️",
  "Skispringen": "🦅",
  "Skilanglauf": "🎿",
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
  "Ski Mountaineering": "🏔️",
  "Skibergsteigen": "🏔️"
};
