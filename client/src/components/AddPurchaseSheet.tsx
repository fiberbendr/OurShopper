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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";

interface AddPurchaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertPurchase) => void;
  isPending?: boolean;
}

const places = [
  "Acme",
  "Arbys",
  "Chik Fil A",
  "Chiropractor",
  "Cornerstone Presbyterian Church",
  "Dollar Tree",
  "Farmers Market",
  "Harvest Market",
  "Once Upon A Child",
  "Zingos",
  "Other",
] as const;

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
  "HSA",
] as const;

export function AddPurchaseSheet({ open, onOpenChange, onSubmit, isPending }: AddPurchaseSheetProps) {
  const [selectedPlace, setSelectedPlace] = useState<string>("Acme");

  const form = useForm<InsertPurchase>({
    resolver: zodResolver(insertPurchaseSchema),
    defaultValues: {
      date: new Date(),
      place: "Acme",
      paymentType: "Cash",
      checkNumber: "",
      lineItems: [{ category: "Grocery", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const selectedPaymentType = form.watch("paymentType");
  const showCheckNumber = selectedPaymentType === "Check";
  const showOtherPlace = selectedPlace === "Other";

  const handleSubmit = (data: InsertPurchase) => {
    onSubmit(data);
    form.reset({
      date: new Date(),
      place: "Acme",
      paymentType: "Cash",
      checkNumber: "",
      lineItems: [{ category: "Grocery", price: "" }],
    });
    setSelectedPlace("Acme");
    onOpenChange(false);
  };

  const addLineItem = () => {
    append({ category: "Grocery", price: "" });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
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
            Enter the purchase details and add items with categories and prices
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
                  <Select 
                    onValueChange={(value) => {
                      setSelectedPlace(value);
                      if (value !== "Other") {
                        field.onChange(value);
                      } else {
                        field.onChange("");
                      }
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-place">
                        <SelectValue placeholder="Select place" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {places.map((place) => (
                        <SelectItem key={place} value={place} data-testid={`option-place-${place.toLowerCase().replace(/\s+/g, '-')}`}>
                          {place}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showOtherPlace && (
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Place</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter store or location"
                        {...field}
                        data-testid="input-other-place"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                  disabled={isPending}
                  data-testid="button-add-item"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start" data-testid={`line-item-${index}`}>
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.category`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {index === 0 && <FormLabel>Category</FormLabel>}
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid={`select-category-${index}`}>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat} data-testid={`option-category-${cat.toLowerCase()}-${index}`}>
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
                    name={`lineItems.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {index === 0 && <FormLabel>Price</FormLabel>}
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
                              data-testid={`input-price-${index}`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`text-destructive hover:text-destructive hover:bg-destructive/10 ${index === 0 ? 'mt-8' : 'mt-0'}`}
                      onClick={() => removeLineItem(index)}
                      disabled={isPending}
                      data-testid={`button-remove-item-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  form.reset({
                    date: new Date(),
                    place: "Acme",
                    paymentType: "Cash",
                    checkNumber: "",
                    lineItems: [{ category: "Grocery", price: "" }],
                  });
                  setSelectedPlace("Acme");
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
