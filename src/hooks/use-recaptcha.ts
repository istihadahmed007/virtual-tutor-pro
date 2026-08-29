import { useCallback, useEffect, useRef } from "react";

const RECAPTCHA_SCRIPT_ID = "recaptcha-v3-script";
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

export function useRecaptcha() {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!SITE_KEY || isLoaded.current) return;
    if (typeof document === "undefined") return;

    const existing = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (existing) {
      isLoaded.current = true;
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    isLoaded.current = true;
  }, []);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string> => {
      if (!SITE_KEY) {
        throw new Error("Security verification is not configured.");
      }

      if (typeof window === "undefined" || !window.grecaptcha) {
        throw new Error(
          "Security verification is loading. Please try again.",
        );
      }

      return new Promise<string>((resolve, reject) => {
        window.grecaptcha!.ready(() => {
          window.grecaptcha!.execute(SITE_KEY, { action }).then(
            (token) => {
              if (token) {
                resolve(token);
              } else {
                reject(
                  new Error("Verification failed. Please try again."),
                );
              }
            },
            () => {
              reject(
                new Error(
                  "Security verification failed. Please try again.",
                ),
              );
            },
          );
        });
      });
    },
    [],
  );

  return { executeRecaptcha, isConfigured: !!SITE_KEY };
}
