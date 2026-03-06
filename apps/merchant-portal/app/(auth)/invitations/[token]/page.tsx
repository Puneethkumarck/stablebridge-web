'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

const schema = z
  .object({
    password: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, { message: 'You must accept the terms' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

interface Invitation {
  email: string;
  merchantName: string;
  role: string;
  expiresAt: string;
}

export default function InvitationPage({
  params,
}: {
  readonly params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function fetchInvitation() {
      try {
        const res = await fetch(`/api/invitations/${token}`);
        const result = await res.json();

        if (!res.ok) {
          setLoadError(result.error?.message ?? 'Invalid or expired invitation');
          setIsLoading(false);
          return;
        }

        setInvitation(result.data);
      } catch {
        setLoadError('Unable to load invitation details');
      } finally {
        setIsLoading(false);
      }
    }
    fetchInvitation();
  }, [token]);

  async function onSubmit(data: FormData) {
    setSubmitError(null);

    try {
      const res = await fetch(`/api/invitations/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: data.password,
          termsAccepted: data.termsAccepted,
        }),
        credentials: 'include',
      });

      const result = await res.json();

      if (!res.ok) {
        setSubmitError(result.error?.message ?? 'Failed to accept invitation');
        return;
      }

      router.push('/');
    } catch {
      setSubmitError('Unable to connect. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Invalid Invitation</CardTitle>
          <CardDescription>{loadError}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <a className="text-sm text-brand-600 hover:underline" href="/login">
            Go to sign in
          </a>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Join {invitation?.merchantName}</CardTitle>
        <CardDescription>
          You&apos;ve been invited as <span className="font-medium">{invitation?.role}</span>.
          Set your password to get started.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {submitError ? (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input disabled id="email" value={invitation?.email ?? ''} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              aria-invalid={errors.password ? 'true' : undefined}
              autoComplete="new-password"
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              aria-invalid={errors.confirmPassword ? 'true' : undefined}
              autoComplete="new-password"
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <div className="flex items-start gap-2">
            <input
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
              id="terms"
              type="checkbox"
              {...register('termsAccepted')}
            />
            <Label className="text-sm font-normal text-zinc-600" htmlFor="terms">
              I accept the{' '}
              <a className="text-brand-600 hover:underline" href="/terms" target="_blank">
                Terms of Service
              </a>{' '}
              and{' '}
              <a className="text-brand-600 hover:underline" href="/privacy" target="_blank">
                Privacy Policy
              </a>
            </Label>
          </div>
          {errors.termsAccepted ? (
            <p className="text-xs text-red-600">{errors.termsAccepted.message}</p>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner size="sm" /> : null}
            Accept & Create Account
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
