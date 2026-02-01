// Country code to flag emoji mapping
// Uses ISO 3166-1 alpha-2 codes for flag emoji conversion

const countryCodeToISO: Record<string, string> = {
  // Olympic codes to ISO alpha-2 - Milano Cortina 2026 participants (All 92 nations)
  "ALB": "AL", // Albanien
  "AND": "AD", // Andorra
  "ARG": "AR", // Argentinien
  "ARM": "AM", // Armenien
  "AUS": "AU", // Australien
  "AUT": "AT", // Österreich
  "AZE": "AZ", // Aserbaidschan
  "BEL": "BE", // Belgien
  "BEN": "BJ", // Benin
  "BIH": "BA", // Bosnien und Herzegowina
  "BOL": "BO", // Bolivien
  "BRA": "BR", // Brasilien
  "BUL": "BG", // Bulgarien
  "CAN": "CA", // Kanada
  "CHI": "CL", // Chile
  "CHN": "CN", // China
  "COL": "CO", // Kolumbien
  "CRO": "HR", // Kroatien
  "CYP": "CY", // Zypern
  "CZE": "CZ", // Tschechien
  "DEN": "DK", // Dänemark
  "ECU": "EC", // Ecuador
  "ERI": "ER", // Eritrea
  "ESP": "ES", // Spanien
  "EST": "EE", // Estland
  "FIN": "FI", // Finnland
  "FRA": "FR", // Frankreich
  "GBR": "GB", // Großbritannien
  "GBS": "GW", // Guinea-Bissau
  "GEO": "GE", // Georgien
  "GER": "DE", // Deutschland
  "GRE": "GR", // Griechenland
  "HAI": "HT", // Haiti
  "HKG": "HK", // Hongkong
  "HUN": "HU", // Ungarn
  "IND": "IN", // Indien
  "IRI": "IR", // Iran
  "IRL": "IE", // Irland
  "ISL": "IS", // Island
  "ISR": "IL", // Israel
  "ITA": "IT", // Italien
  "JAM": "JM", // Jamaika
  "JPN": "JP", // Japan
  "KAZ": "KZ", // Kasachstan
  "KEN": "KE", // Kenia
  "KGZ": "KG", // Kirgisistan
  "KOR": "KR", // Südkorea
  "KOS": "XK", // Kosovo
  "KSA": "SA", // Saudi-Arabien
  "LAT": "LV", // Lettland
  "LBN": "LB", // Libanon
  "LIE": "LI", // Liechtenstein
  "LTU": "LT", // Litauen
  "LUX": "LU", // Luxemburg
  "MAR": "MA", // Marokko
  "MAS": "MY", // Malaysia
  "MDA": "MD", // Moldau
  "MEX": "MX", // Mexiko
  "MGL": "MN", // Mongolei
  "MKD": "MK", // Nordmazedonien
  "MLT": "MT", // Malta
  "MNE": "ME", // Montenegro
  "MON": "MC", // Monaco
  "NED": "NL", // Niederlande
  "NGR": "NG", // Nigeria
  "NOR": "NO", // Norwegen
  "NZL": "NZ", // Neuseeland
  "PAK": "PK", // Pakistan
  "PHI": "PH", // Philippinen
  "POL": "PL", // Polen
  "POR": "PT", // Portugal
  "ROU": "RO", // Rumänien
  "RUS": "RU", // Russland (für historische Daten)
  "SGP": "SG", // Singapur
  "SLO": "SI", // Slowenien
  "SMR": "SM", // San Marino
  "SRB": "RS", // Serbien
  "SUI": "CH", // Schweiz
  "SVK": "SK", // Slowakei
  "SWE": "SE", // Schweden
  "THA": "TH", // Thailand
  "TPE": "TW", // Chinesisch Taipeh
  "TTO": "TT", // Trinidad und Tobago
  "TUR": "TR", // Türkei
  "UAE": "AE", // Vereinigte Arabische Emirate
  "UKR": "UA", // Ukraine
  "URU": "UY", // Uruguay
  "USA": "US", // USA
  "UZB": "UZ", // Usbekistan
  "VEN": "VE", // Venezuela
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
