"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qco/ui/components/dialog";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@qco/ui/components/tabs";
import { Textarea } from "@qco/ui/components/textarea";
import {
  AlertCircle,
  FileVideo,
  LinkIcon,
  Loader2,
  Upload,
  Youtube,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import type { VideoSource } from "@/features/media/types";

interface VideoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: VideoSource) => void;
  initialVideo?: VideoSource;
}

export function VideoUpload({
  isOpen,
  onClose,
  onSave,
  initialVideo,
}: VideoUploadProps) {
  const [activeTab, setActiveTab] = useState<string>(
    initialVideo?.type || "youtube",
  );
  const [title, setTitle] = useState(initialVideo?.title || "");
  const [description, setDescription] = useState(
    initialVideo?.description || "",
  );
  const [url, setUrl] = useState(initialVideo?.url || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Название видео обязательно");
      return;
    }

    if (!url.trim()) {
      setError("URL видео обязателен");
      return;
    }

    setIsLoading(true);
    setError(null);

    // In a real application, you would upload the file to a server
    // For this demo, we'll simulate the API call with a timeout
    setTimeout(() => {
      const videoId = initialVideo?.id || `video-${Date.now()}`;
      let thumbnail = "";

      // Extract video ID and generate thumbnail URL
      if (activeTab === "youtube") {
        const youtubeId = extractYoutubeId(url);
        if (youtubeId) {
          thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
        }
      } else if (activeTab === "vimeo") {
        // For Vimeo, we would need to make an API call to get the thumbnail
        // For this demo, we'll use a placeholder
        thumbnail = "/video-thumbnail.png";
      } else {
        // For uploaded videos, we would generate a thumbnail from the video
        // For this demo, we'll use a placeholder
        thumbnail = "/video-thumbnail.png";
      }

      onSave({
        id: videoId,
        title,
        description,
        url,
        thumbnail,
        type: activeTab as "youtube" | "vimeo" | "upload",
      });

      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const extractYoutubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = regExp.exec(url);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // For this demo, we'll use a placeholder URL
      setUrl(`file://${file.name}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {initialVideo ? "Редактировать видео" : "Добавить видео"}
          </DialogTitle>
          <DialogDescription>
            Добавьте видео с YouTube, Vimeo или загрузите свой собственный файл.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              <span>YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="vimeo" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>Vimeo</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Загрузить</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название видео</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название видео"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание (необязательно)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание видео"
                rows={3}
              />
            </div>

            <TabsContent value="youtube" className="mt-0 space-y-2 pt-0">
              <Label htmlFor="youtube-url">URL видео на YouTube</Label>
              <Input
                id="youtube-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-muted-foreground text-xs">
                Вставьте полный URL видео с YouTube, например:
                https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </p>
            </TabsContent>

            <TabsContent value="vimeo" className="mt-0 space-y-2 pt-0">
              <Label htmlFor="vimeo-url">URL видео на Vimeo</Label>
              <Input
                id="vimeo-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://vimeo.com/..."
              />
              <p className="text-muted-foreground text-xs">
                Вставьте полный URL видео с Vimeo, например:
                https://vimeo.com/123456789
              </p>
            </TabsContent>

            <TabsContent value="upload" className="mt-0 space-y-2 pt-0">
              <Label htmlFor="file-upload">Загрузить видеофайл</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept="video/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <FileVideo className="mr-2 h-4 w-4" />
                  Выбрать файл
                </Button>
              </div>
              {url?.startsWith("file://") && (
                <p className="text-muted-foreground text-xs">
                  Выбран файл: {url.replace("file://", "")}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                Поддерживаемые форматы: MP4, WebM, OGG. Максимальный размер:
                100MB.
              </p>
            </TabsContent>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : initialVideo ? (
              "Сохранить изменения"
            ) : (
              "Добавить видео"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
