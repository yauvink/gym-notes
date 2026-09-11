import { Box, Dialog, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  TELEGRAM_BOT_USERNAME,
  TelegramAuthUser,
  installTelegramAuthBridge,
  logTelegram,
  setTelegramAuthListener,
} from "../../utils/telegramAuth";

declare global {
  interface Window {
    onTelegramAuth?: (user: unknown) => void;
  }
}

function TelegramLoginDialog({
  open,
  onClose,
  onAuth,
}: {
  open: boolean;
  onClose: () => void;
  onAuth: (user: TelegramAuthUser) => void;
}) {
  const [hostEl, setHostEl] = useState<HTMLDivElement | null>(null);
  const onAuthRef = useRef(onAuth);
  onAuthRef.current = onAuth;

  useEffect(() => {
    installTelegramAuthBridge();
  }, []);

  useEffect(() => {
    if (!open || !hostEl) {
      return;
    }

    setTelegramAuthListener((user) => {
      logTelegram("listener received user", user);
      onAuthRef.current(user);
    });

    if (!hostEl.querySelector("script, iframe")) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", TELEGRAM_BOT_USERNAME);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-userpic", "false");
      script.setAttribute("data-radius", "8");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.onload = () => logTelegram("widget.js loaded");
      script.onerror = (error) => {
        console.error("%c[Telegram] widget.js failed", "color: #FF2BD6; font-weight: 800;", error);
      };
      hostEl.appendChild(script);
      logTelegram("widget.js injected");
    }

    return () => {
      setTelegramAuthListener(null);
    };
  }, [open, hostEl]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" keepMounted>
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center" }}>
        <Typography sx={{ fontWeight: 800, fontSize: 18, textAlign: "center" }}>
          Sign in with Telegram
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", textAlign: "center" }}>
          Needed once to send your training count to Chat.
        </Typography>
        <Box
          ref={setHostEl}
          sx={{ minHeight: 48, display: "flex", justifyContent: "center" }}
        />
      </Box>
    </Dialog>
  );
}

export default TelegramLoginDialog;
