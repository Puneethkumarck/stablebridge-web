'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@stablebridge/auth';
import { Button } from '@stablebridge/ui/components/button';
import { Input } from '@stablebridge/ui/components/input';
import { Label } from '@stablebridge/ui/components/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@stablebridge/ui/components/card';
import { Alert, AlertDescription } from '@stablebridge/ui/components/alert';
import { Spinner } from '@stablebridge/ui/components/spinner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error?.message ?? result.message ?? 'Login failed');
        return;
      }

      setUser(result.data.user);
      router.push(callbackUrl);
    } catch {
      setError('Unable to connect. Please try again.');
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Admin Portal</CardTitle>
        <CardDescription>Sign in with your admin credentials</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              aria-invalid={errors.email ? 'true' : undefined}
              autoComplete="email"
              id="email"
              placeholder="admin@stablebridge.io"
              type="email"
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              aria-invalid={errors.password ? 'true' : undefined}
              autoComplete="current-password"
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner size="sm" /> : null}
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </CardContent>
        </Card>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
