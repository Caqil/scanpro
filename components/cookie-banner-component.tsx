"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, Cookie, Info, Lock, ShieldCheck } from "lucide-react";
// Remove language store import since we're not using translations
// import { useLanguageStore } from "@/src/store/store";

// Define the types of cookies we track
type CookieType = "necessary" | "functional" | "analytics" | "marketing";

// Cookie preferences state
interface CookiePreferences {
  necessary: boolean; // Always true and cannot be changed
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Cookie banner component
export function CookieConsentBanner() {
  // No need for translations
  // const { t, language } = useLanguageStore();
  
  // State for whether banner should be shown
  const [showBanner, setShowBanner] = useState(false);
  
  // State for showing the detailed preferences dialog
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Cookie preferences state
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always enabled
    functional: true,
    analytics: false,
    marketing: false
  });

  // Check if banner should be shown on first render
  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("cookie-consent");
    
    // If no consent found, show the banner
    if (!consent) {
      setShowBanner(true);
    } else {
      // Parse stored preferences
      try {
        const storedPreferences = JSON.parse(consent);
        setPreferences(storedPreferences);
      } catch (e) {
        // If there's an error parsing, reset consent
        localStorage.removeItem("cookie-consent");
        setShowBanner(true);
      }
    }
  }, []);

  // Save preferences and close banner
  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowPreferences(false);
    
    // Here you would typically trigger your cookie/tracking scripts based on preferences
    applyPreferences(preferences);
  };

  // Accept all cookies
  const acceptAll = () => {
    const allEnabled = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    
    setPreferences(allEnabled);
    localStorage.setItem("cookie-consent", JSON.stringify(allEnabled));
    setShowBanner(false);
    
    // Apply all cookie scripts
    applyPreferences(allEnabled);
  };

  // Accept only necessary cookies
  const acceptNecessary = () => {
    const essentialOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    
    setPreferences(essentialOnly);
    localStorage.setItem("cookie-consent", JSON.stringify(essentialOnly));
    setShowBanner(false);
    
    // Apply only necessary cookies
    applyPreferences(essentialOnly);
  };

  // Toggle a specific preference
  const togglePreference = (type: CookieType) => {
    // Don't allow toggling necessary cookies
    if (type === "necessary") return;
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Apply preferences by enabling/disabling appropriate scripts
  const applyPreferences = (prefs: CookiePreferences) => {
    // In a real implementation, you would:
    // 1. Always load necessary cookies
    
    // 2. Conditionally load other cookie types based on preferences
    if (prefs.functional) {
      // Load functional cookies
      console.log("Loading functional cookies/scripts");
    }
    
    if (prefs.analytics) {
      // Load analytics (like Google Analytics)
      console.log("Loading analytics cookies/scripts");
    }
    
    if (prefs.marketing) {
      // Load marketing/advertising cookies
      console.log("Loading marketing cookies/scripts");
    }
  };

  // Cookie descriptions (English only)
  const cookieDescriptions = {
    necessary: "Essential cookies that enable core site functionality. These cannot be disabled.",
    functional: "Cookies that enhance your experience by remembering your preferences and settings.",
    analytics: "Cookies that help us understand how you use our site, which pages you visit, and how long you stay.",
    marketing: "Cookies used for targeted advertising and tracking across different websites."
  };

  if (!showBanner) {
    // Render a small button to reopen cookie preferences
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full h-10 w-10 p-0 shadow-md"
          onClick={() => setShowPreferences(true)}
          aria-label="Cookie Settings"
        >
          <Cookie className="h-5 w-5" />
        </Button>
        
        <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Cookie Preferences</DialogTitle>
              <DialogDescription>Manage your cookie preferences. You can enable or disable different types of cookies below.
              </DialogDescription>
            </DialogHeader>
            
            <CookiePreferencesContent 
              preferences={preferences}
              togglePreference={togglePreference}
              descriptions={cookieDescriptions}
            />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreferences(false)}>
              Cancel
              </Button>
              <Button onClick={savePreferences}>
              Save Preferences
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 md:pb-4">
      <div className="w-full max-w-6xl mx-auto bg-background/95 backdrop-blur border rounded-lg shadow-lg p-4 md:p-6 animate-in slide-in-from-bottom">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
              <Cookie className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">
                This website uses cookies
              </h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to improve your experience, for analytics, and to show you relevant content. You can choose which cookies you want to allow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {/* Accept all button */}
              <Button
                variant="default"
                className="flex-1"
                onClick={acceptAll}
              >
                Accept All
              </Button>
              
              {/* Accept necessary only */}
              <Button
                variant="outline"
                className="flex-1"
                onClick={acceptNecessary}
              >
                Necessary Only
              </Button>
              
              {/* Customize options */}
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowPreferences(true)}
              >
                Customize
              </Button>
            </div>
          </div>
          
          <div className="flex items-start md:items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={acceptNecessary}
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>
          
          <CookiePreferencesContent 
            preferences={preferences}
            togglePreference={togglePreference}
            descriptions={cookieDescriptions}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={savePreferences}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component for cookie preferences content
function CookiePreferencesContent({
  preferences,
  togglePreference,
  descriptions
}: {
  preferences: CookiePreferences;
  togglePreference: (type: CookieType) => void;
  descriptions: Record<CookieType, string>;
}) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="all">All Cookies</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4 mt-4">
        {/* Necessary cookies - always enabled */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Necessary</Label>
            <p className="text-sm text-muted-foreground">{descriptions.necessary}</p>
          </div>
          <Switch checked={preferences.necessary} disabled />
        </div>
        
        <Separator />
        
        {/* Functional cookies */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Functional</Label>
            <p className="text-sm text-muted-foreground">{descriptions.functional}</p>
          </div>
          <Switch 
            checked={preferences.functional} 
            onCheckedChange={() => togglePreference("functional")}
          />
        </div>
        
        <Separator />
        
        {/* Analytics cookies */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Analytics</Label>
            <p className="text-sm text-muted-foreground">{descriptions.analytics}</p>
          </div>
          <Switch 
            checked={preferences.analytics} 
            onCheckedChange={() => togglePreference("analytics")}
          />
        </div>
        
        <Separator />
        
        {/* Marketing cookies */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Marketing</Label>
            <p className="text-sm text-muted-foreground">{descriptions.marketing}</p>
          </div>
          <Switch 
            checked={preferences.marketing} 
            onCheckedChange={() => togglePreference("marketing")}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="details" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">What are cookies?</h3>
              <p className="text-sm text-muted-foreground">
                Cookies are small text files that are placed on your device to help the site provide a better user experience. In general, cookies are used to retain user preferences, store information for things like shopping carts, and provide anonymized tracking data to third-party applications.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium">How we use cookies</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to understand how you use our website, to remember your preferences, and to improve your experience. Some cookies are essential for the operation of our website, while others help us improve by giving us insight into how the site is being used.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Your choices</h3>
              <p className="text-sm text-muted-foreground">
                You can choose to accept or decline non-essential cookies. By using our website, you consent to our use of cookies in accordance with your preferences. You can change your preferences at any time by clicking the cookie icon at the bottom left of the page.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}