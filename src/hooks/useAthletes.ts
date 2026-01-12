import { useQuery } from "@tanstack/react-query";
import { getAthletesByEvent, getAthletesGroupedByEvent, Athlete } from "@/services/athleteService";

/**
 * Hook to fetch athletes for a specific event
 */
export function useAthletesByEvent(eventId: number | null) {
  return useQuery({
    queryKey: ['athletes', 'event', eventId],
    queryFn: () => eventId ? getAthletesByEvent(eventId) : Promise.resolve([]),
    enabled: eventId !== null,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to fetch all athletes grouped by event
 */
export function useAthletesGrouped() {
  return useQuery({
    queryKey: ['athletes', 'grouped'],
    queryFn: getAthletesGroupedByEvent,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Check if an event has athletes loaded
 */
export function useHasAthletes(eventId: number) {
  const { data: athletesMap } = useAthletesGrouped();
  return athletesMap?.[eventId]?.length > 0;
}
