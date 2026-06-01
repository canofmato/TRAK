'use client';

import React, { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/components/common/Input";
import { FcGoogle } from "react-icons/fc";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface SignupFormValues {
  nickname: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export default function SignupPage() {
  //회원가입 진행 중
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid},
  } = useForm<SignupFormValues>({
    mode: "onChange",
  });

  const router = useRouter();
  const emailValue = watch("email");
  const passwordValue = watch("password");

  const checkEmailExists = useCallback(async (email: string) => {
    const { data, error } = await supabase.functions.invoke<{
      exists: boolean;
    }>("check-email-exists", {
      body: { email },
    });

    if (error) throw error;

    return data?.exists ?? false;
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const normalizedEmail = emailValue?.trim();
    const isEmailFormatValid = /^\S+@\S+$/i.test(normalizedEmail ?? "");

    if (!normalizedEmail || !isEmailFormatValid) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsCheckingEmail(true);
      try {
        const exists = await checkEmailExists(normalizedEmail);

        if (isCancelled) return;

        if (exists) {
          setError("email", {
            type: "manual",
            message: "이미 가입된 이메일입니다.",
          });
        } else {
          clearErrors("email");
        }
      } catch (error) {
        if (isCancelled) return;
        console.error("이메일 중복 확인 실패:", error);
      } finally {
        if (isCancelled) return;
        setIsCheckingEmail(false);
      }
    }, 500);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [emailValue, checkEmailExists, setError, clearErrors]);

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsLoading(true);

    try {
      const emailExists = await checkEmailExists(data.email);

      if (emailExists) {
        setError("email", {
          type: "manual",
          message: "이미 가입된 이메일입니다.",
        });
        setIsLoading(false);
        return;
      }
    } catch {
      alert("이메일 중복 확인 중 문제가 발생했습니다.");
      setIsLoading(false);
      return;
    }

    clearErrors("email");

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        // 닉네임을 유저 메타데이터데 담아 보내면, 백엔드 트리거가 profiles 테이블에 자동으로 꽂아줌
        data: {
          full_name: data.nickname,
        }
      }
    });
    setIsLoading(false);

    if (error) {
      alert(`회원가입 실패... ❌ \n에러 내용: ${error.message}`);
    } else {
      alert("회원가입 요청 성공! 🎉 \n이메일 인증 링크가 발송되었습니다. (인프라 설정에 따라 바로 로그인될 수도 있어요!)");
      console.log("가입 성공 데이터:", signUpData);
      router.push("/login");
    }
  };

  //구글 로그인 버튼
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) alert(`구글 로그인 실패: ${error.message}`);
  }

  return (
    <div className="flex flex-col w-full font-roboto text-black justify-center gap-10">
      {/* 타이틀 */}
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-subtitle-lg font-bold">회원가입</h1>
        <p className="text-base text-gray-200">새 계정을 만들어 여행을 기록해보세요.</p>
      </div>

      {/* 사용자 입력폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* 닉네임 */}
        <Input 
          name="nickname"
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          variant="filled"
          sizeVariant="lg" 
          register={register("nickname", { required: "닉네임을 입력해주세요." })}
          errors={errors}
        />

        {/* 이메일 */}
        <Input
          name="email"
          label="이메일"
          placeholder="이메일을 입력해주세요."
          variant="filled"
          sizeVariant="lg"
          register={register("email", { 
            required: "이메일을 입력해주세요.",
            pattern: { value: /^\S+@\S+$/i, message: "올바른 형식의 이메일을 입력해주세요." }
          })}
          errors={errors}
        />

        {/* 비밀번호 */}
        <Input
          name="password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          variant="filled"
          sizeVariant="lg"
          register={register("password", { 
            required: "비밀번호를 입력해주세요.",
            minLength: {
              value: 8,
              message: "비밀번호는 최소 8자 이상이어야 합니다."
            },
            pattern: {
              // 영문, 숫자, 특수문자가 최소 1개 이상 포함되었는지 검사
              value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              message: "영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요."
            }
          })}
          errors={errors}
        />

        {/* 비밀번호 확인 */}
        <Input
          name="passwordCheck"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요."
          variant="filled"
          sizeVariant="lg"
          register={register("passwordCheck", {
            required: "비밀번호를 다시 한 번 입력해주세요.",
            validate: (value) => value === passwordValue || "비밀번호가 일치하지 않습니다."
          })}
          errors={errors}
        />

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          variant="primary"
          sizeVariant="lg"
          disabled={isLoading || isCheckingEmail || !isValid}
          isActive={isValid && !isCheckingEmail}
        >
          {isCheckingEmail ? "이메일 확인 중..." : "회원가입"}
        </Button>
      </form>

      {/* 기타 로그인 */}
      <div className="flex flex-col gap-5">
        <Button
          type="button"
          variant="outlined"
          sizeVariant="lg"
          onClick={handleGoogleLogin}
          className="flex gap-2"
        >
          <FcGoogle size={24} /> Google로 계속하기
        </Button>
        <div className="flex gap-2 items-center justify-center">
          <p className="text-caption text-gray-200">이미 계정이 있으신가요?</p>
          <a href="/login" className="text-base font-semibold">로그인</a>
        </div>
      </div>
    </div>
  )
}
