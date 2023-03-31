<script lang="ts">
  import { ApplicationStatus } from '$lib/types/application';
  import Header from './components/Header.svelte';
  export let data;
  //@ts-nocheck
</script>

<Header />
<div class="mx-auto max-w-[90rem] space-y-6 px-4 py-8 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-72">
  <div class=" overflow-hidden border-2 border-neutral-700 border-opacity-40 bg-[#050505] shadow sm:rounded-md">
    {#await data.streamed?.applications}
      <p>Loading...</p>
    {:then d}
      {#each d as application}
        <ul class="divide-y divide-neutral-800">
          <li>
            <a href="/dashboard/{application._id}" class="block hover:bg-neutral-800">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <p class="truncate text-sm font-medium text-neutral-200">{application.name}</p>
                  <div class="ml-2 flex flex-shrink-0">
                    {#if application.status == ApplicationStatus.ACCEPTED}
                      <p class="inline-flex rounded-full bg-green-300 px-2 text-xs font-semibold leading-5 text-green-900">Accepted</p>
                    {:else if application.status == ApplicationStatus.DENIED}
                      <p class="inline-flex rounded-full bg-red-300 px-2 text-xs font-semibold leading-5 text-red-900">Denied</p>
                    {:else}
                      <p class="inline-flex rounded-full bg-yellow-300 px-2 text-xs font-semibold leading-5 text-yellow-900">Pending</p>
                    {/if}
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-neutral-400">
                      {application.email}
                    </p>
                    <p class="mt-2 flex items-center text-sm text-neutral-400 sm:ml-6 sm:mt-0">
                      {application.discordID}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-neutral-400 sm:mt-0">
                    <!-- Heroicon name: mini/calendar -->
                    <svg class="mr-1.5 h-5 w-5 flex-shrink-0 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
                    </svg>
                    <p>
                      Submitted on
                      <time datetime={application.createdAt.toISOString()}>{application.createdAt.toDateString()}</time>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      {/each}
    {/await}
  </div>
</div>
