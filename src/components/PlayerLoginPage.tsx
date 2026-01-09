import React, { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mountain, Snowflake, Medal, ArrowLeft } from 'lucide-react';

interface PlayerLoginPageProps {
  onBackToHome?: () => void;
}

const PlayerLoginPage: React.FC<PlayerLoginPageProps> = ({ onBackToHome }) => {
  const { players, login, setupPin } = usePlayer();
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  const needsSetup = selectedPlayer && !selectedPlayer.has_pin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedPlayerId) {
      setError('Bitte wähle deinen Namen aus.');
      setLoading(false);
      return;
    }

    if (needsSetup) {
      // First time - setup PIN
      if (pin !== confirmPin) {
        setError('PINs stimmen nicht überein.');
        setLoading(false);
        return;
      }
      const { error } = await setupPin(selectedPlayerId, pin);
      if (error) setError(error);
    } else {
      // Login with existing PIN
      const { error } = await login(selectedPlayerId, pin);
      if (error) setError(error);
    }

    setLoading(false);
  };

  const handlePinChange = (value: string, setter: (v: string) => void) => {
    // Only allow digits, max 4
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setter(cleaned);
  };

  return (
    <div className="min-h-screen gradient-olympic flex items-center justify-center p-4 relative overflow-hidden">
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

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Snowflake className="absolute top-20 left-10 w-16 h-16 text-white/20 animate-float" />
        <Snowflake className="absolute top-40 right-20 w-12 h-12 text-white/15 animate-float" style={{ animationDelay: '1s' }} />
        <Mountain className="absolute bottom-0 left-0 w-96 h-96 text-white/5" />
      </div>

      <div className="glass-card rounded-2xl p-8 w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-olympic mb-4 shadow-olympic">
            <Medal className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Olympia Tippspiel</h1>
          <p className="text-muted-foreground mt-2">Mailand-Cortina 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Wer bist du?</label>
            <Select value={selectedPlayerId} onValueChange={(value) => {
              setSelectedPlayerId(value);
              setPin('');
              setConfirmPin('');
              setError('');
            }}>
              <SelectTrigger className="h-12 bg-background/50">
                <SelectValue placeholder="Wähle deinen Namen..." />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {players.filter(p => !p.is_admin).map(player => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} {!player.has_pin && '(Neu)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlayerId && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {needsSetup ? 'Neue 4-stellige PIN setzen' : 'Deine PIN'}
                </label>
                <Input
                  type="password"
                  inputMode="numeric"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value, setPin)}
                  className="h-12 bg-background/50 text-center text-2xl tracking-widest"
                  maxLength={4}
                />
              </div>

              {needsSetup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">PIN bestätigen</label>
                  <Input
                    type="password"
                    inputMode="numeric"
                    placeholder="••••"
                    value={confirmPin}
                    onChange={(e) => handlePinChange(e.target.value, setConfirmPin)}
                    className="h-12 bg-background/50 text-center text-2xl tracking-widest"
                    maxLength={4}
                  />
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
          )}

          <Button 
            type="submit" 
            disabled={loading || !selectedPlayerId || pin.length !== 4 || (needsSetup && confirmPin.length !== 4)}
            className="w-full h-12 gradient-olympic text-primary-foreground font-semibold shadow-olympic hover:opacity-90 transition-opacity"
          >
            {loading ? 'Laden...' : needsSetup ? 'PIN setzen & Anmelden' : 'Anmelden'}
          </Button>
        </form>

        {needsSetup && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Als neuer Spieler musst du zuerst deine eigene PIN festlegen.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayerLoginPage;
