<script lang="ts">
  // Imports
  import { superForm } from 'sveltekit-superforms/client';
  import { Turnstile } from 'svelte-turnstile';
  // local imports
  import type { PageData } from './$types';
  import FormQuestionContainer from '../components/FormComponents/FormQuestionContainer.svelte';
  import Input from '../components/FormComponents/Input.svelte';
  import TextArea from '../components/FormComponents/TextArea.svelte';
  import RadioContainer from '../components/FormComponents/RadioContainer.svelte';
  import Radio from '../components/FormComponents/Radio.svelte';
  import CheckboxContainer from '../components/FormComponents/CheckboxContainer.svelte';
  import Checkbox from '../components/FormComponents/Checkbox.svelte';
  import SubmitButton from '../components/FormComponents/SubmitButton.svelte';
  import Navbar from '../components/Navbar.svelte';

  let submitButtonDisabled: boolean = false;
  let submitButtonText: string = 'Submit';

  // Exports
  export let data: PageData;

  export const { form, enhance, constraints, errors } = superForm(data.props.form, {
    taintedMessage: 'Are you sure you want to leave?',
    multipleSubmits: 'prevent',
    validators: {
      name: (value) => (value.length >= 2 ? 'Name must be at least 2 characters long' : null),
      email: (value) => (value.length >= 5 ? 'Email must be at least 5 characters long' : null),
      discordID: (value) => (value.length >= 17 ? 'Discord ID must be at least 17 characters long' : null),
      siriusUsage: (value) => (value.length >= 1 ? 'Sirius Usage must be at least 1 characters long' : null),
      siriusDiscovery: (value) => (value.length >= 1 ? 'Sirius Discovery must be at least 1 characters long' : null),
      question1: (value) => (value.length >= 1 ? 'Question 1 must be at least 1 characters long' : null),
      question2: (value) => (value.length >= 1 ? 'Question 2 must be at least 1 characters long' : null),
      question3: (value) => (value.length >= 1 ? 'Question 3 must be at least 1 characters long' : null),
      question4: (value) => (value.length >= 1 ? 'Question 4 must be at least 1 characters long' : null),
      question5: (value) => (value.length >= 1 ? 'Question 5 must be at least 1 characters long' : null),
      question6: (value) => (value.length >= 1 ? 'Question 6 must be at least 1 characters long' : null),
      question7: (value) => (value.length >= 1 ? 'Question 7 must be at least 1 characters long' : null),
      question8: (value) => (value.length >= 1 ? 'Question 8 must be at least 1 characters long' : null),
      question9: (value) => (value.length >= 1 ? 'Question 9 must be at least 1 characters long' : null),
      question10: (value) => (value.length >= 1 ? 'Question 10 must be at least 1 characters long' : null),
      question11: (value) => (value.length >= 1 ? 'Question 11 must be at least 1 characters long' : null),
      contactStaff: (value) => (value.length >= 1 ? 'Contact Staff must be at least 1 characters long' : null),
      contactInfo: (value) => (value.length >= 1 ? 'Contact Info must be at least 1 characters long' : null),
      data: (value) => (value.length >= 1 ? 'Data must be at least 1 characters long' : null)
    },
    onSubmit: () => {
      submitButtonDisabled = true;
      submitButtonText = 'Submitting...';
    },
    onResult: ({ result, formEl, cancel }) => {
      if (result.type === 'success') {
        submitButtonText = 'Submitted!';
        submitButtonDisabled = true;
        setTimeout(() => {
          submitButtonText = 'Submit';
          submitButtonDisabled = false;
        }, 2000);
        formEl.reset();
      } else {
        // @ts-ignore
        submitButtonText = result.data.message;
        submitButtonDisabled = true;
        setTimeout(() => {
          submitButtonText = 'Submit';
          submitButtonDisabled = false;
        }, 2000);
        cancel();
      }
    },
    onError: ({ result, message }) => {
      console.log('onError', result, message);
      submitButtonText = 'Error! Please try again.';
      submitButtonDisabled = true;
      setTimeout(() => {
        submitButtonText = 'Submit';
        submitButtonDisabled = false;
      }, 2000);
    }
  });
</script>

<Navbar />

