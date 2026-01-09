import React, { useState } from 'react';
import { usePredictions } from '@/contexts/PredictionContext';
import { olympicEvents, countries, sportCategories, sportIcons } from '@/data/olympicEvents';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trophy, Check, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ResultsAdminProps {
  onBack: () => void;
}

const ResultsAdmin: React.FC<ResultsAdminProps> = ({ onBack }) => {
  const { results, setResult } = usePredictions();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [tempResult, setTempResult] = useState({ gold: '', silver: '', bronze: '' });

  const filteredEvents = olympicEvents.filter(event => {
    const matchesSearch = event.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.discipline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const eventsWithResults = Object.keys(results).length;
  const totalEvents = olympicEvents.length;

  const handleEdit = (eventId: number) => {
    const existing = results[eventId];
    setTempResult({
      gold: existing?.gold || '',
      silver: existing?.silver || '',
      bronze: existing?.bronze || ''
    });
    setEditingEvent(eventId);
  };

  const handleSave = async (eventId: number) => {
    if (tempResult.gold && tempResult.silver && tempResult.bronze) {
      const { error } = await setResult(eventId, {
        gold: tempResult.gold,
        silver: tempResult.silver,
        bronze: tempResult.bronze
      });
      
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
        setTempResult({ gold: '', silver: '', bronze: '' });
      }
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setTempResult({ gold: '', silver: '', bronze: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
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
              {sportCategories.map(category => (
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
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gold/10">
                      <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center text-white text-xs font-bold">1</div>
                      <span className="text-sm font-medium text-foreground">{results[event.id].gold}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-silver/10">
                      <div className="w-6 h-6 rounded-full gradient-silver flex items-center justify-center text-white text-xs font-bold">2</div>
                      <span className="text-sm font-medium text-foreground">{results[event.id].silver}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-bronze/10">
                      <div className="w-6 h-6 rounded-full gradient-bronze flex items-center justify-center text-white text-xs font-bold">3</div>
                      <span className="text-sm font-medium text-foreground">{results[event.id].bronze}</span>
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full gradient-gold" /> Gold
                        </label>
                        <Select value={tempResult.gold} onValueChange={(v) => setTempResult(prev => ({ ...prev, gold: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Land wählen" />
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
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full gradient-silver" /> Silber
                        </label>
                        <Select value={tempResult.silver} onValueChange={(v) => setTempResult(prev => ({ ...prev, silver: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Land wählen" />
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
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full gradient-bronze" /> Bronze
                        </label>
                        <Select value={tempResult.bronze} onValueChange={(v) => setTempResult(prev => ({ ...prev, bronze: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Land wählen" />
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
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>Abbrechen</Button>
                      <Button 
                        onClick={() => handleSave(event.id)}
                        disabled={!tempResult.gold || !tempResult.silver || !tempResult.bronze}
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
