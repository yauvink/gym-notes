import { Box, Dialog, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import {
  TELEGRAM_BOT_USERNAME,
  TelegramAuthUser,
  isTelegramAuthUser,
} from "../../utils/telegramAuth";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthUser) => void;
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
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const host = hostRef.current;
    if (!host) {
      return;
    }

    host.replaceChildren();

    window.onTelegramAuth = (user: TelegramAuthUser) => {
      if (isTelegramAuthUser(user)) {
        onAuth(user);
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", TELEGRAM_BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    host.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
      host.replaceChildren();
    };
  }, [open, onAuth]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center" }}>
        <Typography sx={{ fontWeight: 800, fontSize: 18, textAlign: "center" }}>
          Sign in with Telegram
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", textAlign: "center" }}>
          Needed once to send your training count to Chat.
        </Typography>
        <Box ref={hostRef} sx={{ minHeight: 48, display: "flex", justifyContent: "center" }} />
      </Box>
    </Dialog>
  );
}

export default TelegramLoginDialog;
