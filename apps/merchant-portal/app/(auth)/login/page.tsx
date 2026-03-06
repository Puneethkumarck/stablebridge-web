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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const { setUser, setMfaRequired } = useAuth();
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

      if (result.data.mfaRequired) {
        setMfaRequired(result.data.mfaToken);
        router.push('/mfa/verify');
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
        <CardTitle className="text-2xl">Sign in to StableBridge</CardTitle>
        <CardDescription>Enter your credentials to access the merchant portal</CardDescription>
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
              placeholder="you@company.com"
              type="email"
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a className="text-xs text-brand-600 hover:underline" href="/forgot-password">
                Forgot password?
              </a>
            </div>
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

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
