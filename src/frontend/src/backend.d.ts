import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export type Time = bigint;
export interface Profile {
    bio: string;
    username: string;
    displayName: string;
    avatarBlobId?: string;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(displayName: string, username: string, bio: string, _avatarBlobId: string | null): Promise<void>;
    generateInviteCode(): Promise<string>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getMyProfile(): Promise<Profile | null>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
}
