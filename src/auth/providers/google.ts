// src/auth/providers/google.ts
export const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // ... otras configuraciones
  };
  
  // src/auth/components/AuthButton.tsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface AuthButtonProps {
    provider: 'google' | 'facebook' | 'github' | 'apple';
    variant?: 'primary' | 'secondary';
    onSuccess?: () => void;
  }
  
  // src/auth/hooks/useAuth.ts
  type User = {
    id: string;
    name: string;
    email: string;
    image?: string;
  };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface AuthState {
    user: User | null;
    isLoading: boolean;
    signIn: (provider: string) => Promise<void>;
    signOut: () => Promise<void>;
  }