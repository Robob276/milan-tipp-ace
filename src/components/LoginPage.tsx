import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/olympicEvents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mountain, Snowflake, Medal, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onBackToHome?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome }) => {
  const [selectedName, setSelectedName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedName || !pin) {
      setError('Bitte wähle deinen Namen und gib deinen PIN ein.');
      return;
    }

    const success = login(selectedName, pin);
    if (!success) {
      setError('Falscher PIN. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="min-h-screen gradient-olympic flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back Button */}
      {onBackToHome && (
        <Button
          variant="ghost"
          onClick={onBackToHome}
          className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/10 z-20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Snowflake className="absolute top-20 left-10 w-16 h-16 text-white/20 animate-float" />
        <Snowflake className="absolute top-40 right-20 w-12 h-12 text-white/15 animate-float" style={{ animationDelay: '1s' }} />
        <Snowflake className="absolute bottom-32 left-1/4 w-10 h-10 text-white/10 animate-float" style={{ animationDelay: '2s' }} />
        <Mountain className="absolute bottom-0 left-0 w-96 h-96 text-white/5" />
        <Mountain className="absolute bottom-0 right-0 w-80 h-80 text-white/5" style={{ transform: 'scaleX(-1)' }} />
      </div>

      <div className="glass-card rounded-2xl p-8 w-full max-w-md relative z-10 animate-scale-in">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-olympic mb-4 shadow-olympic">
            <Medal className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Olympia Tippspiel</h1>
          <p className="text-muted-foreground mt-2">Mailand-Cortina 2026</p>
        </div>

        {/* Olympic Rings */}
        <div className="flex justify-center gap-1 mb-8">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500" />
          <div className="w-6 h-6 rounded-full border-2 border-yellow-400 -ml-1" />
          <div className="w-6 h-6 rounded-full border-2 border-black -ml-1" />
          <div className="w-6 h-6 rounded-full border-2 border-green-500 -ml-1" />
          <div className="w-6 h-6 rounded-full border-2 border-red-500 -ml-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Spieler</label>
            <Select value={selectedName} onValueChange={setSelectedName}>
              <SelectTrigger className="w-full h-12 bg-background/50">
                <SelectValue placeholder="Wähle deinen Namen" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">PIN</label>
            <Input
              type="password"
              placeholder="Dein 4-stelliger PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              className="h-12 bg-background/50 text-center text-2xl tracking-widest"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 gradient-olympic text-primary-foreground font-semibold shadow-olympic hover:opacity-90 transition-opacity"
          >
            Anmelden
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          6. - 22. Februar 2026 • 116 Entscheidungen
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
