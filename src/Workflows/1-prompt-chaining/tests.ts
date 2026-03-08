import { getTopExpensive } from "./products.ts";

const products = [
  { name: "Keyboard", price: 50 },
  { name: "Monitor", price: 300 },
  { name: "Mouse", price: 25 },
  { name: "Laptop", price: 1200 },
  { name: "Webcam", price: 80 },
];

console.log("Running tests...\n");

const result = getTopExpensive(products, 3);

console.assert(result.length === 3, "Should return 3 items");
console.log("✅ Test 1: Returns 3 items");

console.assert(result[0].name === "Laptop", "First should be Laptop");
console.log("✅ Test 2: First item is Laptop");

console.assert(result[1].name === "Monitor", "Second should be Monitor");
console.log("✅ Test 3: Second item is Monitor");

console.assert(result[2].name === "Webcam", "Third should be Webcam");
console.log("✅ Test 4: Third item is Webcam");

console.log("\nAll tests passed!");