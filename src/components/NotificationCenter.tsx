import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { demoNotifications } from "@/lib/demoData";
import { requestNotificationPermission } from "@/lib/notifications";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(demoNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));

  const enablePush = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      new Notification("Studo", { body: "Push notifications enabled!" });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-display font-semibold text-sm">Notifications</h4>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={enablePush}>
              Enable Push
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>
              Mark all read
            </Button>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className={`p-3 border-b last:border-0 ${n.read ? "opacity-60" : ""}`}>
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
