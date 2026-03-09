import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI();

/**
 * Scenario: You are building a content moderation system for product reviews. You want to check if a review is safe to publish or if it should be blocked for containing hate speech, spam, or personal information. You decide to use a parallelized voting system, where you run multiple safety checks in parallel and then combine their results to make a final decision.
 */
const userReview = "This product is very good. Don't buy this.";

console.log(`=== Review ===\n"${userReview}"\n`);
console.log("Running 3 safety checks in parallel...\n");

const [hateCheck, spamCheck, piiCheck] = await Promise.all([
  // Check 1: Hate speech / offensive language
  client.responses.create({
    model: "gpt-5.2",
    input: `Is this product review contain hate speech or offensive language?
Reply with ONLY one word: safe or unsafe. Nothing else.

Review: ${userReview}`,
  }),

  // Check 2: Spam / manipulation
  client.responses.create({
    model: "gpt-5.2",
    input: `Is this product review spam or manipulative (fake review, competitor attack, etc)?
Reply with ONLY one word: safe or unsafe. Nothing else.

Review: ${userReview}`,
  }),

  // Check 3: Personal information
  client.responses.create({
    model: "gpt-5.2",
    input: `Does this product review contain personal information (emails, phone numbers, addresses, full names)?
Reply with ONLY one word: safe or unsafe. Nothing else.

Review: ${userReview}`,
  }),
]);

const votes = [
  { name: "Hate speech", vote: hateCheck.output_text.trim().toLowerCase() },
  { name: "Spam", vote: spamCheck.output_text.trim().toLowerCase() },
  { name: "PII", vote: piiCheck.output_text.trim().toLowerCase() },
];

for (const v of votes) {
  const icon = v.vote === "safe" ? "✅" : "❌";
  console.log(`${icon} ${v.name}: ${v.vote}`);
}

// Majority vote: if 2+ say unsafe, block it
const unsafeCount = votes.filter((v) => v.vote === "unsafe").length;
const blocked = unsafeCount >= 2;

console.log(`\n=== Result: ${blocked ? "❌ BLOCKED" : "✅ PUBLISHED"} === (${unsafeCount}/3 unsafe)`);