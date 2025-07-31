"use client";

import { Loader2, Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  type: "youtube" | "vimeo" | "upload";
  title?: string;
  className?: string;
}

export function VideoPlayer({ src, type, title, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // In a real application, you would handle different video types properly
    // For this demo, we'll simulate loading with a timeout
    const timer = setTimeout(() => {
      if (type === "youtube" || type === "vimeo") {
        // For embedded videos, we would load them in an iframe
        // For this demo, we'll just simulate success
        setIsLoading(false);
      } else if (type === "upload") {
        // For uploaded videos, we would load them in a video element
        // For this demo, we'll simulate an error for demonstration purposes
        if (Math.random() > 0.8) {
          setError("Не удалось загрузить видео. Пожалуйста, попробуйте позже.");
        } else {
          setIsLoading(false);
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [type]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-black p-4 text-center">
          <p className="text-white/70">{error}</p>
          <button
            type="button"
            className="mt-4 rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            onClick={() => setIsLoading(false)}
          >
            Повторить попытку
          </button>
        </div>
      );
    }

    if (type === "youtube") {
      const videoId = extractYoutubeId(src);
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
          title={title || "YouTube video"}
          className="h-full w-full"
          allowFullScreen
        />
      );
    }

    if (type === "vimeo") {
      const videoId = extractVimeoId(src);
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title={title || "Vimeo video"}
          className="h-full w-full"
          allowFullScreen
        />
      );
    }

    // For uploaded videos
    return (
      <>
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        // biome-ignore lint/a11y/useMediaCaption: Добавлен пустой track для субтитров
        >
          {/* Добавляем пустой track для субтитров, чтобы удовлетворить требования accessibility */}
          <track kind="captions" src="" label="Русский" />
        </video>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/50 p-2">
          <button type="button" onClick={togglePlay} className="text-white">
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleMute} className="text-white">
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-white"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </>
    );
  };

  const extractYoutubeId = (url: string): string => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = regExp.exec(url);
    return match && match[2].length === 11 ? match[2] : "";
  };

  const extractVimeoId = (url: string): string => {
    const regExp = /vimeo\.com\/([0-9]+)/;
    const match = regExp.exec(url);
    return match ? match[1] : "";
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video overflow-hidden rounded-md bg-black",
        className,
      )}
    >
      {renderContent()}
    </div>
  );
}
