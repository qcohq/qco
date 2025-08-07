"use client";

import { useCallback, useEffect, useState } from "react";
import { subscribeUser, unsubscribeUser } from "@/app/actions";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  const registerServiceWorker = useCallback(async () => {
    try {
      // Сначала проверяем, есть ли уже зарегистрированный SW
      const existingRegistration =
        await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        // Обновляем существующий SW
        await existingRegistration.update();
        setRegistration(existingRegistration);
        console.log("Service Worker updated successfully");
        return;
      }

      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      setRegistration(reg);
      console.log("Service Worker registered successfully");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      // В случае ошибки пытаемся отключить SW
      try {
        const existingRegistration =
          await navigator.serviceWorker.getRegistration();
        if (existingRegistration) {
          await existingRegistration.unregister();
          console.log("Service Worker unregistered due to errors");
        }
      } catch (unregisterError) {
        console.error("Failed to unregister Service Worker:", unregisterError);
      }
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, [registerServiceWorker]);

  const subscribeToPushNotifications = async () => {
    if (!registration) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Permission denied for notifications");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await subscribeUser(subscription);
      setIsSubscribed(true);
      console.log("Successfully subscribed to push notifications");
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
    }
  };

  const unsubscribeFromPushNotifications = async () => {
    if (!registration) return;

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await unsubscribeUser();
        setIsSubscribed(false);
        console.log("Successfully unsubscribed from push notifications");
      }
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={
          isSubscribed
            ? unsubscribeFromPushNotifications
            : subscribeToPushNotifications
        }
        className="bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        {isSubscribed
          ? "Отписаться от уведомлений"
          : "Подписаться на уведомления"}
      </button>
    </div>
  );
}
