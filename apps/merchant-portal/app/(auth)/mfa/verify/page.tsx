'use client';

import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@stablebridge/auth';
import { Button } from '@stablebridge/ui/components/button';
import { Input } from '@stablebridge/ui/components/input';
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

const CODE_LENGTH = 6;

export default function MfaVerifyPage() {
  const router = useRouter();
  const { mfaToken, setUser } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleDigitChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i] ?? '';
    }
    setDigits(newDigits);
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== CODE_LENGTH) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, mfaToken }),
        credentials: 'include',
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error?.message ?? 'Invalid verification code');
        setDigits(Array(CODE_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        setIsSubmitting(false);
        return;
      }

      setUser(result.data.user);
      router.push('/');
    } catch {
      setError('Unable to verify. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <Input
                ref={(el) => { inputRefs.current[i] = el; }}
                aria-label={`Digit ${i + 1}`}
                autoFocus={i === 0}
                className="h-12 w-12 text-center text-lg font-mono"
                inputMode="numeric"
                key={i}
                maxLength={1}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                value={digit}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-3">
          <Button
            className="w-full"
            disabled={isSubmitting || digits.join('').length !== CODE_LENGTH}
            type="submit"
          >
            {isSubmitting ? <Spinner size="sm" /> : null}
            Verify
          </Button>
          <p className="text-center text-xs text-zinc-500">
            Lost your device?{' '}
            <a className="text-brand-600 hover:underline" href="/mfa/setup">
              Use a backup code
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
