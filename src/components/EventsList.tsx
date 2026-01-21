import React, { useState, useMemo } from 'react';
import { olympicEvents, sportCategories, sportIcons } from '@/data/olympicEvents';
import { ruhpoldingEvents } from '@/data/ruhpoldingEvents';
import { usePlayer } from '@/contexts/PlayerContext';
import { usePredictions } from '@/contexts/PredictionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PredictionSelect } from '@/components/PredictionSelect';
import { Search, Filter, Check, Clock, ChevronDown, ChevronUp, Trash2, Calendar, AlertTriangle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import Countdown from './Countdown';
import { getFlagFromName } from '@/lib/countryFlags';

interface EventsListProps {
  competitionId: string;
  isArchived?: boolean;
}

const EventsList: React.FC<EventsListProps> = ({ competitionId, isArchived = false }) => {
  const { currentPlayer } = usePlayer();
  const { getPrediction, setPrediction, deletePrediction, results, isEventStarted } = usePredictions();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [tempPredictions, setTempPredictions] = useState<Record<number, { gold: string; silver: string; bronze: string }>>({});
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  // Get events based on competition
  const events = competitionId === 'ruhpolding-2026' ? ruhpoldingEvents : olympicEvents;
  const categories = competitionId === 'ruhpolding-2026' ? ['Alle', 'Biathlon'] : sportCategories;

  // countryOptions removed - now using PredictionSelect component

  // Split events into upcoming and completed
  const { upcomingEvents, completedEvents } = useMemo(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.discipline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Alle' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const upcoming: typeof olympicEvents = [];
    const completed: typeof olympicEvents = [];

    filtered.forEach(event => {
      if (isEventStarted(event.id)) {
        completed.push(event);
      } else {
        upcoming.push(event);
      }
    });

    // Helper to get the deadline date (predictionDeadline if available, otherwise event date)
    const getDeadlineDate = (event: typeof olympicEvents[0]) => {
      return event.predictionDeadline 
        ? new Date(event.predictionDeadline) 
        : new Date(event.date + 'T' + event.time);
    };

    // Sort upcoming by prediction deadline ascending (earliest deadline first)
    upcoming.sort((a, b) => getDeadlineDate(a).getTime() - getDeadlineDate(b).getTime());
    // Sort completed by event date descending
    completed.sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

    return { upcomingEvents: upcoming, completedEvents: completed };
  }, [searchTerm, selectedCategory, isEventStarted, events]);

  // Group events by date - for upcoming events, use prediction deadline date
  const groupEventsByDate = (events: typeof olympicEvents, useDeadline: boolean = false) => {
    const groups: Record<string, typeof olympicEvents> = {};
    events.forEach(event => {
      // For upcoming events, group by prediction deadline if available
      const groupDate = useDeadline && event.predictionDeadline 
        ? event.predictionDeadline.split('T')[0] 
        : event.date;
      if (!groups[groupDate]) groups[groupDate] = [];
      groups[groupDate].push(event);
    });
    return groups;
  };

  // Group upcoming by prediction deadline, completed by event date
  const upcomingGrouped = useMemo(() => groupEventsByDate(upcomingEvents, true), [upcomingEvents]);
  const completedGrouped = useMemo(() => groupEventsByDate(completedEvents, false), [completedEvents]);

  const handleExpand = (eventId: number, isCompleted: boolean = false) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      const existing = currentPlayer ? getPrediction(currentPlayer.id, eventId) : null;
      // Only set temp predictions for editing on non-completed events
      if (!isCompleted) {
        setTempPredictions(prev => ({
          ...prev,
          [eventId]: {
            gold: existing?.gold || '',
            silver: existing?.silver || '',
            bronze: existing?.bronze || ''
          }
        }));
      }
      setExpandedEvent(eventId);
    }
  };

  const handleSave = async (eventId: number) => {
    const pred = tempPredictions[eventId];
    if (!pred || !pred.gold || !pred.silver || !pred.bronze) return;

    await setPrediction(eventId, pred);
    toast({
      title: "Gespeichert!",
      description: "Dein Tipp wurde erfolgreich gespeichert."
    });
    setExpandedEvent(null);
  };

  const handleDelete = async (eventId: number) => {
    await deletePrediction(eventId);
    toast({
      title: "Gelöscht!",
      description: "Dein Tipp wurde gelöscht."
    });
    setExpandedEvent(null);
    setTempPredictions(prev => {
      const newPreds = { ...prev };
      delete newPreds[eventId];
      return newPreds;
    });
  };

  const getEventStatus = (eventId: number) => {
    const prediction = currentPlayer ? getPrediction(currentPlayer.id, eventId) : null;
    const result = results[eventId];
    
    if (result && prediction) {
      let points = 0;
      if (prediction.gold === result.gold) points += 3;
      if (prediction.silver === result.silver) points += 2;
      if (prediction.bronze === result.bronze) points += 1;
      return { type: 'scored', points };
    }
    if (result) return { type: 'result', points: 0 };
    if (prediction) return { type: 'tipped', points: 0 };
    return { type: 'open', points: 0 };
  };

  const renderEventCard = (event: typeof olympicEvents[0], isCompleted: boolean) => {
    const status = getEventStatus(event.id);
    const isExpanded = expandedEvent === event.id;
    const temp = tempPredictions[event.id] || { gold: '', silver: '', bronze: '' };
    const eventDate = new Date(event.date + 'T' + event.time);
    const hasPrediction = status.type === 'tipped' || status.type === 'scored';

    // If archived, treat all events as completed (read-only)
    const effectivelyCompleted = isCompleted || isArchived;

    // Use predictionDeadline if available, otherwise use event date
    const deadlineDate = event.predictionDeadline 
      ? new Date(event.predictionDeadline) 
      : eventDate;

    // Calculate urgency based on prediction deadline (not event date)
    const hoursUntilDeadline = (deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const isUrgent = !effectivelyCompleted && !hasPrediction && hoursUntilDeadline <= 24 && hoursUntilDeadline > 0;
    const isVeryUrgent = !effectivelyCompleted && !hasPrediction && hoursUntilDeadline <= 6 && hoursUntilDeadline > 0;
    const isCritical = !effectivelyCompleted && !hasPrediction && hoursUntilDeadline <= 2 && hoursUntilDeadline > 0;

    const prediction = currentPlayer ? getPrediction(currentPlayer.id, event.id) : null;
    const result = results[event.id];

    return (
      <div key={event.id} className={`transition-all ${
        isCritical ? 'ring-2 ring-red-500/50 rounded-lg' :
        isVeryUrgent ? 'ring-2 ring-orange-500/40 rounded-lg' :
        isUrgent ? 'ring-2 ring-amber-500/30 rounded-lg' : ''
      }`}>
        {/* Compact Row */}
        <button
          onClick={() => {
            // Allow expanding completed/archived events only if they have a prediction
            if (effectivelyCompleted && hasPrediction) {
              handleExpand(event.id, true);
            } else if (!effectivelyCompleted) {
              handleExpand(event.id, false);
            }
          }}
          disabled={effectivelyCompleted && !hasPrediction}
          className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
            isExpanded ? 'bg-primary/5' : 'hover:bg-secondary/30'
          } ${effectivelyCompleted && !hasPrediction ? 'opacity-50 cursor-default' : 'cursor-pointer'} ${
            isCritical ? 'bg-red-500/5' :
            isVeryUrgent ? 'bg-orange-500/5' :
            isUrgent ? 'bg-amber-500/5' : ''
          }`}
        >
          {/* Sport Icon */}
          <span className="text-xl shrink-0">{sportIcons[event.category] || '🏅'}</span>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground truncate">
                {event.sport}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                effectivelyCompleted 
                  ? 'bg-muted text-muted-foreground' 
                  : hasPrediction
                    ? 'bg-green-500/20 text-green-600'
                    : isCritical
                      ? 'bg-red-500/20 text-red-600 font-semibold animate-pulse'
                      : isVeryUrgent
                        ? 'bg-orange-500/20 text-orange-600 font-medium'
                        : isUrgent
                          ? 'bg-amber-500/20 text-amber-600'
                          : 'bg-orange-500/20 text-orange-600'
              }`}>
                {effectivelyCompleted ? 'Abgeschlossen' : hasPrediction ? 'Getippt' : isCritical ? '⚠️ Jetzt tippen!' : isUrgent ? '⏰ Bald!' : 'Offen'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {event.discipline} / {event.gender}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(event.date), 'EEEE, dd.MM.yyyy', { locale: de })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.time} Uhr
              </span>
            </div>
            {/* Countdown for upcoming events - use prediction deadline if available */}
            {!effectivelyCompleted && (
              <div className="mt-2">
                <Countdown 
                  targetDate={deadlineDate} 
                  label={event.predictionDeadline ? "Früher Tippschluss:" : "Tippschluss in:"}
                  showUrgency={true}
                  hasPrediction={hasPrediction}
                />
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {status.type === 'scored' && (
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                status.points >= 5 ? 'bg-green-500 text-white' :
                status.points >= 3 ? 'gradient-gold text-white' :
                status.points > 0 ? 'bg-primary/20 text-primary' :
                'bg-muted text-muted-foreground'
              }`}>
                {status.points}
              </span>
            )}
            {status.type === 'result' && (
              <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                Kein Tipp
              </span>
            )}
            {hasPrediction && !effectivelyCompleted && status.type !== 'scored' && (
              <Check className="w-5 h-5 text-green-500" />
            )}
            {!hasPrediction && !effectivelyCompleted && (
              isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
            {/* Chevron for completed/archived events with predictions */}
            {effectivelyCompleted && hasPrediction && (
              isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded Form - Editable for upcoming events (not archived) */}
        {isExpanded && !effectivelyCompleted && (
          <div className="px-4 pb-4 space-y-3 animate-fade-in">
            <div className="grid grid-cols-3 gap-2">
              {/* Gold */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-gold" /> Gold
                </label>
                <PredictionSelect
                  eventId={event.id}
                  value={temp.gold}
                  onChange={(v) => setTempPredictions(prev => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], gold: v }
                  }))}
                  placeholder="Wählen"
                  className="h-9 text-xs w-full"
                />
              </div>

              {/* Silver */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-silver" /> Silber
                </label>
                <PredictionSelect
                  eventId={event.id}
                  value={temp.silver}
                  onChange={(v) => setTempPredictions(prev => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], silver: v }
                  }))}
                  placeholder="Wählen"
                  className="h-9 text-xs w-full"
                />
              </div>

              {/* Bronze */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-bronze" /> Bronze
                </label>
                <PredictionSelect
                  eventId={event.id}
                  value={temp.bronze}
                  onChange={(v) => setTempPredictions(prev => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], bronze: v }
                  }))}
                  placeholder="Wählen"
                  className="h-9 text-xs w-full"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {/* Delete button - only show if prediction exists */}
              {hasPrediction && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(event.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button 
                size="sm"
                onClick={() => handleSave(event.id)}
                disabled={!temp.gold || !temp.silver || !temp.bronze}
                className="flex-1 gradient-olympic text-primary-foreground"
              >
                Tipp abgeben
              </Button>
            </div>
          </div>
        )}

        {/* Expanded View - Read-only for completed/archived events */}
        {isExpanded && effectivelyCompleted && hasPrediction && (
          <div className="px-4 pb-4 space-y-3 animate-fade-in">
            <div className="grid grid-cols-3 gap-2">
              {/* Gold */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-gold" /> Gold
                </label>
                <div className={`h-9 px-3 flex items-center rounded-md border text-sm ${
                  result?.gold === prediction?.gold 
                    ? 'bg-green-500/10 border-green-500/30 text-green-600' 
                    : 'bg-muted/50 border-border text-foreground'
                }`}>
                  {prediction?.gold ? `${getFlagFromName(prediction.gold)} ${prediction.gold}` : '-'}
                </div>
                {result && result.gold !== prediction?.gold && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ergebnis: <span className="font-medium">{getFlagFromName(result.gold)} {result.gold}</span>
                  </p>
                )}
              </div>

              {/* Silver */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-silver" /> Silber
                </label>
                <div className={`h-9 px-3 flex items-center rounded-md border text-sm ${
                  result?.silver === prediction?.silver 
                    ? 'bg-green-500/10 border-green-500/30 text-green-600' 
                    : 'bg-muted/50 border-border text-foreground'
                }`}>
                  {prediction?.silver ? `${getFlagFromName(prediction.silver)} ${prediction.silver}` : '-'}
                </div>
                {result && result.silver !== prediction?.silver && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ergebnis: <span className="font-medium">{getFlagFromName(result.silver)} {result.silver}</span>
                  </p>
                )}
              </div>

              {/* Bronze */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-bronze" /> Bronze
                </label>
                <div className={`h-9 px-3 flex items-center rounded-md border text-sm ${
                  result?.bronze === prediction?.bronze 
                    ? 'bg-green-500/10 border-green-500/30 text-green-600' 
                    : 'bg-muted/50 border-border text-foreground'
                }`}>
                  {prediction?.bronze ? `${getFlagFromName(prediction.bronze)} ${prediction.bronze}` : '-'}
                </div>
                {result && result.bronze !== prediction?.bronze && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ergebnis: <span className="font-medium">{getFlagFromName(result.bronze)} {result.bronze}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Points summary if scored */}
            {status.type === 'scored' && (
              <div className="text-center py-2 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium text-foreground">
                  {status.points} Punkt{status.points !== 1 ? 'e' : ''} erreicht
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const totalEvents = upcomingEvents.length + completedEvents.length;

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="glass-card rounded-xl p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Suche nach Sportart..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-background/50"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'gradient-olympic text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Count */}
      <p className="text-sm text-muted-foreground">
        {totalEvents} Entscheidungen ({upcomingEvents.length} anstehend, {completedEvents.length} abgeschlossen)
      </p>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowUpcoming(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showUpcoming
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Anstehend ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setShowUpcoming(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !showUpcoming
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          Abgeschlossen ({completedEvents.length})
        </button>
      </div>

      {/* Upcoming Events - Grouped by Date */}
      {showUpcoming && upcomingEvents.length > 0 && (
        <div className="space-y-4">
          {Object.entries(upcomingGrouped)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, dateEvents]) => (
              <div key={date} className="space-y-2">
                {/* Date Headline */}
                <div className="flex items-center gap-2 px-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-primary">
                    {format(new Date(date), 'EEEE, dd.MM.yyyy', { locale: de })}
                  </h3>
                </div>
                <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/30">
                  {dateEvents.map(event => renderEventCard(event, false))}
                </div>
              </div>
            ))}
        </div>
      )}

      {showUpcoming && upcomingEvents.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Keine anstehenden Events
        </div>
      )}

      {/* Completed Events - Grouped by Date */}
      {!showUpcoming && completedEvents.length > 0 && (
        <div className="space-y-4">
          {Object.entries(completedGrouped)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, dateEvents]) => (
              <div key={date} className="space-y-2">
                {/* Date Headline */}
                <div className="flex items-center gap-2 px-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {format(new Date(date), 'EEEE, dd.MM.yyyy', { locale: de })}
                  </h3>
                </div>
                <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/30">
                  {dateEvents.map(event => renderEventCard(event, true))}
                </div>
              </div>
            ))}
        </div>
      )}

      {!showUpcoming && completedEvents.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Keine abgeschlossenen Events
        </div>
      )}

      {totalEvents === 0 && (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Keine Events gefunden
        </div>
      )}
    </div>
  );
};

export default EventsList;
