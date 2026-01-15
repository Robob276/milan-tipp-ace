import React, { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mountain, Snowflake, Shield } from 'lucide-react';
import opodiumLogo from '@/assets/opodium-logo.jpeg';

interface PlayerLoginPageProps {
  onAdminLogin?: () => void;
}

const PlayerLoginPage: React.FC<PlayerLoginPageProps> = ({ onAdminLogin }) => {
  const { players, login, setupPin } = usePlayer();
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter out admin players for regular login
  const regularPlayers = players.filter(p => !p.is_admin);
  const selectedPlayer = regularPlayers.find(p => p.id === selectedPlayerId);
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
    <div className="min-h-screen gradient-olympic flex items-center justify-center p-4 relative">
      {onAdminLogin && (
        <Button
          variant="ghost"
          onClick={onAdminLogin}
          className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 z-20"
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </Button>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <Snowflake className="absolute top-20 left-10 w-16 h-16 text-white/20 animate-float" />
        <Snowflake className="absolute top-40 right-20 w-12 h-12 text-white/15 animate-float" style={{ animationDelay: '1s' }} />
        <Mountain className="absolute bottom-0 left-0 w-96 h-96 text-white/5" />
      </div>

      <div className="glass-card rounded-2xl p-8 w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <img 
            src={opodiumLogo} 
            alt="Opodium Logo" 
            className="w-24 h-24 rounded-full mx-auto mb-4 shadow-olympic object-cover"
          />
          <h1 className="text-2xl font-bold text-foreground">Opodium Tippspiel</h1>
          <p className="text-muted-foreground mt-2">Wähle dich aus und melde dich an</p>
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
              <SelectTrigger className="h-12 bg-background/50 pointer-events-auto">
                <SelectValue placeholder="Wähle deinen Namen..." />
              </SelectTrigger>
              <SelectContent 
                className="bg-background border shadow-lg pointer-events-auto" 
                position="popper" 
                sideOffset={4}
              >
                {regularPlayers.map(player => (
                  <SelectItem key={player.id} value={player.id} className="cursor-pointer">
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
