import { Profile } from "@/hooks/useProfile";

export interface User {
  id: string;
  email?: string;
}

/**
 * Get the display name for a user, prioritizing username over email
 */
export const getDisplayName = (profile: Profile | null | undefined, user: User | null | undefined): string => {
  // If we have a profile with username, use it
  if (profile?.username) {
    return profile.username;
  }
  
  // If we have a profile with full name, use first name
  if (profile?.full_name) {
    return profile.full_name.split(' ')[0];
  }
  
  // Fall back to email username (part before @)
  if (user?.email) {
    return user.email.split('@')[0];
  }
  
  // Final fallback
  return 'User';
};

/**
 * Get the user's initials for avatar display
 */
export const getUserInitials = (profile: Profile | null | undefined, user: User | null | undefined): string => {
  // If we have a username, use first letter
  if (profile?.username) {
    return profile.username.charAt(0).toUpperCase();
  }
  
  // If we have a full name, use first letter of first and last name
  if (profile?.full_name) {
    const names = profile.full_name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  }
  
  // Fall back to email first letter
  if (user?.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

/**
 * Get the full display info for a user
 */
export const getUserDisplayInfo = (profile: Profile | null | undefined, user: User | null | undefined) => {
  return {
    displayName: getDisplayName(profile, user),
    initials: getUserInitials(profile, user),
    fullName: profile?.full_name || null,
    username: profile?.username || null,
    email: user?.email || profile?.email || null,
  };
};
