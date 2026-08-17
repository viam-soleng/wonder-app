<script lang="ts">
  import { ViamProvider } from '@viamrobotics/svelte-sdk';
  import type { DialConf } from '@viamrobotics/sdk';
  import { getMachineConnection, toDialConf } from './lib/machine-connection';
  import MachineDashboard from './lib/machine-dashboard.svelte';

  const { connection, errors } = getMachineConnection();

  // ViamProvider keys dial configs by part ID; for a single-machine app we
  // use the machine ID as the key and pass it to hooks downstream.
  const dialConfigs: Record<string, DialConf> = connection
    ? { [connection.machineId]: toDialConf(connection) }
    : {};
</script>

{#if connection}
  <ViamProvider {dialConfigs}>
    <MachineDashboard partId={connection.machineId} hostname={connection.hostname} />
  </ViamProvider>
{:else}
  <main class="mx-auto max-w-xl p-8">
    <h1 class="mb-4 text-xl font-semibold">Wonder — unable to connect</h1>
    <ul class="list-disc space-y-1 pl-5 text-sm text-red-700">
      {#each errors as error}
        <li>{error}</li>
      {/each}
    </ul>
    <p class="mt-4 text-sm text-gray-500">
      For local development run <code>pnpm dev:viam</code> with
      <code>VIAM_MACHINE_ID</code> set, then open
      <a class="underline" href="http://localhost:8012/start">localhost:8012/start</a>.
    </p>
  </main>
{/if}
