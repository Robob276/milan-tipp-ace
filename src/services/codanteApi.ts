/**
 * Codante.io Olympics API Integration
 * 
 * Base URL: https://apis.codante.io/olympic-games
 * Rate Limit: 100 requests/minute
 * No authentication required
 * 
 * Note: Currently configured for Paris 2024. 
 * For Milano Cortina 2026, the base URL may change.
 */

const BASE_URL = "https://apis.codante.io/olympic-games";

// Types based on Codante.io API response structure
export interface CodanteCompetitor {
  country_id: string;
  country_flag_url: string;
  competitor_name: string;
  position: number;
  result_position: string;
  result_winnerLoserTie: string;
  result_mark: string;
}

export interface CodanteEvent {
  id: number;
  day: string;
  discipline_name: string;
  discipline_pictogram: string;
  name: string;
  venue_name: string;
  event_name: string;
  detailed_event_name: string;
  start_date: string;
  end_date: string;
  status: string;
  is_medal_event: number;
  is_live: number;
  gender_code: string;
  competitors: CodanteCompetitor[];
}

export interface CodanteCountry {
  id: string;
  name: string;
  continent: string;
  flag_url: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
  rank: number;
  rank_total_medals: number;
}

export interface CodanteDiscipline {
  id: string;
  name: string;
  pictogram_url: string;
}

export interface CodantePaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Fetch all events (paginated)
 */
export async function fetchEvents(
  page: number = 1,
  country?: string,
  discipline?: string
): Promise<CodantePaginatedResponse<CodanteEvent>> {
  const params = new URLSearchParams({ page: page.toString() });
  if (country) params.append("country", country);
  if (discipline) params.append("discipline", discipline);

  const response = await fetch(`${BASE_URL}/events?${params}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch a single event by ID
 */
export async function fetchEventById(eventId: number): Promise<{ data: CodanteEvent }> {
  const response = await fetch(`${BASE_URL}/events/${eventId}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch all countries with medal counts
 */
export async function fetchCountries(): Promise<CodantePaginatedResponse<CodanteCountry>> {
  const response = await fetch(`${BASE_URL}/countries`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch all disciplines/sports
 */
export async function fetchDisciplines(): Promise<CodantePaginatedResponse<CodanteDiscipline>> {
  const response = await fetch(`${BASE_URL}/disciplines`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch all events across all pages
 */
export async function fetchAllEvents(): Promise<CodanteEvent[]> {
  const allEvents: CodanteEvent[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchEvents(page);
    allEvents.push(...response.data);
    hasMore = response.meta.current_page < response.meta.last_page;
    page++;
    
    // Respect rate limiting
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return allEvents;
}

/**
 * Check if the API is available and responding
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/disciplines`);
    return response.ok;
  } catch {
    return false;
  }
}
