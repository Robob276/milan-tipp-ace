import React, { useState, useMemo } from 'react';
import { olympicEvents, sportCategories } from '@/data/olympicEvents';
import EventCard from './EventCard';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const EventsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const filteredEvents = useMemo(() => {
    return olympicEvents.filter(event => {
      const matchesSearch = 
        event.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.gender.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'Alle' || event.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof olympicEvents> = {};
    filteredEvents.forEach(event => {
      if (!groups[event.date]) {
        groups[event.date] = [];
      }
      groups[event.date].push(event);
    });
    return groups;
  }, [filteredEvents]);

  const formatDateHeading = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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
        <div key={date} className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground sticky top-20 bg-background/80 backdrop-blur-sm py-2 z-10">
            {formatDateHeading(date)}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Events gefunden.</p>
        </div>
      )}
    </div>
  );
};

export default EventsList;
