import type { DiscordAccessTokenResponse } from '$lib/types/discord';
import type { APIUser, APIGuildMember } from 'discord-api-types/v10';
import { PUBLIC_SIRIUS_GUILD_ID, PUBLIC_SIRIUS_REVIEWER_ID } from '$env/static/public';
import type { User } from '$lib/server/types/database';

export const DiscordAPIBase = 'https://discord.com/api/';
export const DiscordImageBase = 'https://cdn.discordapp.com/';

interface TokenInfo {
  type: string;
  token: string;
}

async function getData<T>(endpoint: string, tokenInfo: TokenInfo): Promise<Awaited<T>> {
  return await (
    await fetch(DiscordAPIBase + endpoint, {
      headers: {
        authorization: `${tokenInfo.type} ${tokenInfo.token}`
      }
    })
  ).json();
}

function getEnding(input: string): 'png' | 'gif' {
  return input.startsWith('a_') ? 'gif' : 'png';
}

export const GenerateUserFromAccessToken = async (resp: DiscordAccessTokenResponse): Promise<User> => {
  const tokenInfo: TokenInfo = { token: resp.access_token, type: resp.token_type };
  const apiUser: APIUser = await getData('users/@me', tokenInfo);
  const gm: APIGuildMember = await getData(`/users/@me/guilds/${PUBLIC_SIRIUS_GUILD_ID}/member`, tokenInfo);

  const user: User = {
    _id: '',
    discord: {
      Guild: {
        joined_at: gm.joined_at,
        nickname: gm.nick,
        roles: gm.roles
      },
      User: {
        id: apiUser.id,
        discriminator: apiUser.discriminator,
        username: apiUser.username,
        banner: apiUser.banner ? `${DiscordImageBase}banners/${apiUser.id}/${apiUser.banner}.${getEnding(apiUser.banner)}` : null,
        accent_color: apiUser.accent_color,
        avatar: apiUser.avatar ? `${DiscordImageBase}avatars/${apiUser.id}/${apiUser.avatar}.${getEnding(apiUser.avatar)}` : `${DiscordImageBase}embed/avatars/${parseInt(apiUser.discriminator) % 5}.png`
      }
    },
    reviewer: false
  };

  if (gm.roles.includes(PUBLIC_SIRIUS_REVIEWER_ID)) {
    user.reviewer = true;
  }

  return user;
};
