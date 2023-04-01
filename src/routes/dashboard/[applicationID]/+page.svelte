<script lang="ts">
  import type { PageData } from './$types';
  import Header from '../components/Header.svelte';
  import Stats from '../components/Stats.svelte';
  import Answers from '../components/Answers.svelte';
  import RadioContainer from '../components/RadioContainer.svelte';
  import Radio from '../components/Radio.svelte';

  export let data: PageData;
</script>

<Header />
<div class="space-y-6 px-4 py-8 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-72">
  <Stats />
  <div class="overflow-hidden border-2 border-neutral-700 border-opacity-40 bg-[#050505] shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-neutral-200">Applicant Information</h3>
      <p class="mt-1 max-w-2xl text-sm text-neutral-400">Personal details and application.</p>
    </div>
    <div class="border-t border-neutral-800 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-neutral-800">
        <Answers title="Name" value={data.application.name} />
        <Answers title="Discord ID" value={data.application.discord.User.id} />
        <Answers title="How long have you been a Sirius member for?" value={data.application.responses.Usage} />
        <Answers title="How did you find out about Sirius?" value={data.application.responses.Discovery} />
        <Answers title="A user opens a ticket stating they have purchased Sirius Pro with stripe 30 minutes ago but our logs show nothing about it. What would you do?" value={data.application.responses.Questions[0]} />
        <Answers title="Which of the following statements is true?">
          <RadioContainer title="Which of the following statements is true?" name="question2">
            <Radio value="1" id="question2-1" name="question2" description="Support members must use grammar and proper behavior at all times" checked={data.application.responses.Questions[1] === '1'} />
            <Radio value="2" id="question2-2" name="question2" description="Support members only have to use grammar, punctuation and such in tickets, but it's recommended also doing it in public chats" checked={data.application.responses.Questions[1] === '2'} />
            <Radio value="3" id="question2-3" name="question2" description="Grammar is not important, only proper behavior is required." checked={data.application.responses.Questions[1] === '3'} rightAnswer={true} />
            <Radio value="4" id="question2-4" name="question2" description="Support members must be active on the support server" checked={data.application.responses.Questions[1] === '4'} />
          </RadioContainer>
        </Answers>
        <Answers title="A user sends NSFW content in #general, what do you do?">
          <RadioContainer title="A user sends NSFW content in #general, what do you do?" name="question3">
            <Radio value="1" id="question3-1" name="question3" description="Delete the message." checked={data.application.responses.Questions[2] === '1'} />
            <Radio value="2" id="question3-2" name="question3" description="Blacklist the user and ban him." checked={data.application.responses.Questions[2] === '2'} />
            <Radio value="3" id="question3-3" name="question3" description="Report the message so someone with proper permissions can ban the user." checked={data.application.responses.Questions[2] === '3'} />
            <Radio value="4" id="question3-4" name="question3" description="None of the statements is correct." checked={data.application.responses.Questions[2] === '4'} rightAnswer={true} />
          </RadioContainer>
        </Answers>
        <Answers title="You think you should be promoted but you're still a support member, what do you do?">
          <RadioContainer title="You think you should be promoted but you're still a support member, what do you do?" name="question4">
            <Radio value="1" id="question4-1" name="question4" description="DM someone in the management team to notify them." checked={data.application.responses.Questions[3] === '1'} />
            <Radio value="2" id="question4-2" name="question4" description="Do nothing." checked={data.application.responses.Questions[3] === '2'} rightAnswer={true} />
            <Radio value="3" id="question4-3" name="question4" description="Talk about it in staff-chat" checked={data.application.responses.Questions[3] === '3'} />
            <Radio value="4" id="question4-4" name="question4" description="None of the statements is correct." checked={data.application.responses.Questions[3] === '4'} />
          </RadioContainer>
        </Answers>
        <Answers title="You see another staff member breaking the rules, what's your response?">
          <RadioContainer title="You see another staff member breaking the rules, what's your response?" name="question5">
            <Radio value="1" id="question5-1" name="question5" description="Try to confront the staff member" checked={data.application.responses.Questions[4] === '1'} />
            <Radio value="2" id="question5-2" name="question5" description="Ban him to stop the issue (or anything to stop it)" checked={data.application.responses.Questions[4] === '2'} />
            <Radio value="3" id="question5-3" name="question5" description="Contact a higher up about this issue so they can resolve it" checked={data.application.responses.Questions[4] === '3'} rightAnswer={true} />
            <Radio value="4" id="question5-4" name="question5" description="Talk about it in staff-chat" checked={data.application.responses.Questions[4] === '4'} />
          </RadioContainer>
        </Answers>
        <Answers title="What would you do if a user comes with a problem which you don't know how to handle?" value={data.application.responses.Questions[5]} />
        <Answers title="What would you do if a user is becoming frustrated/acting like a karen/taking too long?" value={data.application.responses.Questions[6]} />
        <Answers title="What would you do if a user doesn't speak english?">
          <RadioContainer title="What would you do if a user doesn't speak english?" name="question8">
            <Radio value="1" id="question8-1" name="question8" description="Ignore them" checked={data.application.responses.Questions[7] === '1'} />
            <Radio value="2" id="question8-2" name="question8" description="Try to help them (ex with google translate)" checked={data.application.responses.Questions[7] === '2'} rightAnswer={true} />
            <Radio value="3" id="question8-3" name="question8" description="If you know a staff member that speaks that languages, asked them to help them" checked={data.application.responses.Questions[7] === '3'} rightAnswer={true} />
            <Radio value="4" id="question8-4" name="question8" description="Deny support" checked={data.application.responses.Questions[7] === '4'} />
          </RadioContainer>
        </Answers>
        <Answers title="Why should we choose you over other applicants?" value={data.application.responses.Questions[8]} />
        <Answers title="List 3 pros and 3 cons about you (as a support member)" value={data.application.responses.Questions[9]} />
        <Answers title="Tell us a bit about yourself, possibly outside of Social Media" value={data.application.responses.Questions[10]} />
      </dl>
    </div>
  </div>
</div>
