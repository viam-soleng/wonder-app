import Cookies from 'js-cookie';
import type { DialConf } from '@viamrobotics/sdk';

export interface MachineConnection {
  machineId: string;
  hostname: string;
  apiKeyId: string;
  apiKeySecret: string;
}

export interface MachineConnectionResult {
  connection: MachineConnection | null;
  errors: string[];
}

interface MachineCookie {
  apiKey?: { id?: string; key?: string };
  hostname?: string;
  machineId?: string;
}

function parseCookie(name: string): MachineCookie | null {
  const raw = Cookies.get(name);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MachineCookie;
  } catch {
    return null;
  }
}

/**
 * Viam serves single-machine apps at /machine/{machineId}/... and sets a
 * cookie named after the machine ID containing the API key and hostname.
 * `viam module local-app-testing` emulates the same flow on localhost.
 */
export function getMachineConnection(): MachineConnectionResult {
  const errors: string[] = [];

  const pathMachineId = window.location.pathname.split('/')[2];
  let machineId = pathMachineId;
  let cookie = machineId ? parseCookie(machineId) : null;

  // Fallback for plain `vite dev` (no /machine/ prefix): find any cookie
  // whose value has the machine-cookie shape.
  if (!cookie) {
    for (const [name, _] of Object.entries(Cookies.get())) {
      const candidate = parseCookie(name);
      if (candidate?.apiKey?.id && candidate?.hostname) {
        machineId = candidate.machineId ?? name;
        cookie = candidate;
        break;
      }
    }
  }

  if (!cookie) {
    if (!pathMachineId) {
      errors.push(
        'No machine ID in URL. Expected /machine/{machineId}/... — open this app via its viamapplications.com URL or `viam module local-app-testing`.'
      );
    } else {
      errors.push(`No credential cookie found for machine ${pathMachineId}.`);
    }
    return { connection: null, errors };
  }

  const apiKeyId = cookie.apiKey?.id;
  const apiKeySecret = cookie.apiKey?.key;
  const hostname = cookie.hostname;

  if (!apiKeyId) errors.push('Missing API key ID in cookie data');
  if (!apiKeySecret) errors.push('Missing API key secret in cookie data');
  if (!hostname) errors.push('Missing hostname in cookie data');

  if (errors.length > 0) return { connection: null, errors };

  return {
    connection: {
      machineId: cookie.machineId ?? machineId!,
      hostname: hostname!,
      apiKeyId: apiKeyId!,
      apiKeySecret: apiKeySecret!,
    },
    errors,
  };
}

export function toDialConf(connection: MachineConnection): DialConf {
  return {
    host: connection.hostname,
    credentials: {
      type: 'api-key',
      authEntity: connection.apiKeyId,
      payload: connection.apiKeySecret,
    },
    signalingAddress: 'https://app.viam.com:443',
  };
}
