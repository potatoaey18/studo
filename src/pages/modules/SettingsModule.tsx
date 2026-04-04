import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme";

const SettingsModule = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold">Settings</h2>
      <Card className="p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Dark Mode</Label>
            <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Notifications</Label>
            <p className="text-xs text-muted-foreground">Enable browser notifications</p>
          </div>
          <Switch
            onCheckedChange={(v) => {
              if (v && "Notification" in window) {
                Notification.requestPermission();
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default SettingsModule;
