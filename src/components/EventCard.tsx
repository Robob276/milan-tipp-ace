import React, { useState } from 'react';
import { OlympicEvent, countries, sportIcons } from '@/data/olympicEvents';
import { useAuth } from '@/contexts/AuthContext';
import { usePredictions } from '@/contexts/PredictionContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, Clock } from 'lucide-react';

interface EventCardProps {
  event: OlympicEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { currentUser } = useAuth();
  const { getPrediction, setPrediction } = usePredictions();
  
  const existingPrediction = currentUser ? getPrediction(currentUser.id, event.id) : null;
  
  const [gold, setGold] = useState(existingPrediction?.gold || '');
  const [silver, setSilver] = useState(existingPrediction?.silver || '');
  const [bronze, setBronze] = useState(existingPrediction?.bronze || '');
  const [saved, setSaved] = useState(false);

  const eventDate = new Date(event.date + 'T' + event.time);
  const isPast = eventDate < new Date();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const handleSave = () => {
    if (!currentUser || !gold || !silver || !bronze) return;
    
    setPrediction(currentUser.id, event.id, {
      eventId: event.id,
      gold,
      silver,
      bronze
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isComplete = gold && silver && bronze;
  const icon = sportIcons[event.category] || '🏅';

  return (
    <div className={`glass-card rounded-xl p-4 transition-all hover:shadow-olympic ${isPast ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-foreground">
              {event.discipline}
            </h3>
            <p className="text-sm text-muted-foreground">
              {event.sport} • {event.gender}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {event.time}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(event.date)}
          </p>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-3">
        {/* Gold */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-white shadow-sm">
            1
          </div>
          <Select value={gold} onValueChange={setGold} disabled={isPast}>
            <SelectTrigger className="flex-1 bg-gold-light/20 border-gold/30">
              <SelectValue placeholder="Gold wählen..." />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country.id} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Silver */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-silver flex items-center justify-center text-xs font-bold text-white shadow-sm">
            2
          </div>
          <Select value={silver} onValueChange={setSilver} disabled={isPast}>
            <SelectTrigger className="flex-1 bg-silver-light/20 border-silver/30">
              <SelectValue placeholder="Silber wählen..." />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country.id} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bronze */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-bronze flex items-center justify-center text-xs font-bold text-white shadow-sm">
            3
          </div>
          <Select value={bronze} onValueChange={setBronze} disabled={isPast}>
            <SelectTrigger className="flex-1 bg-bronze-light/20 border-bronze/30">
              <SelectValue placeholder="Bronze wählen..." />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country.id} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Save Button */}
      {!isPast && (
        <Button
          onClick={handleSave}
          disabled={!isComplete}
          className={`w-full mt-4 transition-all ${
            saved 
              ? 'bg-green-500 hover:bg-green-500' 
              : 'gradient-olympic hover:opacity-90'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Gespeichert!
            </>
          ) : (
            'Tipp speichern'
          )}
        </Button>
      )}
    </div>
  );
};

export default EventCard;
