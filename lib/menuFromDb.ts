import { menuCategories, type MenuCategory } from "@/content/menu";
import { createServiceClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types/menu";

const themeByTitle = new Map(
  menuCategories.map((category) => [category.title.toLowerCase(), category]),
);

const fallbackThemes = menuCategories.map(({ icon, glow, border, gradient }) => ({
  icon,
  glow,
  border,
  gradient,
}));

function themeForCategory(name: string, index: number) {
  const matched = themeByTitle.get(name.toLowerCase());
  if (matched) {
    return {
      icon: matched.icon,
      glow: matched.glow,
      border: matched.border,
      gradient: matched.gradient,
    };
  }

  return fallbackThemes[index % fallbackThemes.length];
}

export function mapDbMenuToCategories(
  categories: Category[],
  products: Product[],
): MenuCategory[] {
  const productsByCategory = new Map<string, Product[]>();

  for (const product of products) {
    const list = productsByCategory.get(product.category_id) ?? [];
    list.push(product);
    productsByCategory.set(product.category_id, list);
  }

  return categories
    .filter((category) => category.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category, index) => {
      const theme = themeForCategory(category.name, index);
      const items = (productsByCategory.get(category.id) ?? [])
        .filter((product) => product.available)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((product) => ({
          name: product.name,
          price: Number(product.price),
        }));

      return {
        id: category.id,
        title: category.name,
        ...theme,
        items,
      };
    })
    .filter((category) => category.items.length > 0);
}

export async function fetchPublicMenuCategories(): Promise<MenuCategory[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  try {
    const supabase = createServiceClient();
    const [{ data: categories, error: categoriesError }, { data: products, error: productsError }] =
      await Promise.all([
        supabase.from("categories").select("*").eq("active", true).order("sort_order"),
        supabase.from("products").select("*").eq("available", true).order("sort_order"),
      ]);

    if (categoriesError || productsError || !categories?.length) {
      return null;
    }

    const mapped = mapDbMenuToCategories(
      categories as Category[],
      (products ?? []).map((product) => ({
        ...product,
        price: Number(product.price),
        featured: Boolean(product.featured),
        featured_order: Number(product.featured_order ?? 0),
      })) as Product[],
    );

    return mapped.length > 0 ? mapped : null;
  } catch {
    return null;
  }
}
