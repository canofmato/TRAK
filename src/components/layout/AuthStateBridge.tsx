'use client'

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTabStore } from "@/store/tabStore";

export default function AuthStateBridge() {
  const setActiveUser = useTabStore((state) => state.setActiveUser);
  const clearTabs = useTabStore((state) => state.clearTabs);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setActiveUser(data.user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        clearTabs();
        setActiveUser(null);
        return;
      }

      setActiveUser(session?.user.id ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [clearTabs, setActiveUser]);

  return null;
}
