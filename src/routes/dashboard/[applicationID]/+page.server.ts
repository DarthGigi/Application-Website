import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

import Discord from 'discord.js';
import { GatewayIntentBits } from 'discord.js';

interface DiscordUser {
  id: string
  username: string
  global_name?: string
  display_name?: string
  avatar?: string
  avatar_decoration?: string,
  discriminator: string,
  public_flags: number,
  banner?: string
  banner_color?: string,
  accent_color?: number
  avatarUrl?: string,
}

const baseurl = 'https://discord.com/api/v10/';
// Function to easily make requests to the Discord API
// I put question marks to make them optional so we don't have to put null
function discordAPI(url: string, method: string, body?: any, headers?: {}) {
  // Reference the above fetch example
  const options = {
    method: method,
    headers: {
      Authorization: 'Bot ' + process.env.BOT_TOKEN,
      ...headers
    }
  };
  if (body) {
    // @ts-expect-error
    options['body'] = body;
  }
  return fetch(baseurl + url, options);
}

const client = new Discord.Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

const guildId = '939553319750344744';

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, '/login');
  }

  const application = await prisma.application.findUnique({
        where: {
          id: params.applicationID
        },
        include: {
          reviewers: {
            select: {
              name: true
            }
          }
        }
      });

  if(!application || application.data) 
    throw redirect(302, "/dashboard");
  

  // common fetch L 
  const userData: DiscordUser = await (await discordAPI(`users/${application?.discordID!}`, 'GET')).json();

  // make it load default if no avatar
  if(userData.avatar) {
    userData.avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`;
  } else {
    userData.avatarUrl = `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator) % 5}.png`;
  }

  const applications = prisma.application.findMany({
    select: {
      id: true,
      name: true,
      status: true
    },
    orderBy: {
      status: 'desc'
    }
  });

  return {
    application,
    streamed: {
      applications,
      userData
    }
  };
};

export const actions: Actions = {
  acceptApplication: async ({ params, locals }) => {
    const user = await locals.validate();
    try {
      const applicationAccepted = await prisma.application.update({
        where: {
          id: params.applicationID
        },
        data: {
          status: 'APPROVED',
          reviewers: {
            connect: {
              id: user?.userId
            }
          }
        }
      });

      const application = await prisma.application.findUnique({
        where: {
          id: params.applicationID
        }
      });

      // Add roles
      // Send messages
      client.on('ready', async () => {
        const guild = await client.guilds.fetch(guildId);
        // @ts-expect-error
        const user = await guild.members.fetch(application?.discordID);
        const channel = await client.channels.fetch('1034058501565194310');
        user.roles.add(['939871641209540658', '1089307016108970035'], 'Application accepted');

        user.send({
          embeds: [
            {
              title: '<:Sirius:1056924373648429096>  Application Accepted',
              description: 'Your application has been accepted! Welcome to the team!',
              color: 0x2b2d31
            }
          ]
        });
        //@ts-expect-error
        channel.send({
          embeds: [
            {
              fields: [],
              title: `Welcome ${application?.name}!`,
              description: `Welcome to the team <@${application?.discordID}>! We are glad that you joined us!\n\nPlease take a look at the support documentation in order to understand what your job is.`,
              color: 2829617
            }
          ],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  label: 'Support Documentation',
                  style: 5,
                  url: 'https://docs.google.com/document/d/1SLvDAPQrkBBhN6vIK8XSKNW-N7PBKJeL5XWE07iQtsI/edit#'
                }
              ]
            }
          ],
          content: `<@${application?.discordID}>`
        });
      });

      client.login(process.env.BOT_TOKEN);
    } catch (error) {
      console.log(error);
      throw error;
    }
    throw redirect(302, '/dashboard/' + params.applicationID);
  },
  rejectApplication: async ({ params, locals }) => {
    const user = await locals.validate();
    try {
      const applicationDenied = await prisma.application.update({
        where: {
          id: params.applicationID
        },
        data: {
          status: 'DENIED',
          reviewers: {
            connect: {
              id: user?.userId
            }
          }
        }
      });

      const application = await prisma.application.findUnique({
        where: {
          id: params.applicationID
        }
      });

      // Send messages
      client.on('ready', async () => {
        // force it to take the id (little hack!)
        const user = await client.users.fetch(application?.discordID!);
        const channel = await client.channels.fetch('1034058501565194310');
        try {
          user.send({
            embeds: [
              {
                title: '<:Sirius:1056924373648429096> Application Denied',
                description: `Your application has been denied. Due to our privacy policy, we may not disclose the reason for the denial. You may reapply <t:${Math.floor(Date.now() / 1000) + 1209600}:R>`,
                color: 0x2b2d31
              }
            ]
          });
          //@ts-expect-error
          channel.send({
            embeds: [
              {
                title: `Application Denied`,
                description: `HAHAHAHAHAHAH <@${application?.discordID}> AKA ${application?.name} has been denied! WHAT A LOSER LMAOOOOO <a:pepeLaugh:939964833879711775>`,
                color: 0x2b2d31
              }
            ],
            content: `<@${application?.discordID}>`
          });
        } catch (error) {
          console.log(error);
        }
      });
      client.login(process.env.BOT_TOKEN);
    } catch (error) {
      console.log(error);
      throw error;
    }
    throw redirect(302, '/dashboard/' + params.applicationID);
  },
  deleteApplication: async ({ params }) => {
    try {
      const applicationDeleted = await prisma.application.delete({
        where: {
          id: params.applicationID
        }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
    throw redirect(302, '/dashboard');
  }
};
