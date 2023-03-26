<script lang="ts">
  import { page } from '$app/stores';
</script>

<div>
  <h3 class="text-lg font-medium leading-6 text-neutral-200">Application Stats</h3>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1">
    {#await $page.data.streamed.userData}
      <div class="animate-pulse overflow-hidden rounded-lg border-2 border-neutral-700 border-opacity-40 bg-[#050505] px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-neutral-400">Profile</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-neutral-300">
          <span class="animate-pulse rounded bg-neutral-900 px-2 py-1 text-white transition-colors duration-500">Loading...</span>
        </dd>
      </div>
    {:then userData}
      <div class="obj w-full rounded-lg border-2 border-neutral-700 border-opacity-40 bg-[#050505] bg-cover bg-center bg-no-repeat px-4 py-5 shadow sm:p-6" style="background-image: url('https://cdn.discordapp.com/banners/{userData.id}/{userData.banner}'); background-color: {userData.banner_color ? '#' + userData.banner_color : '#050505'};">
        <dt class="truncate text-sm font-medium text-neutral-400">Profile</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-neutral-300">
          <img src="https://cdn.discordapp.com/avatars/{userData.id}/{userData.avatar}" class="inline-block h-8 w-8 rounded-full" alt="User Avatar" />
          <br />
          {userData.username + '#' + userData.discriminator}
          <!-- Joined at -->
          <br />
          <span class="text-sm text-neutral-400">Joined {new Date(userData.joined_at).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </dd>
      </div>
    {:catch error}
      {error.message}
    {/await}
  </dl>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div class="overflow-hidden rounded-lg border-2 border-neutral-700 border-opacity-40 bg-[#050505] px-4 py-5 shadow sm:p-6">
      <dt class="truncate text-sm font-medium text-neutral-400">Status</dt>
      <dd class="mt-1 text-3xl font-semibold lowercase tracking-tight text-neutral-300 first-letter:uppercase">{$page.data.application.status}</dd>
    </div>

    <div class="overflow-hidden rounded-lg border-2 border-neutral-700 border-opacity-40 bg-[#050505] px-4 py-5 shadow sm:p-6">
      <dt class="truncate text-sm font-medium text-neutral-400">Submitted</dt>
      <dd class="mt-1 text-3xl font-semibold tracking-tight text-neutral-300 first-letter:uppercase">{new Date($page.data.application.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</dd>
    </div>
  </dl>
</div>
