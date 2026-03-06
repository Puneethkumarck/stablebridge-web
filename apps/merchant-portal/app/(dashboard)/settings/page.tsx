'use client';

import { PageHeader } from '@stablebridge/ui/layouts/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@stablebridge/ui/components/tabs';
import { ProfileTab } from './profile-tab';
import { ApiKeysTab } from './api-keys-tab';
import { OAuthClientsTab } from './oauth-clients-tab';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        description="Manage your account settings, API keys, and OAuth clients"
        title="Settings"
      />

      <div className="mt-6">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="oauth-clients">OAuth Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="api-keys">
            <ApiKeysTab />
          </TabsContent>

          <TabsContent value="oauth-clients">
            <OAuthClientsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
