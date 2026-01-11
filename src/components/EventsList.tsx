import React, { useState, useMemo } from 'react';
import { olympicEvents, sportCategories, sportIcons, countries } from '@/data/olympicEvents';
import { usePlayer } from '@/contexts/PlayerContext';
import { usePredictions } from '@/contexts/PredictionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Search, Filter, Check, Clock, ChevronDown, ChevronUp, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import Countdown from './Countdown';

const EventsList: React.FC = () => {
  const { currentPlayer } = usePlayer();
  const { getPrediction, setPrediction, deletePrediction, results, isEventStarted } = usePredictions();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [tempPredictions, setTempPredictions] = useState<Record<number, { gold: string; silver: string; bronze: string }>>({});

  const countryOptions = useMemo(() => 
    countries.map(c => ({ value: c.name, label: c.name })), 
    []
  );

  // Split events into upcoming and completed
  const { upcomingEvents, completedEvents } = useMemo(() => {
    const filtered = olympicEvents.filter(event => {
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

    // Sort upcoming by date ascending, completed by date descending
    upcoming.sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
    completed.sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

    return { upcomingEvents: upcoming, completedEvents: completed };
  }, [searchTerm, selectedCategory, isEventStarted]);

  // Group events by date
  const groupEventsByDate = (events: typeof olympicEvents) => {
    const groups: Record<string, typeof olympicEvents> = {};
    events.forEach(event => {
      if (!groups[event.date]) groups[event.date] = [];
      groups[event.date].push(event);
    });
    return groups;
  };

  const upcomingGrouped = useMemo(() => groupEventsByDate(upcomingEvents), [upcomingEvents]);
  const completedGrouped = useMemo(() => groupEventsByDate(completedEvents), [completedEvents]);

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

    const prediction = currentPlayer ? getPrediction(currentPlayer.id, event.id) : null;
    const result = results[event.id];

    return (
      <div key={event.id} className="transition-all">
        {/* Compact Row */}
        <button
          onClick={() => {
            // Allow expanding completed events only if they have a prediction
            if (isCompleted && hasPrediction) {
              handleExpand(event.id, true);
            } else if (!isCompleted) {
              handleExpand(event.id, false);
            }
          }}
          disabled={isCompleted && !hasPrediction}
          className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
            isExpanded ? 'bg-primary/5' : 'hover:bg-secondary/30'
          } ${isCompleted && !hasPrediction ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
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
                isCompleted 
                  ? 'bg-muted text-muted-foreground' 
                  : hasPrediction
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-orange-500/20 text-orange-600'
              }`}>
                {isCompleted ? 'Abgeschlossen' : hasPrediction ? 'Getippt' : 'Offen'}
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
            {/* Countdown for upcoming events */}
            {!isCompleted && (
              <div className="mt-2">
                <Countdown targetDate={eventDate} />
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
            {hasPrediction && !isCompleted && status.type !== 'scored' && (
              <Check className="w-5 h-5 text-green-500" />
            )}
            {!hasPrediction && !isCompleted && (
              isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
            {/* Chevron for completed events with predictions */}
            {isCompleted && hasPrediction && (
              isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded Form - Editable for upcoming events */}
        {isExpanded && !isCompleted && (
          <div className="px-4 pb-4 space-y-3 animate-fade-in">
            <div className="grid grid-cols-3 gap-2">
              {/* Gold */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-gold" /> Gold
                </label>
                <SearchableSelect
                  value={temp.gold}
                  onValueChange={(v) => setTempPredictions(prev => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], gold: v }
                  }))}
                  options={countryOptions}
                  placeholder="Wählen"
                  searchPlaceholder="Land suchen..."
                  emptyText="Kein Land gefunden."
                  className="h-9 text-xs w-full"
                />
              </div>

              {/* Silver */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-silver" /> Silber
                </label>
                <SearchableSelect
                  value={temp.silver}
                  onValueChange={(v) => setTempPredictions(prev => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], silver: v }
                  }))}
                  options={countryOptions}
                  placeholder="Wählen"
                  searchPlaceholder="Land suchen..."
                  emptyText="Kein Land gefunden."
                  className="h-9 text-xs w-full"
                />
              </div>

              {/* Bronze */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full gradient-bronze" /> Bronze
                </label>
                <SearchableSelect
                  value={temp.bronze}
                  onValueChange={(v) => setTempPredictions(prev => ({
                    ...prev,
                    [event.id]: { ...prev[event.id], bronze: v }
                  }))}
                  options={countryOptions}
                  placeholder="Wählen"
                  searchPlaceholder="Land suchen..."
                  emptyText="Kein Land gefunden."
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

        {/* Expanded View - Read-only for completed events */}
        {isExpanded && isCompleted && hasPrediction && (
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
                  {prediction?.gold || '-'}
                </div>
                {result && result.gold !== prediction?.gold && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ergebnis: <span className="font-medium">{result.gold}</span>
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
                  {prediction?.silver || '-'}
                </div>
                {result && result.silver !== prediction?.silver && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ergebnis: <span className="font-medium">{result.silver}</span>
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
                  {prediction?.bronze || '-'}
                </div>
                {result && result.bronze !== prediction?.bronze && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ergebnis: <span className="font-medium">{result.bronze}</span>
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
          {sportCategories.map(category => (
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

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Anstehende Events
          </h2>
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/30">
            {upcomingEvents.map(event => renderEventCard(event, false))}
          </div>
        </div>
      )}

      {/* Completed Events */}
      {completedEvents.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-muted-foreground" />
            Abgeschlossene Events
          </h2>
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/30">
            {completedEvents.map(event => renderEventCard(event, true))}
          </div>
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
