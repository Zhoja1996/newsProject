import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/shared/api/supabaseClient";

interface AuthContextValue {
  session: Session | null;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  isAuthLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        if (mounted) {
          setIsAuthLoading(false);
        }
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setSession(session);
      setIsAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthLoading,
    }),
    [session, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);