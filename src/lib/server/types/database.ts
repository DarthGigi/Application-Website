export interface DiscordUser {
  User: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    banner?: string | null;
    accent_color?: number | null;
  };
  Guild: {
    nickname?: string | null;
    roles: string[];
    joined_at: string;
  };
}

export interface User {
  _id: string;
  discord: DiscordUser;
  reviewer: boolean;
}

export interface Session {
  _id: string;
  UserID: string;
  ExpiresAt: number;
  //IP: string;
}
