"use client";

import { Button } from "@qco/ui/components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { PlusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { BrandFormValues } from "@/features/brands/schemas/brand-schema";
import { VideoGallery } from "@/features/media/components/video-gallery";

export function BrandVideos() {
  const { control, watch, setValue } = useFormContext<BrandFormValues>();
  const videos = watch("videos") || [];

  // Add a new video
  const addVideo = () => {
    setValue("videos", [
      ...videos,
      {
        id: `video-${Date.now()}`,
        title: "",
        url: "",
        thumbnail: "",
      },
    ]);
  };

  // Remove a video
  const removeVideo = (videoId: string) => {
    setValue(
      "videos",
      videos.filter((video) => video.id !== videoId),
    );
  };

  // Update a video
  const updateVideo = (
    videoId: string,
    data: { id?: string; title?: string; url?: string; thumbnail?: string },
  ) => {
    setValue(
      "videos",
      videos.map((video) =>
        video.id === videoId ? { ...video, ...data } : video,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="videos"
        render={({ field: _ }) => (
          <FormItem>
            <FormLabel>Видео</FormLabel>
            <FormDescription>
              Добавьте видео для демонстрации продукции бренда
            </FormDescription>
            <FormControl>
              <div>
                {/* Video gallery */}
                {videos.length > 0 && (
                  <VideoGallery
                    videos={videos}
                    onRemove={removeVideo}
                    onUpdate={updateVideo}
                    editable
                  />
                )}

                {/* Add video button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addVideo}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Добавить видео
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
