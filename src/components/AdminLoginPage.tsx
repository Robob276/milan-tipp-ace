import React, { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mountain, Snowflake, Shield, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onBackToHome?: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToHome }) => {
  const { players, login, setupPin } = usePlayer();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const adminPlayer = players.find(p => p.is_admin);
  const needsSetup = adminPlayer && !adminPlayer.has_pin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!adminPlayer) {
      setError('Admin-Konto nicht gefunden.');
      setLoading(false);
      return;
    }

    if (needsSetup) {
      if (pin !== confirmPin) {
        setError('PINs stimmen nicht überein.');
        setLoading(false);
        return;
      }
      const { error } = await setupPin(adminPlayer.id, pin);
      if (error) setError(error);
    } else {
      const { error } = await login(adminPlayer.id, pin);
      if (error) setError(error);
    }

    setLoading(false);
  };

  const handlePinChange = (value: string, setter: (v: string) => void) => {
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500 mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin-Bereich</h1>
          <p className="text-muted-foreground mt-2">Ergebnisse eintragen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {needsSetup ? 'Admin-PIN setzen (4 Ziffern)' : 'Admin-PIN'}
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

          {error && (
            <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
          )}

          <Button 
            type="submit" 
            disabled={loading || pin.length !== 4 || (needsSetup && confirmPin.length !== 4)}
            className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg"
          >
            {loading ? 'Laden...' : needsSetup ? 'PIN setzen & Anmelden' : 'Anmelden'}
          </Button>
        </form>

        {needsSetup && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Beim ersten Login musst du eine Admin-PIN festlegen.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
