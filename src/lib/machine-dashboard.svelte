<script lang="ts">
  import { useRobotClient, createRobotQuery, useConnectionStatus } from '@viamrobotics/svelte-sdk';

  const { partId, hostname }: { partId: string; hostname: string } = $props();

  const robotClient = useRobotClient(() => partId);
  const connectionStatus = useConnectionStatus(() => partId);

  const resourcesQuery = createRobotQuery(robotClient, 'resourceNames', [], {
    refetchInterval: 10_000,
  });

  const components = $derived(
    (resourcesQuery.data ?? []).filter((r) => r.type === 'component')
  );
  const services = $derived((resourcesQuery.data ?? []).filter((r) => r.type === 'service'));
</script>

<main class="mx-auto max-w-3xl p-8">
  <header class="mb-6 flex items-baseline justify-between">
    <h1 class="text-2xl font-semibold">Wonder</h1>
    <div class="text-sm text-gray-500">
      {hostname} —
      <span class="font-medium">{connectionStatus.current}</span>
    </div>
  </header>

  {#if resourcesQuery.error}
    <p class="text-sm text-red-700">Failed to list resources: {resourcesQuery.error.message}</p>
  {:else if !resourcesQuery.data}
    <p class="text-sm text-gray-500">Connecting to machine…</p>
  {:else}
    <section class="mb-6">
      <h2 class="mb-2 text-lg font-medium">Components ({components.length})</h2>
      <ul class="space-y-1 text-sm">
        {#each components as resource}
          <li class="rounded border border-gray-200 px-3 py-2">
            <span class="font-mono">{resource.name}</span>
            <span class="ml-2 text-gray-500">{resource.subtype}</span>
          </li>
        {/each}
      </ul>
    </section>

    <section>
      <h2 class="mb-2 text-lg font-medium">Services ({services.length})</h2>
      <ul class="space-y-1 text-sm">
        {#each services as resource}
          <li class="rounded border border-gray-200 px-3 py-2">
            <span class="font-mono">{resource.name}</span>
            <span class="ml-2 text-gray-500">{resource.subtype}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</main>
