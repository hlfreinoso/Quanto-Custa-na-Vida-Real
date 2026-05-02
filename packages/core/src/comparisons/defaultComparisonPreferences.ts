import type { ComparisonPreference } from "../models/ComparisonPreference";

export const defaultComparisonPreferences: readonly ComparisonPreference[] = [
  {
    id: "coffee",
    label: "Cafe",
    category: "food",
    unitPrice: 6,
    unitLabel: "cafes",
  },
  {
    id: "beer",
    label: "Cerveja",
    category: "leisure",
    unitPrice: 8,
    unitLabel: "cervejas",
  },
  {
    id: "chocolate",
    label: "Bombons",
    category: "food",
    unitPrice: 2.5,
    unitLabel: "bombons",
  },
  {
    id: "delivery",
    label: "Delivery",
    category: "food",
    unitPrice: 70,
    unitLabel: "pedidos de delivery",
  },
  {
    id: "netflix",
    label: "Netflix",
    category: "subscription",
    unitPrice: 39.9,
    unitLabel: "meses de Netflix",
  },
  {
    id: "gasoline",
    label: "Gasolina",
    category: "transport",
    unitPrice: 6,
    unitLabel: "litros de gasolina",
  },
  {
    id: "lunch",
    label: "Almoco",
    category: "food",
    unitPrice: 35,
    unitLabel: "almocos",
  },
  {
    id: "market",
    label: "Mercado",
    category: "market",
    unitPrice: 150,
    unitLabel: "compras de mercado",
  },
];
