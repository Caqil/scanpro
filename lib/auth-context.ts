// lib/auth-context.ts
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// Define types for the authentication context
type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    authToken: string | null; // For session-based authentication
    userId: string | null;
    isWebUI: boolean; // Flag to identify web UI usage
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    authToken: null,
    userId: null,
    isWebUI: true, // Default to true for web UI
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    // Use NextAuth session
    const { data: session, status } = useSession();
    const [authToken, setAuthToken] = useState<string | null>(null);

    // Set up the auth state based on the session
    useEffect(() => {
        if (session?.user) {
            // In a real implementation, you might want to fetch and store a JWT token here
            // For simplicity, we're just using the session as-is
            setAuthToken('session-token'); // Placeholder
        } else {
            setAuthToken(null);
        }
    }, [session]);

    // Values to be provided by the context
    const value = {
        isAuthenticated: !!session?.user,
        isLoading: status === 'loading',
        authToken,
        userId: session?.user?.id || null,
        isWebUI: true, // Always true for the web UI
    };

    return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}