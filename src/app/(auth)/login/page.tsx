'use client';

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/components/common/Input";
import { FcGoogle } from "react-icons/fc";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Toast from "@/components/common/Toast";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  //로그인 진행 중
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const {
      register,
      handleSubmit,
      formState: { errors, isValid},
    } = useForm<LoginFormValues>({
      mode: "onChange",
    });

    const router = useRouter();

    const checkEmailExists = async (email: string) => {
      const { data, error } = await supabase.functions.invoke<{
        exists: boolean;
      }>("check-email-exists", {
        body: { email },
      });

      if (error) throw error;

      return data?.exists ?? false;
    };

    const getLoginErrorMessage = (message: string) => {
      const normalizedMessage = message.toLowerCase();

      if (normalizedMessage.includes("email not confirmed")) {
        return "이메일 인증이 아직 완료되지 않았어요. 메일함에서 인증 링크를 확인해주세요.";
      }

      if (
        normalizedMessage.includes("invalid login credentials") ||
        normalizedMessage.includes("invalid credentials")
      ) {
        return "비밀번호가 올바르지 않아요. 다시 확인해주세요.";
      }

      if (normalizedMessage.includes("too many requests")) {
        return "로그인 시도가 너무 많아요. 잠시 후 다시 시도해주세요.";
      }

      return "로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.";
    };
    
    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        setIsLoading(true);

        const normalizedEmail = data.email.trim();

        try {
          const emailExists = await checkEmailExists(normalizedEmail);

          if (!emailExists) {
            setToastMessage("가입된 이메일이 아니에요. 이메일을 다시 확인해주세요.");
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("이메일 가입 여부 확인 실패:", error);
        }
        
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: data.password,
        });
        setIsLoading(false);
    
        if (error) {
          setToastMessage(getLoginErrorMessage(error.message));
        } else {
          setToastMessage("로그인 성공 🎉 환영합니다!");
          window.setTimeout(() => {
            router.push("/main");
          }, 1000);
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
        if (error) setToastMessage(`구글 로그인 실패: ${error.message}`);
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
              <h1 className="text-subtitle-lg font-bold">로그인</h1>
              <p className="text-base text-gray-200">계정에 로그인해 여행을 관리하세요.</p>
            </div>
      
            {/* 사용자 입력폼 */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">  
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

              {/* 비밀번호 찾기 */}
              <div className="w-full flex justify-end">
                <a href="/find" className="text-caption text-gray-200 hover:text-gray-400">비밀번호를 잊으셨나요?</a>
              </div>
      
              {/* 로그인 버튼 */}
              <Button
                type="submit"
                variant="primary"
                sizeVariant="lg"
                disabled={isLoading || !isValid}
                isActive={isValid}
              >
                로그인
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
                <FcGoogle size={24} /> Google로 로그인하기
              </Button>
              <div className="flex gap-2 items-center justify-center">
                <p className="text-caption text-gray-200">계정이 없으신가요?</p>
                <a href="/signup" className="text-base font-semibold">회원가입</a>
              </div>
            </div>
          </div>
    )
}
