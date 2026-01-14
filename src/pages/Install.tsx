import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, Smartphone, Monitor, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install: React.FC = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for the install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src="/pwa-512x512.png" 
            alt="Tipp Ace Logo" 
            className="w-32 h-32 rounded-3xl shadow-xl"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Milan Tipp Ace
          </h1>
          <p className="mt-2 text-muted-foreground">
            Olympia Tippspiel 2026
          </p>
        </div>

        {isInstalled ? (
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              App installiert!
            </h2>
            <p className="text-muted-foreground">
              Du kannst die App jetzt von deinem Homescreen starten.
            </p>
            <Button onClick={() => navigate('/')} className="w-full gradient-olympic">
              Zur App
            </Button>
          </div>
        ) : isIOS ? (
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Share className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Auf iPhone installieren
            </h2>
            <div className="text-left space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <span>Tippe unten auf das <strong>Teilen-Symbol</strong> (Quadrat mit Pfeil nach oben)</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <span>Scrolle nach unten und tippe auf <strong>"Zum Home-Bildschirm"</strong></span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <span>Tippe oben rechts auf <strong>"Hinzufügen"</strong></span>
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Später machen
            </Button>
          </div>
        ) : deferredPrompt ? (
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Download className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              App installieren
            </h2>
            <p className="text-muted-foreground">
              Installiere die App auf deinem Gerät für schnelleren Zugriff und Offline-Nutzung.
            </p>
            <Button onClick={handleInstall} className="w-full gradient-olympic">
              <Download className="w-4 h-4 mr-2" />
              Jetzt installieren
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
              Später machen
            </Button>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Bereits verfügbar
            </h2>
            <p className="text-muted-foreground">
              Diese App ist bereits als Web-App verfügbar. Öffne sie in deinem Browser-Menü um sie zu installieren.
            </p>
            <Button onClick={() => navigate('/')} className="w-full gradient-olympic">
              Zur App
            </Button>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">⚡</span>
            </div>
            <p className="text-xs text-muted-foreground">Schnell</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">📴</span>
            </div>
            <p className="text-xs text-muted-foreground">Offline</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🏠</span>
            </div>
            <p className="text-xs text-muted-foreground">Homescreen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;
