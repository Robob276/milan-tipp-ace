// Country code to flag emoji mapping
// Uses ISO 3166-1 alpha-2 codes for flag emoji conversion

const countryCodeToISO: Record<string, string> = {
  // Olympic codes to ISO alpha-2
  "NOR": "NO",
  "GER": "DE", 
  "FRA": "FR",
  "USA": "US",
  "AUT": "AT",
  "NED": "NL",
  "SUI": "CH",
  "CAN": "CA",
  "ITA": "IT",
  "SWE": "SE",
  "FIN": "FI",
  "CZE": "CZ",
  "POL": "PL",
  "AUS": "AU",
  "BEL": "BE",
  "BUL": "BG",
  "DEN": "DK",
  "EST": "EE",
  "GBR": "GB",
  "JPN": "JP",
  "KAZ": "KZ",
  "CRO": "HR",
  "LAT": "LV",
  "LIE": "LI",
  "LUX": "LU",
  "NZL": "NZ",
  "ROU": "RO",
  "SVK": "SK",
  "SLO": "SI",
  "ESP": "ES",
  "KOR": "KR",
  "UKR": "UA",
  "HUN": "HU",
  "CHN": "CN",
  "AIN": "XX", // Neutral athletes - no flag
};

// Country name to Olympic code mapping
const countryNameToCode: Record<string, string> = {
  "Norwegen": "NOR",
  "Deutschland": "GER",
  "Frankreich": "FRA",
  "USA": "USA",
  "Österreich": "AUT",
  "Niederlande": "NED",
  "Schweiz": "SUI",
  "Kanada": "CAN",
  "Italien": "ITA",
  "Schweden": "SWE",
  "Finnland": "FIN",
  "Tschechien": "CZE",
  "Polen": "POL",
  "Australien": "AUS",
  "Belgien": "BEL",
  "Bulgarien": "BUL",
  "Dänemark": "DEN",
  "Estland": "EST",
  "Großbritannien": "GBR",
  "Japan": "JPN",
  "Kasachstan": "KAZ",
  "Kroatien": "CRO",
  "Lettland": "LAT",
  "Liechtenstein": "LIE",
  "Luxemburg": "LUX",
  "Neuseeland": "NZL",
  "Rumänien": "ROU",
  "Slowakei": "SVK",
  "Slowenien": "SLO",
  "Spanien": "ESP",
  "Südkorea": "KOR",
  "Ukraine": "UKR",
  "Ungarn": "HUN",
  "China": "CHN",
  "Russland (Neutral)": "AIN",
};

/**
 * Convert ISO alpha-2 code to flag emoji
 */
function isoToFlag(isoCode: string): string {
  if (isoCode === "XX") return "🏳️"; // Neutral flag
  const codePoints = isoCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Get flag emoji from country name
 */
export function getFlagFromName(countryName: string): string {
  const olympicCode = countryNameToCode[countryName];
  if (!olympicCode) return "";
  
  const isoCode = countryCodeToISO[olympicCode];
  if (!isoCode) return "";
  
  return isoToFlag(isoCode);
}

/**
 * Get flag emoji from Olympic country code
 */
export function getFlagFromCode(olympicCode: string): string {
  const isoCode = countryCodeToISO[olympicCode];
  if (!isoCode) return "";
  
  return isoToFlag(isoCode);
}
