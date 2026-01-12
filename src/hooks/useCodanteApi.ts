import { useQuery } from "@tanstack/react-query";
import {
  fetchEvents,
  fetchEventById,
  fetchCountries,
  fetchDisciplines,
  fetchAllEvents,
  checkApiHealth,
  CodanteEvent,
} from "@/services/codanteApi";

/**
 * Hook to check if Codante.io API is available
 */
export function useApiHealth() {
  return useQuery({
    queryKey: ["codante", "health"],
    queryFn: checkApiHealth,
    staleTime: 5 * 60 * 1000, // Check every 5 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch paginated events
 */
export function useEvents(page: number = 1, country?: string, discipline?: string) {
  return useQuery({
    queryKey: ["codante", "events", page, country, discipline],
    queryFn: () => fetchEvents(page, country, discipline),
    staleTime: 60 * 1000, // 1 minute cache
  });
}

/**
 * Hook to fetch a single event
 */
export function useEvent(eventId: number | null) {
  return useQuery({
    queryKey: ["codante", "event", eventId],
    queryFn: () => (eventId ? fetchEventById(eventId) : Promise.reject("No event ID")),
    enabled: eventId !== null,
    staleTime: 30 * 1000, // 30 seconds for live updates
  });
}

/**
 * Hook to fetch all countries
 */
export function useCountries() {
  return useQuery({
    queryKey: ["codante", "countries"],
    queryFn: fetchCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all disciplines
 */
export function useDisciplines() {
  return useQuery({
    queryKey: ["codante", "disciplines"],
    queryFn: fetchDisciplines,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch all events (use sparingly due to rate limits)
 */
export function useAllEvents() {
  return useQuery({
    queryKey: ["codante", "allEvents"],
    queryFn: fetchAllEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Extract competitors/athletes from an event
 */
export function getCompetitorsFromEvent(event: CodanteEvent) {
  return event.competitors.map((c, index) => ({
    name: c.competitor_name,
    country: c.country_id,
    flagUrl: c.country_flag_url,
    position: c.position,
    resultPosition: c.result_position,
    resultMark: c.result_mark,
  }));
}
