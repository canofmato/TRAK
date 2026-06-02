'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Loading from "@/components/common/Loading";

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

  return <Loading label="로그인 처리 중" />;
}
