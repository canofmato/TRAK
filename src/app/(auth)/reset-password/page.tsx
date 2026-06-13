'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loading from "@/components/common/Loading";
import Toast from "@/components/common/Toast";
import { supabase } from "@/lib/supabaseClient";

interface ResetPasswordFormValues {
  password: string;
  passwordConfirm: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasResetSession, setHasResetSession] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    mode: "onChange",
  });

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === "PASSWORD_RECOVERY" || event === "INITIAL_SESSION") {
        setHasResetSession(!!session);
        setIsCheckingSession(false);
      }
    });

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setHasResetSession(!!session);
      setIsCheckingSession(false);
    };

    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async ({ password }) => {
    setIsSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setToastMessage(`비밀번호 변경 실패... ${error.message}`);
      setIsSaving(false);
      return;
    }

    setToastMessage("비밀번호가 변경되었어요. 다시 로그인해주세요.");

    window.setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/login");
    }, 1000);
  };

  if (isCheckingSession) {
    return <Loading label="비밀번호 재설정 링크 확인 중" />;
  }

  return (
    <div className="flex flex-col w-full font-roboto text-black justify-center gap-10">
      {toastMessage && (
        <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2">
          <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>
        </div>
      )}

      {/* 타이틀 */}
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-subtitle-lg font-bold">새 비밀번호 설정</h1>
        <p className="text-base text-gray-200">
          앞으로 사용할 새 비밀번호를 입력해주세요.
        </p>
      </div>

      {!hasResetSession ? (
        <div className="flex flex-col gap-5">
          <div className="rounded-[10px] bg-gray-100 p-4 text-base text-gray-400">
            비밀번호 재설정 링크가 만료되었거나 올바르지 않아요.
            다시 재설정 메일을 요청해주세요.
          </div>

          <Button
            type="button"
            variant="primary"
            sizeVariant="lg"
            isActive
            onClick={() => router.push("/find")}
          >
            재설정 메일 다시 받기
          </Button>

          <div className="flex gap-2 items-center justify-center">
            <p className="text-caption text-gray-200">계정이 기억나셨나요?</p>
            <Link href="/login" className="text-base font-semibold">
              로그인
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 사용자 입력폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              name="password"
              type="password"
              label="새 비밀번호"
              placeholder="새 비밀번호를 입력해주세요."
              variant="filled"
              sizeVariant="lg"
              register={register("password", {
                required: "새 비밀번호를 입력해주세요.",
                minLength: {
                  value: 8,
                  message: "비밀번호는 최소 8자 이상이어야 합니다.",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message: "영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.",
                },
              })}
              errors={errors}
            />

            <Input
              name="passwordConfirm"
              type="password"
              label="새 비밀번호 확인"
              placeholder="새 비밀번호를 다시 입력해주세요."
              variant="filled"
              sizeVariant="lg"
              register={register("passwordConfirm", {
                required: "새 비밀번호를 다시 한 번 입력해주세요.",
                validate: (value) =>
                  value === getValues("password") || "비밀번호가 일치하지 않습니다.",
              })}
              errors={errors}
            />

            <Button
              type="submit"
              variant="primary"
              sizeVariant="lg"
              disabled={isSaving || !isValid}
              isActive={isValid}
            >
              {isSaving ? "비밀번호 변경 중..." : "비밀번호 변경하기"}
            </Button>
          </form>

          <div className="flex gap-2 items-center justify-center">
            <p className="text-caption text-gray-200">비밀번호가 기억나셨나요?</p>
            <Link href="/login" className="text-base font-semibold">
              로그인
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
