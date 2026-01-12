import { useMemo, useState } from "react";
import { useAthletesByEvent } from "@/hooks/useAthletes";
import { countries } from "@/data/olympicEvents";
import { getFlagFromName } from "@/lib/countryFlags";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [open, setOpen] = useState(false);
  const { data: athletes } = useAthletesByEvent(eventId);
  
  const hasAthletes = athletes && athletes.length > 0;

  // Generate options - athletes have unique keys but country values
  const options = useMemo(() => {
    if (hasAthletes) {
      // Show athletes with their country - VALUE is country name for scoring
      return athletes.map((athlete) => {
        const flag = getFlagFromName(athlete.country);
        return {
          // Unique key for the athlete
          key: athlete.id,
          // Value is the country name (what gets saved/scored)
          value: athlete.country,
          // Label shows athlete name + flag + country
          label: `${athlete.name} ${flag} ${athlete.country}`,
          // Store athlete name for display when selected
          athleteName: athlete.name,
        };
      });
    }
    // Fallback to country selection (immediate, no loading state)
    return countries.map((c) => ({
      key: c.name,
      value: c.name,
      label: `${getFlagFromName(c.name)} ${c.name}`,
      athleteName: null,
    }));
  }, [athletes, hasAthletes]);

  // Find the selected option - for athletes, we need to match by value (country)
  // and show the first matching one (since user selected that country)
  const selectedOption = options.find((option) => option.value === value);
  
  // For display: show the full label if we have athletes, otherwise just the country
  const displayLabel = selectedOption?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("justify-between font-normal", className)}
        >
          <span className="truncate text-xs">
            {displayLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 z-50 bg-popover" align="start">
        <Command>
          <CommandInput placeholder={hasAthletes ? "Athlet suchen..." : "Land suchen..."} />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>Keine Ergebnisse.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.key}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
