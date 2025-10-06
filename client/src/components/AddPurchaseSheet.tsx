import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPurchaseSchema, type InsertPurchase } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";

interface AddPurchaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertPurchase) => void;
  isPending?: boolean;
}

const categories = [
  "Grocery",
  "Restaurant",
  "Clothing",
  "Gas",
  "Medication",
  "Entertainment",
  "Babysitter",
  "Gift",
  "Misc",
] as const;

const paymentTypes = [
  "Citi x8215",
  "Chase x4694",
  "WSFS debit",
  "Other debit",
  "Check",
  "Cash",
] as const;

export function AddPurchaseSheet({ open, onOpenChange, onSubmit, isPending }: AddPurchaseSheetProps) {
  const form = useForm<InsertPurchase>({
    resolver: zodResolver(insertPurchaseSchema),
    defaultValues: {
      date: new Date(),
      place: "",
      category: "Grocery",
      paymentType: "Cash",
      checkNumber: "",
      price: "",
    },
  });

  const selectedPaymentType = form.watch("paymentType");
  const showCheckNumber = selectedPaymentType === "Check";

  const handleSubmit = (data: InsertPurchase) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="max-h-[90vh] overflow-y-auto"
        data-testid="sheet-add-purchase"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Add Purchase</SheetTitle>
          <SheetDescription>
            Enter the details of your purchase below
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      data-testid="input-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Store or location"
                      {...field}
                      data-testid="input-place"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} data-testid={`option-category-${cat.toLowerCase()}`}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-payment">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentTypes.map((type) => (
                        <SelectItem key={type} value={type} data-testid={`option-payment-${type.toLowerCase().replace(/\s+/g, '-')}`}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showCheckNumber && (
              <FormField
                control={form.control}
                name="checkNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234"
                        {...field}
                        data-testid="input-check-number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="pl-7"
                        {...field}
                        data-testid="input-price"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                disabled={isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isPending}
                data-testid="button-submit"
              >
                {isPending ? "Adding..." : "Add Purchase"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
