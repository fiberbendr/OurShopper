import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import type { Purchase } from "@shared/schema";
import { CategoryBadge } from "./CategoryBadge";
import { format } from "date-fns";

interface PurchaseCardProps {
  purchase: Purchase;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function PurchaseCard({ purchase, onDelete, isDeleting }: PurchaseCardProps) {
  const formattedDate = format(new Date(purchase.date), "MMM d, yyyy");
  const formattedPrice = new Decimal(purchase.price).toFixed(2);
  
  const paymentDisplay = purchase.paymentType === "Check" && purchase.checkNumber
    ? `Check #${purchase.checkNumber}`
    : purchase.paymentType;

  return (
    <Card 
      className="p-4 mb-3 hover-elevate"
      data-testid={`card-purchase-${purchase.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs text-muted-foreground" data-testid="text-date">
              {formattedDate}
            </span>
          </div>
          <h3 className="text-base font-medium mb-2 truncate" data-testid="text-place">
            {purchase.place}
          </h3>
          <div className="flex flex-wrap gap-2">
            <CategoryBadge category={purchase.category} />
            <Badge 
              variant="outline" 
              className="text-xs"
              data-testid="badge-payment"
            >
              {paymentDisplay}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="text-right">
            <div className="text-xl font-semibold tabular-nums text-primary" data-testid="text-price">
              ${formattedPrice}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(purchase.id)}
            disabled={isDeleting}
            data-testid={`button-delete-${purchase.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

class Decimal {
  constructor(private value: string) {}
  
  toFixed(decimals: number): string {
    const num = parseFloat(this.value);
    return num.toFixed(decimals);
  }
}
