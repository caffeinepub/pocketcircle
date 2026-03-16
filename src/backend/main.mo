import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Random "mo:core/Random";
import Runtime "mo:core/Runtime";
import NotificationList "mo:core/List";
import NotificationArray "mo:core/Array";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import InviteLinksModule "invite-links/invite-links-module";

actor {
  type Profile = {
    displayName : Text;
    username : Text;
    bio : Text;
    avatarBlobId : ?Text;
  };

  let profiles = Map.empty<Principal, Profile>();
  var inviteCodeCounter = 0;

  module Profile {
    public func compare(profile1 : Profile, profile2 : Profile) : Order.Order {
      Text.compare(profile1.username, profile2.username);
    };
  };

  type HomeFeedRequest = {
    offset : Nat;
    limit : Nat;
    timestamp : Time.Time;
  };

  type HomeFeedResponse = {
    posts : [Post];
    comments : [Comment];
    notifications : [Notification];
    circles : [Circle];
  };

  type Circle = {
    id : Text;
    name : Text;
    description : Text;
    adminId : Principal;
    memberIds : [Principal];
    createdAt : Time.Time;
  };

  type CircleMembership = {
    circleId : Text;
    userId : Principal;
    status : {
      #pending;
      #active;
      #rejected;
    };
    invitedBy : Principal;
  };

  type Post = {
    id : Text;
    circleId : Text;
    authorId : Principal;
    postType : {
      #text;
      #photo;
    };
    textContent : ?Text;
    mediaBlobId : ?Text;
    timestamp : Time.Time;
    reactions : [(Principal, Text)];
    commentCount : Nat;
  };

  type Comment = {
    id : Text;
    postId : Text;
    authorId : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type Notification = {
    id : Text;
    userId : Principal;
    notificationType : {
      #newPost;
      #newComment;
      #circleInvite;
    };
    referenceId : Text;
    isRead : Bool;
    timestamp : Time.Time;
  };

  type Reaction = {
    userId : Principal;
    emoji : Text;
  };

  let circles = Map.empty<Text, Circle>();
  let memberships = Map.empty<Text, CircleMembership>();
  let posts = Map.empty<Text, Post>();
  let comments = Map.empty<Text, Comment>();
  let notifications = Map.empty<Principal, Notification>();

  include MixinStorage();

  // Authorization Component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Invite Links Component
  let inviteState = InviteLinksModule.initState();

  // Admin-Only Invite Code Generator
  public shared ({ caller }) func generateInviteCode() : async Text {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  // Submit RSVP (public, but checks for valid invite code)
  public shared func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  // Admin-Only: Get all RSVPs
  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  // Admin-Only: Get all invite codes
  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteState);
  };

  // Business Logic (simplified)
  public shared ({ caller }) func createOrUpdateProfile(displayName : Text, username : Text, bio : Text, _avatarBlobId : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };
    let profile : Profile = {
      displayName;
      username;
      bio;
      avatarBlobId = _avatarBlobId;
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public query ({ caller }) func getMyProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };
};
