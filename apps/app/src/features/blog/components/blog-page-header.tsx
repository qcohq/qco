"use client";

import { Button } from "@qco/ui/components/button";
import { BarChart3, Plus } from "lucide-react";
import Link from "next/link";

interface BlogPageHeaderProps {
  title: string;
  description?: string;
  showCreateButton?: boolean;
  showStatsButton?: boolean;
  className?: string;
}

export function BlogPageHeader({
  title,
  description,
  showCreateButton = true,
  showStatsButton = false,
  className,
}: BlogPageHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showStatsButton && (
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Статистика
          </Button>
        )}
        {showCreateButton && (
          <Button asChild>
            <Link href="/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              Новая запись
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
