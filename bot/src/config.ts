export type BotConfig = {
    token: string;
    viewerRoleId: string;
    welcomeChannelId: string;
    subRoleId: string;
    liveChannelId: string;
};

export const config: BotConfig = {
    token: process.env.TOKEN!,
    viewerRoleId: process.env.VIEWER_ROLE_ID!,
    welcomeChannelId: process.env.WELCOME_CHANNEL_ID!,
    subRoleId: process.env.SUB_ROLE_ID!,
    liveChannelId: process.env.LIVE_CHANNEL_ID!,
};
