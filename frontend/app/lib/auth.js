'use client'; // 👈 Add this at the very first line

import { useRouter } from 'next/navigation'; // (Notice: 'next/navigation' not 'next/router')
import { useEffect } from 'react';

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        router.push('/login');
      }
    };

    validateToken();
  }, [router]);
}
