'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface MfaSetupData {
  secret: string;
  qrCodeUri: string;
  backupCodes: string[];
}

export default function MfaSetupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [step, setStep] = useState<'init' | 'verify'>('init');
  const [setupData, setSetupData] = useState<MfaSetupData | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSetup() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        credentials: 'include',
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error?.message ?? 'Failed to initialize MFA setup');
        setIsLoading(false);
        return;
      }

      setSetupData(result.data);
      setStep('verify');
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include',
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error?.message ?? 'Invalid code');
        setIsLoading(false);
        return;
      }

      setUser(result.data.user);
      router.push('/');
    } catch {
      setError('Unable to verify. Please try again.');
      setIsLoading(false);
    }
  }

  if (step === 'init') {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Protect your account with an authenticator app like Google Authenticator or Authy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isLoading} onClick={handleSetup}>
            {isLoading ? <Spinner size="sm" /> : null}
            Begin Setup
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Scan QR Code</CardTitle>
        <CardDescription>
          Scan this code with your authenticator app, then enter the 6-digit code below
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleVerify}>
        <CardContent className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {setupData ? (
            <>
              <div className="flex justify-center rounded-lg bg-white p-4">
                {/* QR code image rendered by authenticator URI */}
                <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 text-xs text-zinc-400">
                  QR Code
                  <br />
                  (requires image renderer)
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-center text-xs text-zinc-500">
                  Can&apos;t scan? Enter this key manually:
                </p>
                <p className="text-center font-mono text-sm font-medium tracking-wider">
                  {setupData.secret}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  autoFocus
                  className="text-center font-mono text-lg tracking-widest"
                  id="code"
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  value={code}
                />
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="mb-2 text-xs font-medium text-amber-800">
                  Save these backup codes in a safe place:
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {setupData.backupCodes.map((backupCode) => (
                    <code className="text-xs text-amber-700" key={backupCode}>
                      {backupCode}
                    </code>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isLoading || code.length !== 6} type="submit">
            {isLoading ? <Spinner size="sm" /> : null}
            Verify & Activate
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
