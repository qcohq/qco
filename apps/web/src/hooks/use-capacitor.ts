"use client";

import { useCallback, useEffect, useState } from "react";

interface CapacitorInfo {
  isNative: boolean;
  platform: "ios" | "android" | "web";
  version: string;
  deviceInfo?: {
    name: string;
    model: string;
    platform: string;
    operatingSystem: string;
    osVersion: string;
    manufacturer: string;
    isVirtual: boolean;
    webViewVersion: string;
  };
}

export function useCapacitor() {
  const [capacitorInfo, setCapacitorInfo] = useState<CapacitorInfo>({
    isNative: false,
    platform: "web",
    version: "1.0.0",
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const detectCapacitor = async () => {
      try {
        const isCapacitor =
          typeof window !== "undefined" && (window as any).Capacitor;

        if (isCapacitor) {
          // Определяем платформу
          const userAgent = navigator.userAgent.toLowerCase();
          let platform: "ios" | "android" | "web" = "web";

          if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
            platform = "ios";
          } else if (userAgent.includes("android")) {
            platform = "android";
          }

          setCapacitorInfo({
            isNative: true,
            platform,
            version: "1.0.0", // Будет обновлено после установки Capacitor
          });
        } else {
          setCapacitorInfo({
            isNative: false,
            platform: "web",
            version: "1.0.0",
          });
        }
      } catch (error) {
        console.error("Error detecting Capacitor:", error);
        setCapacitorInfo({
          isNative: false,
          platform: "web",
          version: "1.0.0",
        });
      } finally {
        setIsReady(true);
      }
    };

    detectCapacitor();
  }, []);

  // Haptic feedback
  const triggerHaptic = useCallback(
    async (style: "light" | "medium" | "heavy" = "light") => {
      if (capacitorInfo.isNative && typeof window !== "undefined") {
        try {
          // Здесь будет вызов Capacitor Haptics API после установки
          console.log("Haptic feedback triggered:", style);
        } catch (error) {
          console.log("Haptics not available:", error);
        }
      }
    },
    [capacitorInfo.isNative],
  );

  // Vibrate
  const vibrate = useCallback(
    async (duration = 100) => {
      if (capacitorInfo.isNative && typeof window !== "undefined") {
        try {
          // Здесь будет вызов Capacitor Haptics API после установки
          console.log("Vibration triggered:", duration);
        } catch (error) {
          console.log("Vibration not available:", error);
        }
      } else if ("vibrate" in navigator) {
        navigator.vibrate(duration);
      }
    },
    [capacitorInfo.isNative],
  );

  // Share content
  const share = useCallback(
    async (data: { title?: string; text?: string; url?: string }) => {
      if (capacitorInfo.isNative && typeof window !== "undefined") {
        try {
          // Здесь будет вызов Capacitor Share API после установки
          console.log("Share triggered:", data);
        } catch (error) {
          console.log("Share not available:", error);
        }
      } else if ("share" in navigator) {
        try {
          await navigator.share(data);
        } catch (error) {
          console.log("Web Share API not available:", error);
        }
      }
    },
    [capacitorInfo.isNative],
  );

  // Take photo
  const takePhoto = useCallback(async () => {
    if (capacitorInfo.isNative && typeof window !== "undefined") {
      try {
        // Здесь будет вызов Capacitor Camera API после установки
        console.log("Take photo triggered");
        return null;
      } catch (error) {
        console.log("Camera not available:", error);
        return null;
      }
    } else {
      // Fallback для веб-версии
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";

      return new Promise<File | null>((resolve) => {
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0] || null;
          resolve(file);
        };
        input.click();
      });
    }
  }, [capacitorInfo.isNative]);

  // Get location
  const getLocation = useCallback(async () => {
    if (capacitorInfo.isNative && typeof window !== "undefined") {
      try {
        // Здесь будет вызов Capacitor Geolocation API после установки
        console.log("Get location triggered");
        return null;
      } catch (error) {
        console.log("Geolocation not available:", error);
        return null;
      }
    } else if ("geolocation" in navigator) {
      return new Promise<GeolocationPosition | null>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });
    }
    return null;
  }, [capacitorInfo.isNative]);

  return {
    ...capacitorInfo,
    isReady,
    triggerHaptic,
    vibrate,
    share,
    takePhoto,
    getLocation,
  };
}
