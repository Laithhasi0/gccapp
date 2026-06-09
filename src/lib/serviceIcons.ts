import {
  Smartphone,
  Globe,
  ShoppingCart,
  Palette,
  Megaphone,
  Search,
  Server,
  Users,
  ShoppingBag,
  PenTool,
  type LucideIcon,
} from "lucide-react";

/** Maps a CMS icon name to its Lucide component. */
export const serviceIcons: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  globe: Globe,
  "shopping-cart": ShoppingCart,
  palette: Palette,
  megaphone: Megaphone,
  search: Search,
  server: Server,
  users: Users,
  "shopping-bag": ShoppingBag,
  "pen-tool": PenTool,
};

export const iconFor = (name?: string): LucideIcon =>
  (name && serviceIcons[name]) || Globe;
