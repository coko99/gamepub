import {
  Beer,
  Coffee,
  Citrus,
  CupSoda,
  Droplets,
  Globe2,
  Home,
  LucideIcon,
  Milk,
  Wine,
  Zap,
} from "lucide-react";
import { MenuCategory } from "@/content/menu";

const iconMap: Record<MenuCategory["icon"], LucideIcon> = {
  coffee: Coffee,
  soda: CupSoda,
  zap: Zap,
  milk: Milk,
  droplets: Droplets,
  citrus: Citrus,
  beer: Beer,
  wine: Wine,
  globe: Globe2,
  home: Home,
};

interface MenuIconProps {
  icon: MenuCategory["icon"];
  className?: string;
  size?: number;
}

export function MenuIcon({ icon, className = "", size = 20 }: MenuIconProps) {
  const Icon = iconMap[icon];
  return <Icon size={size} className={className} aria-hidden />;
}
