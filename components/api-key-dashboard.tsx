// components/api-key-dashboard.tsx
"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ApiUsageStatistics } from "@/components/api-usage-stats";
import { KeyRound, Copy, Trash2 } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key?: string;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

export function ApiKeyDashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch API keys
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/api-keys');
      
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      toast.error('Failed to retrieve API keys', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create new API key
  const createApiKey = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: newKeyName || `API Key ${new Date().toLocaleDateString()}` 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create API key');
      }
      
      const newKey = await response.json();
      
      // Show the raw key only once
      toast.success('API Key Created', {
        description: (
          <div>
            <p>Your new API key is:</p>
            <pre className="mt-2 p-2 bg-muted rounded-md break-all">
              {newKey.key}
            </pre>
            <p className="text-xs mt-2 text-muted-foreground">
              Please copy and save this key. It will only be shown once.
            </p>
          </div>
        ),
        duration: 10000
      });
      
      // Refresh the list of API keys
      fetchApiKeys();
      
      // Reset input
      setNewKeyName('');
    } catch (error) {
      toast.error('Failed to create API key', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete API key
  const deleteApiKey = async (apiKeyId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/api-keys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKeyId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }
      
      toast.success('API Key Deleted');
      
      // Refresh the list of API keys
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to delete API key', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy API key to clipboard
  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <div className="space-y-6">
      {/* API Key Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New API Key</CardTitle>
          <CardDescription>
            Create a new API key to access ScanPro's API services
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            placeholder="Optional key name (e.g. Mobile App)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            onClick={createApiKey} 
            disabled={isLoading}
          >
            <KeyRound className="h-4 w-4 mr-2" /> Generate API Key
          </Button>
        </CardContent>
      </Card>

      {/* Existing API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage and view your existing API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No API keys created yet
            </p>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div 
                  key={key.id} 
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                      {key.expiresAt && ` | Expires: ${new Date(key.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyApiKey(key.key || '')}
                      disabled={!key.key}
                    >
                      <Copy className="h-4 w-4 mr-2" /> 
                      {copiedKey === key.key ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteApiKey(key.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Usage Statistics */}
      <ApiUsageStatistics userId="current" />
    </div>
  );
}