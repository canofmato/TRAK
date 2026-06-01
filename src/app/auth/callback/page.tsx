'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finishOAuthLogin = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/main");
        return;
      }

      router.replace("/login");
    };

    finishOAuthLogin();
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      로그인 처리 중...
    </div>
  );
}