<form method="post" id="form" use:enhance>
  <div id="#FormQuestions" class="flex flex-col flex-wrap space-y-6 px-4 py-8 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-72">
    <FormQuestionContainer title="Personal Information" description="A few questions about you">
      <Input label="Name" placeholder="Craig" name="name" size="short" type="text" contraints={$constraints.name} />
      <Input label="Email" placeholder="craig@sirius.menu" name="email" size="short" type="email" contraints={$constraints.email} />
      <Input label="Discord ID" placeholder="123456789987654321" name="discordID" type="text" contraints={$constraints.discordID} />
      <Input label="How long have you been a Sirius member for?" placeholder="3 Days" name="siriusUsage" type="text" contraints={$constraints.siriusUsage} />
      <Input label="How did you find out about Sirius?" placeholder="A friend" name="siriusDiscovery" type="text" contraints={$constraints.siriusDiscovery} />
    </FormQuestionContainer>
    <FormQuestionContainer title="General Questions" description="Questions about stuff you will encounter while being a support member">
      <TextArea label="A user opens a ticket stating they have purchased Sirius Pro with stripe 30 minutes ago but our logs show nothing about it. What would you do?" name="question1" constraints={$constraints.question1} />

      <RadioContainer title="Which of the following statements is true?" name="question2">
        <Radio description="Support members must use grammar and proper behavior at all times" value="1" name="question2" id="question2-1" />
        <Radio description="Support members only have to use grammar, punctuation and such in tickets, but it's recommended also doing it in public chats" value="2" name="question2" id="question2-2" />
        <Radio description="Grammar is not important, only proper behavior is required." value="3" name="question2" id="question2-3" />
        <Radio description="None of the statements is correct." value="4" name="question2" id="question2-4" />
      </RadioContainer>

      <RadioContainer title="A user sends NSFW content in #general, what do you do?" name="question3">
        <Radio description="Delete the message." value="1" name="question3" id="question3-1" />
        <Radio description="Blacklist the user and ban him." value="2" name="question3" id="question3-2" />
        <Radio description="Report the message so someone with proper permissions can ban the user." value="3" name="question3" id="question3-3" />
        <Radio description="None of the statements is correct." value="4" name="question3" id="question3-4" />
      </RadioContainer>

      <RadioContainer title="You think you should be promoted but you're still a support member, what do you do?" name="question4">
        <Radio description="DM someone in the management team to notify them." value="1" name="question4" id="question4-1" />
        <Radio description="Do nothing." value="2" name="question4" id="question4-2" />
        <Radio description="Talk about it in staff-chat" value="3" name="question4" id="question4-3" />
        <Radio description="None of the statements is correct." value="4" name="question4" id="question4-4" />
      </RadioContainer>

      <RadioContainer title="You see another staff member breaking the rules, what's your response?" name="question5">
        <Radio description="Try to confront the staff member" value="1" name="question5" id="question5-1" />
        <Radio description="Ban him to stop the issue (or anything to stop it)" value="2" name="question5" id="question5-2" />
        <Radio description="Contact a higher up about this issue so they can resolve it" value="3" name="question5" id="question5-3" />
        <Radio description="Talk about it in staff-chat" value="4" name="question5" id="question5-4" />
      </RadioContainer>

      <TextArea label="What would you do if a user comes with a problem which you don't know how to handle?" name="question6" constraints={$constraints.question6} />

      <TextArea label="What would you do if a user is becoming frustrated/acting like a karen/taking too long?" name="question7" constraints={$constraints.question7} />

      <RadioContainer title="What would you do if a user doesn't speak english?" name="question8">
        <Radio description="Ignore them" value="1" name="question8" id="question8-1" />
        <Radio description="Try to help them (ex with google translate)" value="2" name="question8" id="question8-2" />
        <Radio description="If you know a staff member that speaks that languages, asked them to help them" value="3" name="question8" id="question8-3" />
        <Radio description="Deny support" value="4" name="question8" id="question8-4" />
      </RadioContainer>
    </FormQuestionContainer>
    <FormQuestionContainer title="Personal Questions" description="A few personal questions">
      <TextArea label="Why should we choose you over other applicants?" name="question9" constraints={$constraints.question9} />
      <TextArea label="List 3 pros and 3 cons about you (as a support member)" name="question10" constraints={$constraints.question10} />
      <TextArea label="Tell us a bit about yourself, possibly outside of Social Media" name="question11" constraints={$constraints.question11} />
    </FormQuestionContainer>

    <CheckboxContainer>
      <Checkbox title="Contacting" description="I agree that I will not contact any staff member about when the application will be reviewed or the reason for its denial." name="contactStaff" />
      <Checkbox title="Information" description="I agree that all the information I get about the final outcome will be stated in the email I receive, and I won't contact anyone about or talk about it on the server to get further information." name="contactInfo" />
      <Checkbox title="Data" description="I acknowledge that after submitting this form, my IP address and all the information I provided above will be stored in a database. (We will not share this information with anyone. Not even staff members.)" name="data" />
    </CheckboxContainer>

    <div class="flex justify-end">
      <SubmitButton text={submitButtonText} disabled={submitButtonDisabled} />
    </div>
    <div class="flex justify-end">
      <Turnstile siteKey="0x4AAAAAAADhlmHfgKPFW6Ec" theme="dark" />
    </div>
  </div>
</form>
