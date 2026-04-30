"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type PWAState = {
  isStandalone: boolean;
  isIOS: boolean;
  isInstallable: boolean;
  prompt: (() => Promise<"accepted" | "dismissed" | "unavailable">) | null;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const noopSubscribe = () => () => {};

function readIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
}

function readStandalone() {
  if (typeof window === "undefined") return false;
  const matchStandalone = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;
  const iosStandalone =
    "standalone" in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return matchStandalone || iosStandalone;
}

function subscribeStandalone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function usePWA(): PWAState {
  const isIOS = useSyncExternalStore(
    noopSubscribe,
    readIOS,
    () => false,
  );
  const isStandalone = useSyncExternalStore(
    subscribeStandalone,
    readStandalone,
    () => false,
  );

  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return {
    isStandalone,
    isIOS,
    isInstallable: deferred !== null,
    prompt: deferred
      ? async () => {
          await deferred.prompt();
          const { outcome } = await deferred.userChoice;
          if (outcome === "accepted") setDeferred(null);
          return outcome;
        }
      : null,
  };
}
