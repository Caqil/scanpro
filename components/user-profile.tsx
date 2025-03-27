// components/user-profile.tsx
"use client"

import Image from "next/image";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut, Edit2 } from "lucide-react";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {user.image ? (
          <Image 
            src={user.image} 
            alt={user.name || "User profile"} 
            width={64} 
            height={64} 
            className="rounded-full border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground">
              {user.name ? user.name[0].toUpperCase() : ''}
            </span>
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}