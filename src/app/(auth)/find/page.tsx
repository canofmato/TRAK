'use client';

import React, { useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Toast from "@/components/common/Toast";
import { supabase } from "@/lib/supabaseClient";

interface FindPasswordFormValues {
  email: string;
}

export default function FindPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FindPasswordFormValues>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FindPasswordFormValues> = async ({ email }) => {
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setToastMessage(`비밀번호 재설정 메일 발송 실패... ${error.message}`);
      return;
    }

    setIsSent(true);
    setToastMessage("비밀번호 재설정 링크를 이메일로 보냈어요.");
  };

  return (
    <div className="flex flex-col w-full font-roboto text-black justify-center gap-10">
      {toastMessage && (
        <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2">
          <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>
        </div>
      )}

      {/* 타이틀 */}
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-subtitle-lg font-bold">비밀번호 찾기</h1>
        <p className="text-base text-gray-200">
          가입한 이메일로 비밀번호 재설정 링크를 보내드릴게요.
        </p>
      </div>

      {/* 사용자 입력폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          name="email"
          label="이메일"
          placeholder="이메일을 입력해주세요."
          variant="filled"
          sizeVariant="lg"
          register={register("email", {
            required: "이메일을 입력해주세요.",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "올바른 형식의 이메일을 입력해주세요.",
            },
          })}
          errors={errors}
        />

        {isSent && (
          <div className="rounded-[10px] bg-gray-100 p-4 text-base text-gray-400">
            메일함에서 TRAK 비밀번호 재설정 링크를 확인해주세요.
            스팸함에 들어가 있을 수도 있어요.
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          sizeVariant="lg"
          disabled={isLoading || !isValid}
          isActive={isValid}
        >
          {isLoading ? "메일 발송 중..." : "재설정 링크 받기"}
        </Button>
      </form>

      <div className="flex gap-2 items-center justify-center">
        <p className="text-caption text-gray-200">비밀번호가 기억나셨나요?</p>
        <Link href="/login" className="text-base font-semibold">
          로그인
        </Link>
      </div>
    </div>
  );
}
