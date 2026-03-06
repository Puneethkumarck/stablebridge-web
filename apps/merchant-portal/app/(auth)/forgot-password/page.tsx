'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok && res.status !== 202) {
        const result = await res.json();
        setError(result.error?.message ?? 'Something went wrong');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Unable to connect. Please try again.');
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            If an account exists with that email, we&apos;ve sent password reset instructions.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <a className="text-sm text-brand-600 hover:underline" href="/login">
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to reset your password
        </CardDescription>
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
              autoFocus
              id="email"
              placeholder="you@company.com"
              type="email"
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-3">
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner size="sm" /> : null}
            Send Reset Link
          </Button>
          <a className="text-sm text-brand-600 hover:underline" href="/login">
            Back to sign in
          </a>
        </CardFooter>
      </form>
    </Card>
  );
}
