import React, { useState } from 'react';
import { OlympicEvent, countries, sportIcons } from '@/data/olympicEvents';
import { useAuth } from '@/contexts/AuthContext';
import { usePredictions } from '@/contexts/PredictionContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, Clock, Plus, X } from 'lucide-react';
import { splitMedalValue, joinMedalValues } from '@/lib/medalUtils';

interface EventCardProps {
  event: OlympicEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { user } = useAuth();
  const { getPrediction, setPrediction } = usePredictions();
  
  const existingPrediction = user ? getPrediction(user.id, event.id) : null;
  
  const [gold, setGold] = useState<string[]>(
    existingPrediction ? splitMedalValue(existingPrediction.gold) : ['']
  );
  const [silver, setSilver] = useState<string[]>(
    existingPrediction ? splitMedalValue(existingPrediction.silver) : ['']
  );
  const [bronze, setBronze] = useState<string[]>(
    existingPrediction ? splitMedalValue(existingPrediction.bronze) : ['']
  );
  const [saved, setSaved] = useState(false);

  // Ensure at least one empty slot
  const ensureSlot = (arr: string[]) => arr.length === 0 ? [''] : arr;

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

  const handleSave = async () => {
    if (!user) return;
    const g = joinMedalValues(gold);
    const s = joinMedalValues(silver);
    const b = joinMedalValues(bronze);
    if (!g || !s || !b) return;
    
    await setPrediction(event.id, { gold: g, silver: s, bronze: b });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isComplete = gold.some(v => v) && silver.some(v => v) && bronze.some(v => v);
  const icon = sportIcons[event.category] || '🏅';

  const updateSlot = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((v, i) => i === index ? value : v));
  };

  const addSlot = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const removeSlot = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const renderMedalSelect = (
    values: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    label: string,
    num: string,
    gradientClass: string,
    bgClass: string,
    borderClass: string
  ) => (
    <div className="space-y-2">
      {ensureSlot(values).map((value, index) => (
        <div key={index} className="flex items-center gap-3">
          {index === 0 ? (
            <div className={`w-8 h-8 rounded-full ${gradientClass} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
              {num}
            </div>
          ) : (
            <div className="w-8 h-8" />
          )}
          <Select value={value} onValueChange={(v) => updateSlot(setter, index, v)} disabled={isPast}>
            <SelectTrigger className={`flex-1 ${bgClass} ${borderClass}`}>
              <SelectValue placeholder={`${label} wählen...`} />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country.id} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {values.length > 1 && (
            <Button variant="ghost" size="sm" className="px-1 h-8 text-destructive" onClick={() => removeSlot(setter, index)} disabled={isPast}>
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      ))}
      {!isPast && values.length < 2 && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8" />
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-6 px-2" onClick={() => addSlot(setter)}>
            <Plus className="w-3 h-3 mr-1" /> Land hinzufügen
          </Button>
        </div>
      )}
    </div>
  );

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
        {renderMedalSelect(gold, setGold, 'Gold', '1', 'gradient-gold', 'bg-gold-light/20', 'border-gold/30')}
        {renderMedalSelect(silver, setSilver, 'Silber', '2', 'gradient-silver', 'bg-silver-light/20', 'border-silver/30')}
        {renderMedalSelect(bronze, setBronze, 'Bronze', '3', 'gradient-bronze', 'bg-bronze-light/20', 'border-bronze/30')}
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
