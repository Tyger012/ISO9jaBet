import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Custom type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }
    
    // For iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone || false;

    // No need to show for installed PWAs or non-iOS/Android devices
    if (isInStandaloneMode || (!isIOS && !('BeforeInstallPromptEvent' in window))) {
      setShowPrompt(false);
      return;
    }

    // Handle the install prompt event for Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // If iOS, show custom message
    if (isIOS) {
      // Only show prompt if not in standalone mode
      setShowPrompt(!isInStandaloneMode);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setInstalled(true);
    } 
    
    // Clear the prompt so it can be garbage collected
    setInstallPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt || installed) {
    return null;
  }

  // Special instructions for iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  if (isIOS) {
    return (
      <Alert className="mt-2 bg-dark-100 border-primary shadow-lg">
        <AlertDescription className="text-sm font-medium text-white">
          To install ISO9jaBet: tap <span className="inline-block"><Download className="h-4 w-4 inline text-primary" /></span> then "Add to Home Screen"
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-dark-100 border-primary hover:bg-primary/20"
        onClick={handleInstallClick}
      >
        <Download className="h-4 w-4" />
        <span>Install App</span>
      </Button>
      <Alert className="bg-dark-100 border-primary shadow-lg">
        <AlertDescription className="text-xs text-white">
          To install ISO9jaBet: tap <span className="inline-block"><Download className="h-3 w-3 inline text-primary" /></span> then "Add to Home Screen"
        </AlertDescription>
      </Alert>
    </div>
  );
}