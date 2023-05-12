import type { mastodon } from 'masto'

export interface weightsType {
    [key: string]: number; // Replace 'any' with the desired value type (e.g., string, number, etc.)
}

export interface StatusType extends mastodon.v1.Status {
    topPost?: boolean;
    weights?: weightsType;
    value?: number;
    reblog?: StatusType;
    reblogBy?: string;
}


export type App = {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    website: string;
}

export type User = {
    accessToken: string;
    id: string;
    username: string;
    server: string;
}