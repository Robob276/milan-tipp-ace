import React, { useState, useMemo } from 'react';
import { usePredictions } from '@/contexts/PredictionContext';
import { olympicEvents, countries, sportCategories, sportIcons } from '@/data/olympicEvents';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trophy, Check, Search, Filter, Trash2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { splitMedalValue, joinMedalValues } from '@/lib/medalUtils';

interface ResultsAdminProps {
  onBack: () => void;
}

const ResultsAdmin: React.FC<ResultsAdminProps> = ({ onBack }) => {
  const { results, setResult, deleteResult } = usePredictions();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [tempResult, setTempResult] = useState<{ gold: string[]; silver: string[]; bronze: string[] }>({ 
    gold: [''], silver: [''], bronze: [''] 
  });

  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.name, label: c.name })),
    [countries]
  );

  const allEvents = olympicEvents;

  const allCategories = useMemo(() => {
    return ['Alle', ...sportCategories.filter(c => c !== 'Alle')];
  }, []);

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.discipline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const eventsWithResults = olympicEvents.filter(e => results[e.id]).length;
  const totalEvents = olympicEvents.length;

  const handleEdit = (eventId: number) => {
    const existing = results[eventId];
    setTempResult({
      gold: existing ? splitMedalValue(existing.gold) : [''],
      silver: existing ? splitMedalValue(existing.silver) : [''],
      bronze: existing ? splitMedalValue(existing.bronze) : [''],
    });
    if (tempResult.gold.length === 0) setTempResult(prev => ({ ...prev, gold: [''] }));
    if (tempResult.silver.length === 0) setTempResult(prev => ({ ...prev, silver: [''] }));
    if (tempResult.bronze.length === 0) setTempResult(prev => ({ ...prev, bronze: [''] }));
    setEditingEvent(eventId);
  };

  const handleSave = async (eventId: number) => {
    const gold = joinMedalValues(tempResult.gold);
    const silver = joinMedalValues(tempResult.silver);
    const bronze = joinMedalValues(tempResult.bronze);
    
    // At least gold must be filled
    if (gold) {
      const { error } = await setResult(eventId, { gold, silver, bronze });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Ergebnis konnte nicht gespeichert werden: " + error
        });
      } else {
        toast({
          title: "Gespeichert",
          description: "Ergebnis wurde erfolgreich eingetragen."
        });
        setEditingEvent(null);
        setTempResult({ gold: [''], silver: [''], bronze: [''] });
      }
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setTempResult({ gold: [''], silver: [''], bronze: [''] });
  };

  const addCountrySlot = (position: 'gold' | 'silver' | 'bronze') => {
    setTempResult(prev => ({
      ...prev,
      [position]: [...prev[position], '']
    }));
  };

  const removeCountrySlot = (position: 'gold' | 'silver' | 'bronze', index: number) => {
    setTempResult(prev => ({
      ...prev,
      [position]: prev[position].filter((_, i) => i !== index)
    }));
  };

  const updateCountrySlot = (position: 'gold' | 'silver' | 'bronze', index: number, value: string) => {
    setTempResult(prev => ({
      ...prev,
      [position]: prev[position].map((v, i) => i === index ? value : v)
    }));
  };

  const renderMedalInputs = (position: 'gold' | 'silver' | 'bronze', label: string, gradientClass: string) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
        <div className={`w-4 h-4 rounded-full ${gradientClass}`} /> {label}
      </label>
      <div className="space-y-2">
        {tempResult[position].map((value, index) => (
          <div key={index} className="flex items-center gap-1">
            <SearchableSelect
              value={value}
              onValueChange={(v) => updateCountrySlot(position, index, v)}
              options={countryOptions}
              placeholder="Land wählen"
              searchPlaceholder="Land suchen..."
              className="w-full"
            />
            {tempResult[position].length > 1 && (
              <Button variant="ghost" size="sm" className="px-1 h-8 text-destructive" onClick={() => removeCountrySlot(position, index)}>
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-6 px-2" onClick={() => addCountrySlot(position)}>
          <Plus className="w-3 h-3 mr-1" /> Land hinzufügen
        </Button>
      </div>
    </div>
  );

  const canSave = tempResult.gold.some(v => v.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50 pt-[max(env(safe-area-inset-top,0px)+16px,32px)]">
        <div className="container mx-auto px-4 pb-3 pt-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-foreground">Ergebnisse eintragen</h1>
              <p className="text-xs text-muted-foreground">{eventsWithResults} von {totalEvents} Ergebnisse eingetragen</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Progress */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Fortschritt</span>
            <span className="text-sm text-muted-foreground">{Math.round((eventsWithResults / totalEvents) * 100)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full gradient-olympic transition-all duration-500"
              style={{ width: `${(eventsWithResults / totalEvents) * 100}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Sportart..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {filteredEvents.map((event) => {
            const hasResult = !!results[event.id];
            const isEditing = editingEvent === event.id;

            return (
              <div 
                key={event.id} 
                className={`glass-card rounded-xl p-4 transition-all ${
                  hasResult ? 'border-l-4 border-l-green-500' : ''
                }`}
              >
                {/* Event Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{sportIcons[event.sport] || '🏅'}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {event.sport} - {event.discipline}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.gender} • {format(new Date(event.date), 'dd. MMM yyyy', { locale: de })}
                    </p>
                  </div>
                  {hasResult && !isEditing && (
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <Button variant="outline" size="sm" onClick={() => handleEdit(event.id)}>
                        Bearbeiten
                      </Button>
                    </div>
                  )}
                  {!hasResult && !isEditing && (
                    <Button onClick={() => handleEdit(event.id)} className="gradient-olympic text-primary-foreground">
                      Ergebnis eintragen
                    </Button>
                  )}
                </div>

                {/* Result Display (when not editing) */}
                {hasResult && !isEditing && (
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/50">
                    {(['gold', 'silver', 'bronze'] as const).map((position) => {
                      const values = splitMedalValue(results[event.id][position]);
                      const gradientMap = { gold: 'gradient-gold', silver: 'gradient-silver', bronze: 'gradient-bronze' };
                      const bgMap = { gold: 'bg-gold/10', silver: 'bg-silver/10', bronze: 'bg-bronze/10' };
                      const numMap = { gold: '1', silver: '2', bronze: '3' };
                      
                      if (values.length === 0) return (
                        <div key={position} className={`flex items-center gap-2 p-2 rounded-lg ${bgMap[position]}`}>
                          <div className={`w-6 h-6 rounded-full ${gradientMap[position]} flex items-center justify-center text-white text-xs font-bold`}>{numMap[position]}</div>
                          <span className="text-sm text-muted-foreground">—</span>
                        </div>
                      );

                      return (
                        <div key={position} className={`p-2 rounded-lg ${bgMap[position]}`}>
                          {values.map((v, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {i === 0 && <div className={`w-6 h-6 rounded-full ${gradientMap[position]} flex items-center justify-center text-white text-xs font-bold`}>{numMap[position]}</div>}
                              {i > 0 && <div className="w-6 h-6" />}
                              <span className="text-sm font-medium text-foreground">{v}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Edit Form */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {renderMedalInputs('gold', 'Gold', 'gradient-gold')}
                      {renderMedalInputs('silver', 'Silber', 'gradient-silver')}
                      {renderMedalInputs('bronze', 'Bronze', 'gradient-bronze')}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>Abbrechen</Button>
                      {hasResult && (
                        <Button 
                          variant="ghost"
                          onClick={async () => {
                            await deleteResult(event.id);
                            toast({
                              title: "Gelöscht",
                              description: "Ergebnis wurde gelöscht."
                            });
                            setEditingEvent(null);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleSave(event.id)}
                        disabled={!canSave}
                        className="gradient-olympic text-primary-foreground"
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
      </main>
    </div>
  );
};

export default ResultsAdmin;
