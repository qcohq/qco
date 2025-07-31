"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { cn } from "@qco/ui/lib/utils";
import { Calendar, Eye, FileText, MessageCircle } from "lucide-react";

interface BlogStatsProps {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  publishedPosts: number;
  className?: string;
}

export function BlogStats({
  totalPosts,
  totalViews,
  totalComments,
  publishedPosts,
  className,
}: BlogStatsProps) {
  const stats = [
    {
      title: "Всего записей",
      value: totalPosts,
      icon: FileText,
      description: "Записей и страниц",
      color: "text-blue-600",
    },
    {
      title: "Опубликовано",
      value: publishedPosts,
      icon: Calendar,
      description: "Активных записей",
      color: "text-green-600",
    },
    {
      title: "Просмотры",
      value: totalViews.toLocaleString(),
      icon: Eye,
      description: "Всего просмотров",
      color: "text-purple-600",
    },
    {
      title: "Комментарии",
      value: totalComments,
      icon: MessageCircle,
      description: "Всего комментариев",
      color: "text-orange-600",
    },
  ];

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50 bg-background/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
