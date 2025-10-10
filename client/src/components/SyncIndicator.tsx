import { CheckCircle2, Loader2, CloudOff } from "lucide-react";

interface SyncIndicatorProps {
  status: "synced" | "syncing" | "offline";
}

export function SyncIndicator({ status }: SyncIndicatorProps) {
  if (status === "synced") {
    return (
      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400" data-testid="status-synced">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-xs font-medium">Synced</span>
      </div>
    );
  }

  if (status === "syncing") {
    return (
      <div className="flex items-center gap-1.5 text-primary" data-testid="status-syncing">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-xs font-medium">Syncing...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground" data-testid="status-offline">
      <CloudOff className="h-4 w-4" />
      <span className="text-xs font-medium">Offline</span>
    </div>
  );
}
