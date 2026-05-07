/**
 * @file RealtimeNotificationsCard.tsx — Real-time notification preferences
 *
 * Per-device toggles for in-app toasts, sound chime, and OS-level browser
 * push notifications when a new row appears in `notifications`.
 */
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Volume2, MonitorSmartphone } from 'lucide-react';
import { notificationPrefs } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

export function RealtimeNotificationsCard() {
  const { toast } = useToast();
  const k = notificationPrefs.keys;

  const [toastOn, setToastOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [pushOn, setPushOn] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setToastOn(notificationPrefs.get(k.toast));
    setSoundOn(notificationPrefs.get(k.sound));
    setPushOn(notificationPrefs.get(k.push));
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(window.Notification.permission);
    }
  }, [k]);

  const update = (key: string, value: boolean, setter: (v: boolean) => void) => {
    notificationPrefs.set(key, value);
    setter(value);
  };

  const handlePushToggle = async (value: boolean) => {
    if (value && permission !== 'granted') {
      const result = await notificationPrefs.requestPushPermission();
      setPermission(result);
      if (result !== 'granted') {
        toast({
          title: 'Permission denied',
          description: 'Enable notifications in your browser settings to receive desktop alerts.',
          variant: 'destructive',
        });
        return;
      }
    }
    update(k.push, value, setPushOn);
  };

  const pushDisabled = permission === 'denied';

  return (
    <Card className="glass-card border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Bell className="h-5 w-5 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          Real-time Alerts
        </CardTitle>
        <CardDescription>
          Control how new notifications announce themselves on this device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Row
          icon={<Bell className="h-4 w-4 text-primary" />}
          label="In-app toast"
          desc="Show a popup in the corner when a new notification arrives."
          checked={toastOn}
          onChange={(v) => update(k.toast, v, setToastOn)}
        />
        <Row
          icon={<Volume2 className="h-4 w-4 text-secondary" />}
          label="Sound chime"
          desc="Play a soft cyber chime for new notifications."
          checked={soundOn}
          onChange={(v) => update(k.sound, v, setSoundOn)}
        />
        <Row
          icon={<MonitorSmartphone className="h-4 w-4 text-accent" />}
          label="Desktop notifications"
          desc={
            pushDisabled
              ? 'Blocked by your browser. Allow notifications in site settings to enable.'
              : 'Show OS-level notifications when this tab is in the background.'
          }
          checked={pushOn && permission === 'granted'}
          onChange={handlePushToggle}
          disabled={pushDisabled}
        />
        {permission === 'default' && pushOn && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePushToggle(true)}
            className="w-full"
          >
            Grant browser permission
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function Row({
  icon,
  label,
  desc,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-black/30 border border-primary/10">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="space-y-0.5 min-w-0">
          <Label className="text-base">{label}</Label>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
      />
    </div>
  );
}
