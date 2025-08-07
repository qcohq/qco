"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandaloneMode = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    setIsIOS(isIOSDevice);
    setIsStandalone(isStandaloneMode);
  }, []);

  if (!isIOS || isStandalone) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-black text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Установить приложение</p>
          <p className="text-sm text-gray-300">
            Нажмите на кнопку "Поделиться" и выберите "На экран «Домой»"
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsIOS(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
