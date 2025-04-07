// components/dashboard/api-key-manager.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  KeyIcon, 
  PlusIcon, 
  CopyIcon, 
  EyeIcon, 
  EyeOffIcon, 
  TrashIcon 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string | null;
  createdAt: string;
}

interface ApiKeyManagerProps {
  user: any;
}

export function ApiKeyManager({ user }: ApiKeyManagerProps) {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "convert", "compress", "merge", "split", "sign", "ocr", "repair", "protect", "unlock"
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Load API keys
  useEffect(() => {
    fetchApiKeys();
  }, []);
  
  // Handle permission toggle
  const togglePermission = (permission: string) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };
  
  // Fetch API keys from server
  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/keys');
      const data = await res.json();
      
      if (data.keys) {
        setKeys(data.keys);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };
  
  // Create new API key
  const createApiKey = async () => {
    if (!newKeyName) {
      toast.error("Please enter a name for your API key");
      return;
    }
    
    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }
    
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName,
          permissions: selectedPermissions
        })
      });
      
      const data = await res.json();
      
      if (data.success && data.key) {
        setShowNewKey(data.key.key);
        setKeys([...keys, data.key]);
        setNewKeyName("");
        setOpenDialog(false);
        toast.success("API key created successfully");
      } else {
        throw new Error(data.error || "Failed to create API key");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create API key");
    }
  };
  
  // Delete API key
  const deleteApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setKeys(keys.filter(key => key.id !== id));
        toast.success("API key revoked successfully");
      } else {
        throw new Error(data.error || "Failed to revoke API key");
      }
    } catch (error) {
        console.error("Error creating API key:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create API key");
      }
};
// Copy API key to clipboard
const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
      .then(() => {
        toast.success("API key copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy API key");
      });
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" /> Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key to integrate ScanPro with your applications.
                Your {user?.subscription?.tier || "free"} plan allows you to have 
                {user?.subscription?.tier === "pro" ? " 10" : 
                  user?.subscription?.tier === "basic" ? " 3" : " 1"} API keys.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="My API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Give your key a descriptive name to easily identify it later.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="convert"
                      checked={selectedPermissions.includes("convert")}
                      onCheckedChange={() => togglePermission("convert")}
                    />
                    <label htmlFor="convert" className="text-sm">Convert</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="compress"
                      checked={selectedPermissions.includes("compress")}
                      onCheckedChange={() => togglePermission("compress")}
                    />
                    <label htmlFor="compress" className="text-sm">Compress</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="merge"
                      checked={selectedPermissions.includes("merge")}
                      onCheckedChange={() => togglePermission("merge")}
                    />
                    <label htmlFor="merge" className="text-sm">Merge</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="split"
                      checked={selectedPermissions.includes("split")}
                      onCheckedChange={() => togglePermission("split")}
                    />
                    <label htmlFor="split" className="text-sm">Split</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="watermark"
                      checked={selectedPermissions.includes("watermark")}
                      onCheckedChange={() => togglePermission("watermark")}
                    />
                    <label htmlFor="watermark" className="text-sm">Watermark</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="protect"
                      checked={selectedPermissions.includes("protect")}
                      onCheckedChange={() => togglePermission("protect")}
                    />
                    <label htmlFor="protect" className="text-sm">Protect</label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={createApiKey}>Generate Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {showNewKey && (
        <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300 flex items-center">
              <KeyIcon className="h-4 w-4 mr-2" />
              New API Key Created
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              Copy this key now. For security reasons, you won't be able to see it again!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-black/30 p-3 rounded-md font-mono text-sm break-all">
              {showNewKey}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => {
                copyToClipboard(showNewKey);
                setShowNewKey(null);
              }}
            >
              <CopyIcon className="h-4 w-4 mr-2" />
              Copy and Close
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 rounded-full border-2 border-t-primary animate-spin"></div>
        </div>
      ) : keys.length === 0 ? (
        <div className="text-center py-8">
          <KeyIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No API Keys</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any API keys yet.
          </p>
          <Button onClick={() => setOpenDialog(true)}>Create Your First API Key</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {keys.map((key) => (
            <Card key={key.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{key.name}</CardTitle>
                    <CardDescription>Created {formatDate(key.createdAt)}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteApiKey(key.id)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 overflow-hidden">
                  <div className="font-mono text-sm text-muted-foreground truncate flex-1">
                    {key.key}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(key.key.replace('...', ''))}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {key.permissions.map((permission) => (
                      <Badge key={permission} variant="outline">{permission}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Last used: {formatDate(key.lastUsed)}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}