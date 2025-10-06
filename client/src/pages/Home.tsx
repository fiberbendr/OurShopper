import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PurchaseCard } from "@/components/PurchaseCard";
import { AddPurchaseSheet } from "@/components/AddPurchaseSheet";
import { SyncIndicator } from "@/components/SyncIndicator";
import { EmptyState } from "@/components/EmptyState";
import { ThemeToggle } from "@/components/ThemeToggle";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Purchase, InsertPurchase } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";

export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const { status: syncStatus } = useWebSocket();

  const { data: purchases = [], isLoading } = useQuery<Purchase[]>({
    queryKey: ["/api/purchases"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertPurchase) => {
      return await apiRequest("POST", "/api/purchases", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      toast({
        title: "Purchase added",
        description: "Your purchase has been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add purchase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/purchases/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      toast({
        title: "Purchase deleted",
        description: "The purchase has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete purchase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const totalSpent = purchases.reduce((sum, p) => sum + parseFloat(p.price), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b border-card-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" data-testid="text-app-name">OurShopper</h1>
            <SyncIndicator status={syncStatus} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
        {!isLoading && purchases.length > 0 && (
          <div className="mb-4 p-4 bg-card rounded-lg border border-card-border">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total Spent</span>
              <span className="text-2xl font-bold tabular-nums text-primary" data-testid="text-total-spent">
                ${totalSpent.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-card animate-pulse rounded-lg" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {purchases
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((purchase) => (
                <PurchaseCard
                  key={purchase.id}
                  purchase={purchase}
                  onDelete={deleteMutation.mutate}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="max-w-2xl mx-auto flex justify-end">
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg pointer-events-auto"
            onClick={() => setIsSheetOpen(true)}
            data-testid="button-add-purchase"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <AddPurchaseSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={addMutation.mutate}
        isPending={addMutation.isPending}
      />
    </div>
  );
}
