import { supabase } from "@/integrations/supabase/client";

export interface Athlete {
  id: string;
  event_id: number;
  name: string;
  country: string;
  country_code: string | null;
  bib_number: string | null;
}

/**
 * Fetch all athletes for a specific event
 */
export async function getAthletesByEvent(eventId: number): Promise<Athlete[]> {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .eq('event_id', eventId)
    .order('bib_number', { ascending: true });

  if (error) {
    console.error('Error fetching athletes:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all athletes (for caching purposes)
 */
export async function getAllAthletes(): Promise<Athlete[]> {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching all athletes:', error);
    return [];
  }

  return data || [];
}

/**
 * Get athletes grouped by event ID
 */
export async function getAthletesGroupedByEvent(): Promise<Record<number, Athlete[]>> {
  const athletes = await getAllAthletes();
  
  return athletes.reduce((acc, athlete) => {
    if (!acc[athlete.event_id]) {
      acc[athlete.event_id] = [];
    }
    acc[athlete.event_id].push(athlete);
    return acc;
  }, {} as Record<number, Athlete[]>);
}

/**
 * Format athlete for display in dropdown
 */
export function formatAthleteOption(athlete: Athlete): { value: string; label: string } {
  const flag = getCountryFlag(athlete.country_code || athlete.country);
  return {
    value: athlete.name,
    label: `${athlete.name} ${flag}`,
  };
}

/**
 * Get country flag emoji from country code or name
 */
function getCountryFlag(countryOrCode: string): string {
  const codeMap: Record<string, string> = {
    'GER': '🇩🇪', 'Deutschland': '🇩🇪',
    'NOR': '🇳🇴', 'Norwegen': '🇳🇴',
    'FRA': '🇫🇷', 'Frankreich': '🇫🇷',
    'SWE': '🇸🇪', 'Schweden': '🇸🇪',
    'ITA': '🇮🇹', 'Italien': '🇮🇹',
    'SUI': '🇨🇭', 'Schweiz': '🇨🇭',
    'AUT': '🇦🇹', 'Österreich': '🇦🇹',
    'USA': '🇺🇸', 'Vereinigte Staaten': '🇺🇸',
    'CAN': '🇨🇦', 'Kanada': '🇨🇦',
    'JPN': '🇯🇵', 'Japan': '🇯🇵',
    'CHN': '🇨🇳', 'China': '🇨🇳',
    'KOR': '🇰🇷', 'Südkorea': '🇰🇷',
    'RUS': '🇷🇺', 'Russland': '🇷🇺',
    'FIN': '🇫🇮', 'Finnland': '🇫🇮',
    'NED': '🇳🇱', 'Niederlande': '🇳🇱',
    'POL': '🇵🇱', 'Polen': '🇵🇱',
    'CZE': '🇨🇿', 'Tschechien': '🇨🇿',
    'SLO': '🇸🇮', 'Slowenien': '🇸🇮',
    'GBR': '🇬🇧', 'Großbritannien': '🇬🇧',
  };
  return codeMap[countryOrCode] || '🏳️';
}
