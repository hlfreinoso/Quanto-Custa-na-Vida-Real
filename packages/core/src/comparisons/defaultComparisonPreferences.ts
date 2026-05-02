import type { ComparisonPreference } from "../models/ComparisonPreference";

export const defaultComparisonPreferences: readonly ComparisonPreference[] = [
  {
    id: "coffee",
    label: "Cafe",
    category: "food",
  },
  {
    id: "beer",
    label: "Cerveja",
    category: "leisure",
  },
  {
    id: "chocolate",
    label: "Bombons",
    category: "food",
  },
  {
    id: "delivery",
    label: "Delivery",
    category: "food",
  },
  {
    id: "streaming",
    label: "Streaming",
    category: "subscription",
  },
  {
    id: "gasoline",
    label: "Gasolina",
    category: "transport",
  },
  {
    id: "lunch",
    label: "Almoco",
    category: "food",
  },
  {
    id: "market",
    label: "Mercado",
    category: "market",
  },
];
