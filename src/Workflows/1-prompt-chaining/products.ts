type Product = { name: string; price: number };

export function getTopExpensive(products: Product[], count: number): Product[] {
  const sorted = products.sort((a, b) => b.price - a.price);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(sorted[i]);
  }
  return result;
}

export function getCheapest(products: Product[], count: number): Product[] {
  const sorted = products.sort((a, b) => a.price - b.price);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(sorted[i]);
  }
  return result;
}