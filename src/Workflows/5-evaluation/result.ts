export type Product = {
  name: string;
  price: number;
};

export function getTopExpensive(products: Product[], count: number): Product[] {
  if (!Array.isArray(products) || products.length === 0) return [];
  if (!Number.isFinite(count) || count <= 0) return [];

  const normalizedCount = Math.floor(count);
  const maxResults = Math.min(normalizedCount, products.length);

  const sortedByPriceDesc = products.slice().sort((a, b) => b.price - a.price);

  return sortedByPriceDesc.slice(0, maxResults);
}