// Country code to flag emoji mapping
// Uses ISO 3166-1 alpha-2 codes for flag emoji conversion

const countryCodeToISO: Record<string, string> = {
  // Olympic codes to ISO alpha-2 - Milano Cortina 2026 participants
  "ALB": "AL",
  "AND": "AD",
  "ARG": "AR",
  "ARM": "AM",
  "AUS": "AU",
  "AUT": "AT",
  "AZE": "AZ",
  "BEL": "BE",
  "BEN": "BJ",
  "BIH": "BA",
  "BOL": "BO",
  "BRA": "BR",
  "BUL": "BG",
  "CAN": "CA",
  "CHI": "CL",
  "CHN": "CN",
  "COL": "CO",
  "CRO": "HR",
  "CYP": "CY",
  "CZE": "CZ",
  "DEN": "DK",
  "ECU": "EC",
  "ERI": "ER",
  "ESP": "ES",
  "EST": "EE",
  "FIN": "FI",
  "FRA": "FR",
  "GBR": "GB",
  "GBS": "GW",
  "GEO": "GE",
  "GER": "DE",
  "GRE": "GR",
  "HAI": "HT",
  "HKG": "HK",
  "HUN": "HU",
  "IND": "IN",
  "IRI": "IR",
  "IRL": "IE",
  "ISL": "IS",
  "ISR": "IL",
  "ITA": "IT",
  "JAM": "JM",
  "JPN": "JP",
  "KAZ": "KZ",
  "KEN": "KE",
  "KGZ": "KG",
  "KOR": "KR",
  "KOS": "XK",
  "KSA": "SA",
  "LAT": "LV",
  "LBN": "LB",
  "LIE": "LI",
  "LTU": "LT",
  "LUX": "LU",
  "MAR": "MA",
  "MAS": "MY",
  "MDA": "MD",
  "MEX": "MX",
  "MGL": "MN",
  "MKD": "MK",
  "MLT": "MT",
  "MNE": "ME",
  "MON": "MC",
  "NED": "NL",
  "NGR": "NG",
  "NOR": "NO",
  "NZL": "NZ",
  "PAK": "PK",
  "PHI": "PH",
  "POL": "PL",
  "POR": "PT",
  "ROU": "RO",
  "SGP": "SG",
  "SLO": "SI",
  "SMR": "SM",
  "SRB": "RS",
  "SUI": "CH",
  "SVK": "SK",
  "SWE": "SE",
  "THA": "TH",
  "TPE": "TW",
  "TTO": "TT",
  "TUR": "TR",
  "UAE": "AE",
  "UKR": "UA",
  "URU": "UY",
  "USA": "US",
  "UZB": "UZ",
  "VEN": "VE",
  "AIN": "XX", // Individual Neutral Athletes - no flag
};

// Country name (German) to Olympic code mapping
const countryNameToCode: Record<string, string> = {
  "Albanien": "ALB",
  "Andorra": "AND",
  "Argentinien": "ARG",
  "Armenien": "ARM",
  "Aserbaidschan": "AZE",
  "Australien": "AUS",
  "Belgien": "BEL",
  "Benin": "BEN",
  "Bolivien": "BOL",
  "Bosnien und Herzegowina": "BIH",
  "Brasilien": "BRA",
  "Bulgarien": "BUL",
  "Chile": "CHI",
  "China": "CHN",
  "Chinesisch Taipeh": "TPE",
  "Dänemark": "DEN",
  "Deutschland": "GER",
  "Ecuador": "ECU",
  "Eritrea": "ERI",
  "Estland": "EST",
  "Finnland": "FIN",
  "Frankreich": "FRA",
  "Georgien": "GEO",
  "Griechenland": "GRE",
  "Großbritannien": "GBR",
  "Guinea-Bissau": "GBS",
  "Haiti": "HAI",
  "Hongkong": "HKG",
  "Indien": "IND",
  "Iran": "IRI",
  "Irland": "IRL",
  "Island": "ISL",
  "Israel": "ISR",
  "Italien": "ITA",
  "Jamaika": "JAM",
  "Japan": "JPN",
  "Kanada": "CAN",
  "Kasachstan": "KAZ",
  "Kenia": "KEN",
  "Kirgisistan": "KGZ",
  "Kolumbien": "COL",
  "Kosovo": "KOS",
  "Kroatien": "CRO",
  "Lettland": "LAT",
  "Libanon": "LBN",
  "Liechtenstein": "LIE",
  "Litauen": "LTU",
  "Luxemburg": "LUX",
  "Malaysia": "MAS",
  "Malta": "MLT",
  "Marokko": "MAR",
  "Mexiko": "MEX",
  "Moldau": "MDA",
  "Monaco": "MON",
  "Mongolei": "MGL",
  "Montenegro": "MNE",
  "Neuseeland": "NZL",
  "Niederlande": "NED",
  "Nigeria": "NGR",
  "Nordmazedonien": "MKD",
  "Norwegen": "NOR",
  "Österreich": "AUT",
  "Pakistan": "PAK",
  "Philippinen": "PHI",
  "Polen": "POL",
  "Portugal": "POR",
  "Rumänien": "ROU",
  "San Marino": "SMR",
  "Saudi-Arabien": "KSA",
  "Schweden": "SWE",
  "Schweiz": "SUI",
  "Serbien": "SRB",
  "Singapur": "SGP",
  "Slowakei": "SVK",
  "Slowenien": "SLO",
  "Spanien": "ESP",
  "Südkorea": "KOR",
  "Thailand": "THA",
  "Trinidad und Tobago": "TTO",
  "Tschechien": "CZE",
  "Türkei": "TUR",
  "Ukraine": "UKR",
  "Ungarn": "HUN",
  "Uruguay": "URU",
  "USA": "USA",
  "Usbekistan": "UZB",
  "Venezuela": "VEN",
  "Vereinigte Arabische Emirate": "UAE",
  "Zypern": "CYP",
  "Individuelle Neutrale Athleten": "AIN",
};

/**
 * Convert ISO alpha-2 code to flag emoji
 */
function isoToFlag(isoCode: string): string {
  if (isoCode === "XX") return "🏳️"; // Neutral flag
  if (isoCode === "XK") return "🇽🇰"; // Kosovo (special case)
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
