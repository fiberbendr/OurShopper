import { Badge } from "@/components/ui/badge";
import type { Purchase } from "@shared/schema";

const categoryConfig = {
  Grocery: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
  Restaurant: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  Clothing: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  Gas: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  Medication: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
  Entertainment: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
  Babysitter: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400" },
  Gift: { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-500" },
  Misc: { bg: "bg-gray-500/10", text: "text-gray-600 dark:text-gray-400" },
} as const;

interface CategoryBadgeProps {
  category: Purchase["category"];
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category as keyof typeof categoryConfig];
  
  return (
    <Badge 
      variant="secondary" 
      className={`${config.bg} ${config.text} border-0 text-xs font-medium`}
      data-testid={`badge-category-${category.toLowerCase()}`}
    >
      {category}
    </Badge>
  );
}
