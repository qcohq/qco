"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import { User as UserIcon } from "lucide-react";
import React from "react";
import { useProfile } from "../hooks/use-profile";
import { AccountStats } from "./account-stats";
import { EmailVerificationBanner } from "./email-verification-banner";

function formatDate(date?: Date | string | null) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ProfileOverview() {
  const { profile, profileLoading } = useProfile();

  if (profileLoading) {
    return (
      <Card className="border bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle>Обзор профиля</CardTitle>
          <CardDescription>Загрузка данных профиля...</CardDescription>
        </CardHeader>
        <CardContent className="py-8 flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
            <UserIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  const fullName =
    (profile.firstName || "") +
    (profile.lastName ? ` ${profile.lastName}` : "");
  const displayName = fullName.trim() || profile.name || profile.email || "—";
  const genderMap: Record<string, string> = {
    male: "Мужской",
    female: "Женский",
    other: "Другое",
  };

  return (
    <div className="space-y-6">
      {/* Желтая плашка для неподтвержденного email */}
      {profile.email && !profile.emailVerified && (
        <EmailVerificationBanner email={profile.email} />
      )}

      <Card className="border bg-white text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle>Обзор профиля</CardTitle>
          <CardDescription>Личная информация и статистика</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Аватар и имя */}
            <div className="flex flex-col items-center min-w-[180px]">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover mb-4 border"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="font-semibold text-lg text-center">
                {displayName}
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {profile.email || "—"}
              </div>
            </div>

            {/* Информация о пользователе */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span className="text-muted-foreground">Телефон:</span>
                <div>{profile.phone || "—"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Дата регистрации:</span>
                <div>{formatDate(profile.createdAt)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Пол:</span>
                <div>
                  {profile.gender ? genderMap[profile.gender] || "—" : "—"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Дата рождения:</span>
                <div>{formatDate(profile.dateOfBirth)}</div>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div>
            <div className="font-semibold text-base mb-4">
              Статистика аккаунта
            </div>
            <AccountStats />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
