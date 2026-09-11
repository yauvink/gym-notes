import { Toaster } from "sonner";
import { useThemeSettings } from "../../theme";
import { DoneIcon, ErrorIcon } from "./Icons";

function AppToaster() {
  const { resolvedMode } = useThemeSettings();

  return (
    <Toaster
      theme={resolvedMode}
      position="top-right"
      icons={{ success: <DoneIcon />, error: <ErrorIcon /> }}
      visibleToasts={3}
      offset={{
        top: "calc(10px + env(safe-area-inset-top, 0px))",
        right: "calc(8px + env(safe-area-inset-right, 0px))",
      }}
      mobileOffset={{
        top: "calc(10px + env(safe-area-inset-top, 0px))",
        right: "calc(8px + env(safe-area-inset-right, 0px))",
      }}
      toastOptions={{
        className: "gn-toast",
      }}
    />
  );
}

export default AppToaster;
