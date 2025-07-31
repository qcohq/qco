"use client";

import { Button } from "@qco/ui/components/button";
import { Card, CardContent } from "@qco/ui/components/card";
import { Input } from "@qco/ui/components/input";
import { Pencil, Play, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

interface VideoGalleryProps {
  videos: Video[];
  onRemove?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<Video>) => void;
  editable?: boolean;
}

export function VideoGallery({
  videos,
  onRemove,
  onUpdate,
  editable = false,
}: VideoGalleryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editUrl, setEditUrl] = useState<string>("");

  // Start editing a video
  const startEditing = (videoId: string, title: string, url: string) => {
    setEditingId(videoId);
    setEditTitle(title);
    setEditUrl(url);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Save video changes
  const saveVideo = (video: Video) => {
    if (onUpdate) {
      onUpdate(video.id, { title: editTitle, url: editUrl });
    }
    setEditingId(null);
  };

  // Render edit form
  const renderEditForm = (video: Video) => {
    return (
      <div className="space-y-3 p-3">
        <div>
          <label
            htmlFor={`video-title-${video.id}`}
            className="mb-1 block text-sm font-medium"
          >
            Название
          </label>
          <Input
            id={`video-title-${video.id}`}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Введите название видео"
          />
        </div>

        <div>
          <label
            htmlFor={`video-url-${video.id}`}
            className="mb-1 block text-sm font-medium"
          >
            URL видео
          </label>
          <Input
            id={`video-url-${video.id}`}
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={cancelEditing}
          >
            Отмена
          </Button>
          <Button type="button" size="sm" onClick={() => saveVideo(video)}>
            Сохранить
          </Button>
        </div>
      </div>
    );
  };

  // Render video card
  const renderVideoCard = (video: Video) => {
    const isEditing = editingId === video.id;

    if (isEditing) {
      return renderEditForm(video);
    }

    return (
      <div className="group relative">
        {/* Video thumbnail */}
        <div className="bg-muted relative aspect-video overflow-hidden rounded-md">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail || "/placeholder.svg"}
              alt={video.title}
              fill
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <Play className="text-muted-foreground h-12 w-12 opacity-50" />
            </div>
          )}

          {/* Play button overlay */}
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <div className="rounded-full bg-white/90 p-3">
              <Play className="h-6 w-6 text-black" />
            </div>
          </a>
        </div>

        {/* Video title */}
        <div className="mt-2">
          <h4 className="truncate font-medium">
            {video.title || "Без названия"}
          </h4>
        </div>

        {/* Actions */}
        {editable && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={() => startEditing(video.id, video.title, video.url)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Редактировать</span>
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRemove?.(video.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Удалить</span>
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-6 text-center">
          Нет добавленных видео
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {videos.map((video) => (
        <Card key={video.id}>
          <CardContent className="p-3">{renderVideoCard(video)}</CardContent>
        </Card>
      ))}
    </div>
  );
}
