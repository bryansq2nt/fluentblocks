'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function UserSyncer() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      });
    }
  }, [session]);

  return null;
} 