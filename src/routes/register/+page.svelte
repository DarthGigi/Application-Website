<script lang="ts">
  import type { PageData } from './$types';
  import FormQuestionContainer from '../../components/FormComponents/FormQuestionContainer.svelte';
  import Input from '../../components/FormComponents/Input.svelte';
  import SubmitButton from '../../components/FormComponents/SubmitButton.svelte';
  import { enhance } from '$app/forms';
</script>

<form method="post" id="form">
  <div class="space-y-6 px-4 py-8 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-72">
    <FormQuestionContainer title="Staff Login" description="Only staff members may login">
      <Input label="Username" placeholder="Craig" name="username" size="short" type="text" />
      <Input label="Password" placeholder="····" name="password" size="short" type="password" />
      <Input label="Secret" placeholder="············" name="secret" size="medium" type="password" />
    </FormQuestionContainer>

    <div class="flex justify-end">
      <SubmitButton text="Register" disabled={false} />
    </div>
  </div>
</form>
