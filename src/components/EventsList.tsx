import React, { useState, useMemo } from 'react';
import { olympicEvents, sportCategories, sportIcons, countries } from '@/data/olympicEvents';
import { usePlayer } from '@/contexts/PlayerContext';
import { usePredictions } from '@/contexts/PredictionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Search, Filter, Check, Clock, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const EventsList: React.FC = () => {
  const { currentPlayer } = usePlayer();
  const { getPrediction, setPrediction, deletePrediction, results } = usePredictions();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [tempPredictions, setTempPredictions] = useState<Record<number, { gold: string; silver: string; bronze: string }>>({});

  const countryOptions = useMemo(() => 
    countries.map(c => ({ value: c.name, label: c.name })), 
    []
  );

  const filteredEvents = useMemo(() => {
    return olympicEvents.filter(event => {
      const matchesSearch = event.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.discipline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Alle' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [searchTerm, selectedCategory]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof olympicEvents> = {};
    filteredEvents.forEach(event => {
      if (!groups[event.date]) groups[event.date] = [];
      groups[event.date].push(event);
    });
    return groups;
  }, [filteredEvents]);

  const handleExpand = (eventId: number) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      const existing = currentPlayer ? getPrediction(currentPlayer.id, eventId) : null;
      setTempPredictions(prev => ({
        ...prev,
        [eventId]: {
          gold: existing?.gold || '',
          silver: existing?.silver || '',
          bronze: existing?.bronze || ''
        }
      }));
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
    // Clear temp predictions for this event
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
        {filteredEvents.length} von {olympicEvents.length} Entscheidungen
      </p>

      {/* Events by Date */}
      {Object.entries(groupedEvents).map(([date, events]) => (
        <div key={date} className="space-y-2">
          {/* Date Header */}
          <div className="sticky top-16 z-10 bg-background/95 backdrop-blur py-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full gradient-olympic" />
              {format(new Date(date), 'EEEE, dd. MMMM', { locale: de })}
            </h3>
          </div>

          {/* Event List - Kicktipp Style */}
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/30">
            {events.map(event => {
              const status = getEventStatus(event.id);
              const isExpanded = expandedEvent === event.id;
              const temp = tempPredictions[event.id] || { gold: '', silver: '', bronze: '' };
              const eventDate = new Date(event.date + 'T' + event.time);
              const isPast = eventDate < new Date();
              const hasPrediction = status.type === 'tipped' || status.type === 'scored';

              return (
                <div key={event.id} className="transition-all">
                  {/* Compact Row */}
                  <button
                    onClick={() => !isPast && handleExpand(event.id)}
                    disabled={isPast && status.type === 'open'}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                      isExpanded ? 'bg-primary/5' : 'hover:bg-secondary/30'
                    } ${isPast && status.type === 'open' ? 'opacity-50' : ''}`}
                  >
                    {/* Sport Icon */}
                    <span className="text-xl shrink-0">{sportIcons[event.category] || '🏅'}</span>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {event.discipline}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.sport} • {event.gender}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3 h-3" />
                      {event.time}
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
                      {status.type === 'tipped' && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      {status.type === 'open' && !isPast && (
                        isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Form */}
                  {isExpanded && (
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
                          Speichern
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredEvents.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Keine Events gefunden
        </div>
      )}
    </div>
  );
};

export default EventsList;
