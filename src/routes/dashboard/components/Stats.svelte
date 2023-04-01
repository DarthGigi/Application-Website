<script lang="ts">
  import { page } from '$app/stores';

  console.log($page.data);
</script>

<div>
  <h3 class="text-lg font-medium leading-6 text-neutral-200">Application Stats</h3>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1">
    <div class="obj w-full rounded-lg border-2 border-neutral-700 border-opacity-40 bg-[#050505] bg-cover bg-center bg-no-repeat px-4 py-5 shadow sm:p-6" style="background-image: url('{$page.data.application.discord.User.banner}'); background-color: {$page.data.application.discord.User.accent_color ? '#' + $page.data.application.discord.User.accent_color : '#050505'};">
      <dt class="truncate text-sm font-medium text-neutral-400">Profile</dt>
      <dd class="mt-1 text-3xl font-semibold tracking-tight text-neutral-300">
        <img src={$page.data.application.discord.User.avatar} class="inline-block h-8 w-8 rounded-full" alt="User Avatar" />
        <br />
        {$page.data.application.discord.User.username + '#' + $page.data.application.discord.User.discriminator}
        <!-- Joined at -->
        <br />
        <span class="text-sm text-neutral-400">Joined {new Date($page.data.application.discord.Guild.joined_at).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </dd>
    </div>
  </dl>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div class="overflow-hidden rounded-lg border-2 border-neutral-700 border-opacity-40 bg-[#050505] px-4 py-5 shadow sm:p-6">
      <dt class="truncate text-sm font-medium text-neutral-400">Status</dt>
      <dd class="mt-1 text-3xl font-semibold lowercase tracking-tight text-neutral-300 first-letter:uppercase">{$page.data.parsedStatus}</dd>
    </div>

    <div class="overflow-hidden rounded-lg border-2 border-neutral-700 border-opacity-40 bg-[#050505] px-4 py-5 shadow sm:p-6">
      <dt class="truncate text-sm font-medium text-neutral-400">Submitted</dt>
      <dd class="mt-1 text-3xl font-semibold tracking-tight text-neutral-300 first-letter:uppercase">{new Date($page.data.application.createdAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</dd>
    </div>
  </dl>
</div>
