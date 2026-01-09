import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mountain, Snowflake, Medal, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onBackToHome?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (isSignup) {
      if (!displayName.trim()) {
        setError('Bitte gib deinen Namen ein.');
        setLoading(false);
        return;
      }
      const { error } = await signup(email, password, displayName);
      if (error) setError(error);
    } else {
      const { error } = await login(email, password);
      if (error) setError(error);
    }
    
    setLoading(false);
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
          {isSignup && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input
                type="text"
                placeholder="Dein Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-12 bg-background/50"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">E-Mail</label>
            <Input
              type="email"
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Passwort</label>
            <Input
              type="password"
              placeholder="Dein Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-background/50"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 gradient-olympic text-primary-foreground font-semibold shadow-olympic hover:opacity-90 transition-opacity"
          >
            {loading ? 'Laden...' : isSignup ? 'Registrieren' : 'Anmelden'}
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-muted-foreground">
          {isSignup ? 'Bereits registriert?' : 'Noch kein Konto?'}{' '}
          <button 
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
            className="text-primary font-medium hover:underline"
          >
            {isSignup ? 'Anmelden' : 'Registrieren'}
          </button>
        </p>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Der erste Benutzer wird automatisch Admin.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
