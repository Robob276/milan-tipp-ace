import { useApiHealth } from "@/hooks/useCodanteApi";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

/**
 * Shows the connection status to Codante.io API
 */
export function ApiStatusBadge() {
  const { data: isHealthy, isLoading, isError } = useApiHealth();

  if (isLoading) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        API prüfen...
      </Badge>
    );
  }

  if (isError || !isHealthy) {
    return (
      <Badge variant="destructive" className="gap-1">
        <WifiOff className="h-3 w-3" />
        API offline
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
      <Wifi className="h-3 w-3" />
      Live-Daten verfügbar
    </Badge>
  );
}
