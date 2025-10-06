import { ShoppingBag } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4" data-testid="empty-state">
      <div className="rounded-full bg-muted p-6 mb-4">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Tap the + button to add your first purchase and start tracking
      </p>
    </div>
  );
}
