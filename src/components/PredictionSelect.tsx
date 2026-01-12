import { useMemo } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useAthletesByEvent } from "@/hooks/useAthletes";
import { formatAthleteOption } from "@/services/athleteService";
import { countries } from "@/data/olympicEvents";
import { getFlagFromName } from "@/lib/countryFlags";

interface PredictionSelectProps {
  eventId: number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Smart prediction select that shows athletes if available, 
 * otherwise falls back to country selection
 */
export function PredictionSelect({
  eventId,
  value,
  onChange,
  placeholder = "Auswählen...",
  disabled = false,
}: PredictionSelectProps) {
  const { data: athletes, isLoading } = useAthletesByEvent(eventId);
  
  const hasAthletes = athletes && athletes.length > 0;

  // Generate options based on whether we have athletes or not
  const options = useMemo(() => {
    if (hasAthletes) {
      // Use athlete names with flags
      return athletes.map(formatAthleteOption);
    }
    // Fallback to country selection
    return countries.map((c) => ({
      value: c.name,
      label: `${getFlagFromName(c.name)} ${c.name}`,
    }));
  }, [athletes, hasAthletes]);

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onChange}
      placeholder={isLoading ? "Laden..." : placeholder}
      disabled={disabled || isLoading}
      searchPlaceholder={hasAthletes ? "Athlet suchen..." : "Land suchen..."}
    />
  );
}
