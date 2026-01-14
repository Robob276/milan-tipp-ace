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
 * Smart prediction select that shows countries as main focus with athletes as hints.
 * 
 * Dropdown shows: "🇸🇪 Schweden" (big) + "Elvira Öberg" (small hint below)
 * Selected value shows: "🇸🇪 Schweden" only
 * 
 * The VALUE is always the COUNTRY name (for scoring)
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

  // Generate athlete options (top of list)
  const athleteOptions = useMemo(() => {
    if (!hasAthletes) return [];
    return athletes.map((athlete) => {
      const flag = getFlagFromName(athlete.country);
      return {
        key: athlete.id,
        value: athlete.country,
        searchLabel: `${athlete.country} ${athlete.name}`,
        countryLabel: `${flag} ${athlete.country}`,
        athleteName: athlete.name,
      };
    });
  }, [athletes, hasAthletes]);

  // Get countries that are NOT in the athlete list
  const athleteCountries = useMemo(() => {
    if (!hasAthletes) return new Set<string>();
    return new Set(athletes.map(a => a.country));
  }, [athletes, hasAthletes]);

  // All other countries (alphabetically)
  const otherCountryOptions = useMemo(() => {
    return countries
      .filter(c => !athleteCountries.has(c.name))
      .map((c) => ({
        key: `country-${c.code}`,
        value: c.name,
        searchLabel: c.name,
        countryLabel: `${getFlagFromName(c.name)} ${c.name}`,
        athleteName: null,
      }));
  }, [athleteCountries]);

  // Full country list when no athletes
  const allCountryOptions = useMemo(() => {
    return countries.map((c) => ({
      key: c.name,
      value: c.name,
      searchLabel: c.name,
      countryLabel: `${getFlagFromName(c.name)} ${c.name}`,
      athleteName: null,
    }));
  }, []);

  // For the button display - just show country with flag
  const selectedCountryLabel = value ? `${getFlagFromName(value)} ${value}` : null;

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
            {selectedCountryLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 z-50 bg-popover" align="start">
        <Command>
          <CommandInput placeholder={hasAthletes ? "Land oder Athlet suchen..." : "Land suchen..."} />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>Keine Ergebnisse.</CommandEmpty>
            
            {/* When athletes exist: show them first, then other countries */}
            {hasAthletes ? (
              <>
                <CommandGroup heading="Startliste">
                  {athleteOptions.map((option) => (
                    <CommandItem
                      key={option.key}
                      value={option.searchLabel}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className="flex flex-col items-start py-2"
                    >
                      <div className="flex items-center w-full">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="font-medium text-sm">{option.countryLabel}</span>
                      </div>
                      {option.athleteName && (
                        <span className="ml-6 text-xs text-muted-foreground truncate max-w-[180px]">
                          {option.athleteName}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Weitere Nationen">
                  {otherCountryOptions.map((option) => (
                    <CommandItem
                      key={option.key}
                      value={option.searchLabel}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className="flex flex-col items-start py-2"
                    >
                      <div className="flex items-center w-full">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="font-medium text-sm">{option.countryLabel}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            ) : (
              /* No athletes: show all countries */
              <CommandGroup>
                {allCountryOptions.map((option) => (
                  <CommandItem
                    key={option.key}
                    value={option.searchLabel}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="flex flex-col items-start py-2"
                  >
                    <div className="flex items-center w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="font-medium text-sm">{option.countryLabel}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
