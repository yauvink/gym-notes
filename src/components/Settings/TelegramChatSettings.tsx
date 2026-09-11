import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  TELEGRAM_AUTH_CHANGED_EVENT,
  TelegramAuthUser,
  clearTelegramUser,
  formatTelegramDisplayName,
  getTelegramUser,
} from "../../utils/telegramAuth";
import { notifyShort } from "../../utils/notify";

function TelegramChatSettings() {
  const [user, setUser] = useState<TelegramAuthUser | null>(() => getTelegramUser());

  useEffect(() => {
    const sync = () => setUser(getTelegramUser());
    window.addEventListener(TELEGRAM_AUTH_CHANGED_EVENT, sync);
    return () => window.removeEventListener(TELEGRAM_AUTH_CHANGED_EVENT, sync);
  }, []);

  const handleLogout = () => {
    clearTelegramUser();
    setUser(null);
    notifyShort("Signed out of Telegram");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 420, mt: 3 }}>
      <Typography sx={{ fontWeight: 800, mb: 1.5, fontSize: 20 }}>Chat</Typography>
      <Box
        className="glass-surface"
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
        }}
      >
        {user ? (
          <>
            <Typography sx={{ fontSize: 16 }}>Signed in as {formatTelegramDisplayName(user)}</Typography>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Not signed in. Use Send to Chat on the calendar to log in with Telegram.
            You must be a member of the chat to use this feature.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default TelegramChatSettings;
