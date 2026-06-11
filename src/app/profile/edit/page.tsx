// 프로필 편집 페이지
'use client'

import { TabBar } from "@/components/layout/TabBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useForm, SubmitHandler } from "react-hook-form";
import AvatarUpload from "@/components/profile/AvatarUpload";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import Toast from "@/components/common/Toast";
import ConfirmModal from "@/components/common/ConfirmModal";
interface Profile {
  id: string;
  nickname: string | null;
  email: string | null;
  avatar_url: string| null;
}

interface ProfileEditFormValues {
  nickname: string;
  password: string;
  passwordConfirm: string;
}

const hasChanges = (
  original: Profile,
  watched: ProfileEditFormValues,
  avatarUrl: string
): boolean => {
  return (
    original.nickname !== watched.nickname ||
    (original.avatar_url ?? "") !== avatarUrl ||
    watched.password.length > 0
  )
}

export default function ProfileEditPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProfileEditFormValues>({ mode: "onChange"})

  const watchedValues = watch();

  const isChanged = profile
    ? hasChanges(profile, watchedValues, avatarUrl)
    : false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push("/login");
          return;
        }

        // 프로필 가져오기
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          setAvatarUrl(profileData.avatar_url ?? "");
          reset({
            nickname: profileData.nickname ?? "",
            password: "",
            passwordConfirm: "",
          });
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router, reset]);

  const onSubmit: SubmitHandler<ProfileEditFormValues> = async (data) => {
    // 비밀번호 유효성 검사
    if (data.password && data.password !== data.passwordConfirm) {
      setToastMessage("비밀번호가 일치하지 않아요.");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 프로필 업데이트
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          nickname: data.nickname,
          avatar_url: avatarUrl || null,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 비밀번호 변경 (입력한 경우만)
      if (data.password) {
        const { error: pwError } = await supabase.auth.updateUser({
          password: data.password,
        });
        if (pwError) throw pwError;
      }

      router.push("/profile");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      setToastMessage("프로필 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ 회원 탈퇴 — 연쇄 삭제
  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // profiles 삭제 → CASCADE로 trips, photo_folders, photos 연쇄 삭제
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) throw error;

      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      setIsWithdrawing(false);
      setIsCancellationModalOpen(false);
    }
  };

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url)
  }

  const handleCancel = () => {
    if (isChanged) {
      setIsCancelModalOpen(true);
      return;
    }

    router.back();
  }

  if (isLoading) {
    return <Loading />;
  }


  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      {toastMessage && (
        <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2">
          <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>
        </div>
      )}
      <Header />

      {/* main */}
      <main className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        {/* TabBar*/}
        <div className="w-full z-10">
          <TabBar />
        </div>

        {/* content */}
        <section className="w-full lg:h-[600px] flex items-center p-10 bg-white">
          <div className="w-full h-full flex flex-col items-end justify-between border border-2 border-dashed border-dark">

            <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
              <div className="w-full h-full flex flex-col gap-10 lg:flex-row items-start justify-between px-[50px] py-6">

                {/* 프로필 사진 */}
                <div className="shrink-0">
                  <AvatarUpload
                    initialUrl={avatarUrl}
                    onUploadSuccess={handleAvatarUpload}
                  />
                </div>

                {/* 폼 필드 */}
                <div className="flex flex-col w-[500px] gap-10">
                  <Input
                    name="nickname"
                    label="닉네임"
                    placeholder="닉네임을 입력하세요."
                    variant="outlined"
                    sizeVariant="lg"
                    className="w-full"
                    inputClassName="w-full"
                    register={register("nickname", { required: "닉네임은 필수입니다." })}
                    errors={errors}
                  />
                  <Input
                    name="email"
                    label="이메일"
                    variant="outlined"
                    sizeVariant="lg"
                    className="w-full"
                    inputClassName="w-full"
                    defaultValue={profile?.email ?? ""}
                    disabled
                  />
                  <Input
                    name="password"
                    label="비밀번호"
                    type="password"
                    placeholder="변경할 새로운 비밀번호를 입력해주세요."
                    variant="outlined"
                    sizeVariant="lg"
                    className="w-full"
                    inputClassName="w-full"
                    register={register("password", {
                      minLength: { value: 6, message: "비밀번호는 6자 이상이어야 해요." }
                    })}
                    errors={errors}
                  />
                  <Input
                    name="passwordConfirm"
                    label="비밀번호 확인"
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요."
                    variant="outlined"
                    sizeVariant="lg"
                    className="w-full"
                    inputClassName="w-full"
                    register={register("passwordConfirm", {
                      validate: (value) =>
                        !watchedValues.password ||
                        value === watchedValues.password ||
                        "비밀번호가 일치하지 않아요."
                    })}
                    errors={errors}
                  />
                </div>

                {/* 버튼 필드 */}
                <div className="
                  flex flex-row items-center justify-between w-full
                  lg:flex-col lg:items-end lg:justify-between lg:w-auto lg:h-full lg:py-7
                ">
                  <div className="flex flex-col items-end gap-3">
                    <Button
                      type="submit"
                      variant="filled"
                      sizeVariant="sm"
                      disabled={!isChanged || isSaving}
                      isActive={isChanged}
                      className="disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      수정하기
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      sizeVariant="sm"
                      onClick={handleCancel}
                    >
                      취소
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCancellationModalOpen(true)}
                    className="text-base text-gray-300 hover:text-red transition-colors"
                  >
                    탈퇴하기
                  </button>
                </div>
              </div>

            </form>
            
          </div>
        </section>

      </main>

      <Footer />
      {isCancelModalOpen && (
        <ConfirmModal
          title="수정을 취소하시겠습니까?"
          description="변경된 내용은 저장되지 않습니다."
          confirmLabel="나가기"
          confirmVariant="filled"
          onConfirm={() => router.back()}
          onCancel={() => setIsCancelModalOpen(false)}
        />
      )}
      {isCancellationModalOpen && (
        <ConfirmModal
          isLoading={isWithdrawing}
          onConfirm={handleWithdraw}
          onCancel={() => setIsCancellationModalOpen(false)}
          title="탈퇴 하시겠습니까?"
          description="탈퇴하면 계정을 다시 살릴 수 없습니다."
          confirmLabel="탈퇴"
          loadingLabel="탈퇴 중..."
          confirmVariant="delete"
        />
      )}
    </div>
  )
}
