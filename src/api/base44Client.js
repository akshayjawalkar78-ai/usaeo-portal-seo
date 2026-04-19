import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const BASE44_SERVER = import.meta.env.VITE_BASE44_APP_BASE_URL || 'https://base44.app';

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: BASE44_SERVER,
  requiresAuth: false,
  appBaseUrl
});
