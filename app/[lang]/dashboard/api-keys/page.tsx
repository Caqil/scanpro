// app/[lang]/dashboard/api-keys/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { KeyRound, Trash2, EyeIcon, EyeOffIcon, CopyIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { LanguageLink } from '@/components/language-link';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  key?: string;
  isEnabled: boolean;
  lastUsed: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
  const [keyVisible, setKeyVisible] = useState(false);

  // Fetch API keys on page load
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/api-keys');
      if (!response.ok) throw new Error('Failed to fetch API keys');
      
      const data = await response.json();
      setApiKeys(data.apiKeys);
    } catch (error) {
      toast.error('Failed to load API keys');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for your API key');
      return;
    }

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!response.ok) throw new Error('Failed to create API key');
      
      const data = await response.json();
      setNewKey(data.apiKey);
      
      // Refresh the API keys list
      fetchApiKeys();
      
      // Clear the form
      setNewKeyName('');
    } catch (error) {
      toast.error('Failed to create API key');
      console.error(error);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete API key');
      
      // Filter out the deleted key
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      setShowDeleteDialog(false);
      setKeyToDelete(null);
      
      toast.success('API key deleted successfully');
    } catch (error) {
      toast.error('Failed to delete API key');
      console.error(error);
    }
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="mt-2 text-muted-foreground">
          Create and manage API keys to access ScanPro from your applications
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowCreateDialog(true)}>
                <KeyRound className="mr-2 h-4 w-4" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  API keys allow external applications to authenticate with ScanPro API.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="My App"
                    className="col-span-3"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    createApiKey();
                    setShowCreateDialog(false);
                  }}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Dialog to display newly created API key */}
          {newKey && (
            <Dialog open={!!newKey} onOpenChange={(open) => !open && setNewKey(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>
                    Copy this API key now. You won't be able to see it again!
                  </DialogDescription>
                </DialogHeader>
                
                <div className="bg-muted p-4 rounded-md relative my-4">
                  <div className="flex items-center space-x-2">
                    <div className="font-mono break-all text-sm">
                      {keyVisible ? newKey.key : '•'.repeat(newKey.key?.length || 32)}
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => setKeyVisible(!keyVisible)}
                    >
                      {keyVisible ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => newKey.key && copyApiKey(newKey.key)}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md flex items-start gap-3 my-2">
                  <AlertCircle className="text-amber-600 dark:text-amber-400 h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-600 dark:text-amber-400">
                      Important
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      This key will only be displayed once. Store it securely - you'll need to create a new key if you lose it.
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={() => {
                      if (newKey.key) copyApiKey(newKey.key);
                      setNewKey(null);
                    }}
                  >
                    Copy and Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Dialog to confirm API key deletion */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete API Key</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the API key.
                </DialogDescription>
              </DialogHeader>
              
              {keyToDelete && (
                <div className="py-4">
                  <p>
                    Are you sure you want to delete the API key <strong>{keyToDelete.name}</strong>?
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Any applications using this key will no longer be able to access the API.
                  </p>
                </div>
              )}
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setKeyToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => keyToDelete && deleteApiKey(keyToDelete.id)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : apiKeys.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <KeyRound className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No API Keys</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              You haven't created any API keys yet. API keys allow your applications to authenticate with the ScanPro API.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              Create API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <Card key={key.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{key.name}</CardTitle>
                    <CardDescription>Created on {formatDate(key.createdAt)}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setKeyToDelete(key);
                      setShowDeleteDialog(true);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{key.prefix}...</code>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last used</p>
                    <p>{formatDate(key.lastUsed)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expires</p>
                    <p>{key.expiresAt ? formatDate(key.expiresAt) : 'Never'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              Learn how to use the ScanPro API in your applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our comprehensive API documentation provides all the information you need to integrate ScanPro's powerful PDF and image processing capabilities into your applications.
            </p>
             <LanguageLink href="/api-docs" className="inline-flex">
                              <Button size="lg" variant="outline"> View Documentation</Button>
                            </LanguageLink>
           
          </CardContent>
        </Card>
      </div>
    </div>
  );
}