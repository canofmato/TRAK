'use client';

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/components/common/Input";
import { FcGoogle } from "react-icons/fc";
import Button from "@/components/common/Button";

interface SignupFormValues {
  nickname: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors},
  } = useForm<SignupFormValues>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    console.log("회원가입 데이터:", data);
  };

  const passwordValue = watch("password");

  return (
    <div className="flex flex-col w-full font-roboto text-black justify-center gap-10">
      {/* 타이틀 */}
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-24 font-bold">회원가입</h1>
        <p className="text-14 text-gray-200">새 계정을 만들어 여행을 기록하세요.</p>
      </div>

      {/* 사용자 입력폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* 닉네임 */}
        <Input 
          name="nickname"
          label="닉네임 *"
          placeholder="닉네임을 입력해주세요."
          variant="filled"
          sizeVariant="lg" 
          register={register("nickname", { required: "닉네임을 입력해주세요." })}
          errors={errors}
        />

        {/* 이메일 */}
        <Input
          name="email"
          label="이메일 *"
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
          type="password"          // 💡 type="password"를 주면 컴포넌트 내부 눈모양 아이콘이 켜집니다!
          label="비밀번호 *"
          placeholder="비밀번호를 입력해주세요."
          variant="filled"
          sizeVariant="lg"
          register={register("password", { required: "특수문자 포함 8자 이상을 입력해주세요." })}
          errors={errors}
        />

        {/* 비밀번호 확인 */}
        <Input
          name="passwordCheck"
          type="password"          // 💡 type="password"를 주면 컴포넌트 내부 눈모양 아이콘이 켜집니다!
          label="비밀번호 확인*"
          placeholder="비밀번호를 다시 입력해주세요."
          variant="filled"
          sizeVariant="lg"
          register={register("passwordCheck", {
            required: "비밀번호를 다시 한 번 입력해주세요.",
            validate: (value) => value === passwordValue || "비밀번호가 일치하지 않습니다." // 💡 실시간 일치 검증
          })}
          errors={errors}
        />

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          variant="primary"
          sizeVariant="lg"
        >
          회원가입
        </Button>

      </form>

      {/* 기타 로그인 */}
      <div className="flex flex-col gap-5">
        <Button
          type="button"
          variant="outlined"
          sizeVariant="lg"
          onClick={() => console.log("구글 로그인 시도")}
        >
          <FcGoogle size={24} /> Google로 계속하기
        </Button>
        <div className="flex gap-2 items-center justify-center">
          <p className="text-12 text-gray-200">이미 계정이 있으신가요?</p>
          <a href="/login" className="text-16 font-semibold">로그인</a>
        </div>
      </div>

    </div>
  )
}