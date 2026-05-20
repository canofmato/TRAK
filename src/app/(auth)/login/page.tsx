'use client';

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/components/common/Input";
import { FcGoogle } from "react-icons/fc";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabaseClient";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  //로그인 진행 중
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors},
    } = useForm<LoginFormValues>({
      mode: "onChange",
    });

    // 두 필드 모두 입력됐는지 감지
    const watchedFields = watch(["email", "password"]);
    const isComplete = watchedFields.every((v) => v && v.trim() !== "");

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        setIsLoading(true);
        
        const { data: loginData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        setIsLoading(false);
    
        if (error) {
          alert(`로그인실패... ❌ \n에러 내용: ${error.message}`);
        } else {
          alert("로그인 성공! 🎉 \n환영합니다!");
          console.log("로그인 성공 데이터:", loginData);
        }
      };

    //구글 로그인 버튼
      const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/test`,
          },
        });
        if (error) alert(`구글 로그인 실패: ${error.message}`);
      }

    return (
      <div className="flex flex-col w-full font-roboto text-black justify-center gap-10">
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
                <a href="/find" className="text-caption text-gray-200">비밀번호를 잊으셨나요?</a>
              </div>
      
              {/* 로그인 버튼 */}
              <Button
                type="submit"
                variant="primary"
                sizeVariant="lg"
                disabled={isLoading}
                isActive={isComplete}
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