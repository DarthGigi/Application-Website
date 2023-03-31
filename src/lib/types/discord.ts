export interface OAuthResponse {
  name: string;
  value: string;
}

export interface DiscordAccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_at?: number;
}
