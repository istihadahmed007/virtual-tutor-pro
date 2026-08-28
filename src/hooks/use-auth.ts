import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";

export interface AuthUser {
  _id: string;
  name?: string;
  image?: string;
  email?: string;
  role?: string;
  bio?: string;
  timezone?: string;
}

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const raw = useQuery(api.users.currentUser);
  const { signIn, signOut } = useAuthActions();

  const isLoading = isAuthLoading || raw === undefined;

  const user: AuthUser | null = raw
    ? {
        _id: String(raw._id),
        name: (raw as Record<string, unknown>).name as string | undefined,
        image: (raw as Record<string, unknown>).image as string | undefined,
        email: (raw as Record<string, unknown>).email as string | undefined,
        role: (raw as Record<string, unknown>).role as string | undefined,
        bio: (raw as Record<string, unknown>).bio as string | undefined,
        timezone: (raw as Record<string, unknown>).timezone as string | undefined,
      }
    : null;

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
