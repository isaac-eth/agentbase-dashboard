#!/usr/bin/env node
/**
 * Interactive helper to create / add an allowed login user.
 *
 * Usage:  npm run add-user
 *
 * It prompts for email, name and password (password input is hidden),
 * hashes the password with bcrypt, and prints the JSON you paste into the
 * AUTH_USERS environment variable. Your plaintext password is NEVER stored
 * or sent anywhere — only the irreversible bcrypt hash leaves this script.
 */
import bcrypt from "bcryptjs";
import readline from "node:readline";

function ask(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (a) => { rl.close(); resolve(a.trim()); }));
}

function askHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    // Mute echoing so the password never appears on screen.
    rl._writeToOutput = () => {};
    process.stdout.write(query);
    rl.question("", (value) => {
      rl.close();
      process.stdout.write("\n");
      resolve(value);
    });
  });
}

async function main() {
  console.log("\n  Add an allowed login user\n  --------------------------\n");

  const email = (await ask("  Email: ")).toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("\n  ✗ Invalid email.\n");
    process.exit(1);
  }

  const name = (await ask("  Name (optional): ")) || email;

  const pw1 = await askHidden("  Password: ");
  const pw2 = await askHidden("  Confirm password: ");

  if (!pw1) {
    console.error("\n  ✗ Password cannot be empty.\n");
    process.exit(1);
  }
  if (pw1 !== pw2) {
    console.error("\n  ✗ Passwords do not match.\n");
    process.exit(1);
  }
  if (pw1.length < 8) {
    console.error("\n  ✗ Use at least 8 characters.\n");
    process.exit(1);
  }

  const passwordHash = bcrypt.hashSync(pw1, 12);
  const entry = { email, name, passwordHash };

  console.log("\n  ✓ User entry created. Add it to the AUTH_USERS env var.\n");
  console.log("  This single user as AUTH_USERS value:\n");
  console.log("  " + JSON.stringify([entry]) + "\n");
  console.log("  (If you already have users, add this object to the existing array:)");
  console.log("  " + JSON.stringify(entry) + "\n");
  console.log("  Then set it on Vercel:");
  console.log("    vercel env rm AUTH_USERS production   # if it already exists");
  console.log("    vercel env add AUTH_USERS production  # paste the array value");
  console.log("    vercel build --prod && vercel deploy --prebuilt --prod\n");
}

main();
