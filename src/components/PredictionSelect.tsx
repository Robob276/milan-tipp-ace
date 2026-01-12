import { useMemo } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useAthletesByEvent } from "@/hooks/useAthletes";
import { countries } from "@/data/olympicEvents";
import { getFlagFromName } from "@/lib/countryFlags";

interface PredictionSelectProps {
  eventId: number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Smart prediction select that shows athletes with their countries if available,
 * otherwise falls back to country-only selection.
 * 
 * When athletes are available: "Johannes Thingnes Bø 🇳🇴 Norwegen"
 * Fallback (no athletes): "🇳🇴 Norwegen"
 * 
 * The VALUE is always the COUNTRY name (for scoring), but display shows athlete + country
 */
export function PredictionSelect({
  eventId,
  value,
  onChange,
  placeholder = "Auswählen...",
  disabled = false,
  className,
}: PredictionSelectProps) {
  const { data: athletes, isLoading } = useAthletesByEvent(eventId);
  
  const hasAthletes = athletes && athletes.length > 0;

  // Generate options based on whether we have athletes or not
  const options = useMemo(() => {
    if (hasAthletes) {
      // Show athletes with their country - VALUE is country name for scoring
      return athletes.map((athlete) => {
        const flag = getFlagFromName(athlete.country);
        return {
          // Value is the country name (what gets saved/scored)
          value: athlete.country,
          // Label shows athlete name + flag + country
          label: `${athlete.name} ${flag} ${athlete.country}`,
        };
      });
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
      className={className}
    />
  );
}
