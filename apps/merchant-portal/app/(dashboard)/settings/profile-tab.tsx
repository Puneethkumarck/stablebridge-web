'use client';

import { useAuth } from '@stablebridge/auth';
import { useMerchant } from '@stablebridge/api-client/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@stablebridge/ui/components/card';
import { Badge } from '@stablebridge/ui/components/badge';
import { Spinner } from '@stablebridge/ui/components/spinner';

export function ProfileTab() {
  const { user } = useAuth();
  const { data: merchant, isLoading } = useMerchant(user?.merchantId ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-zinc-500">Email</dt>
              <dd className="mt-1 text-sm text-zinc-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-zinc-500">Role</dt>
              <dd className="mt-1">
                <Badge variant="brand">{user?.role}</Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {merchant ? (
        <Card>
          <CardHeader>
            <CardTitle>Merchant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-zinc-500">Legal Name</dt>
                <dd className="mt-1 text-sm text-zinc-900">{merchant.legalName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Trading Name</dt>
                <dd className="mt-1 text-sm text-zinc-900">{merchant.tradingName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Registration Number</dt>
                <dd className="mt-1 text-sm text-zinc-900">{merchant.registrationNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Country</dt>
                <dd className="mt-1 text-sm text-zinc-900">{merchant.registrationCountry}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Status</dt>
                <dd className="mt-1">
                  <Badge
                    variant={merchant.status === 'ACTIVE' ? 'success' : 'default'}
                  >
                    {merchant.status}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Primary Contact</dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {merchant.primaryContactName} ({merchant.primaryContactEmail})
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
