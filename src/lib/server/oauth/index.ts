// Hello everyone, we're gonna be making the discord Oauth as fast as we can! It's currently 6:25 and I am starting on it :trol:

import { dev } from "$app/environment";
import { PUBLIC_DISCORD_OAUTH_ID } from "$env/static/public";

const oauthAPIBase = "https://discord.com/oauth2/";

const scope = encodeURIComponent("activities.write connections guilds.members.read identify")


//TODO: Change this to production URL or make ternary
const callBackURL = encodeURIComponent(dev ? "http://localhost:5173/login/discord/callback" ? "https://apply.sirius.menu/login/discord/callback")

export function GetAuthorizationURL(state: string, prompt: "consent" | "none") {
    return oauthAPIBase+`authorize?&client_id=${PUBLIC_DISCORD_OAUTH_ID}&scope=${scope}&state=${state}&redirect_uri=${callBackURL}&prompt=${prompt}`
}
