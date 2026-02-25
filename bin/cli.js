#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import fs from "fs-extra";

// 1. Get the project name from command line arguments
const projectName = process.argv[2];

if (!projectName) {
  console.error("Please specify the project directory:");
  console.log("  npx create-express-pro <project-directory>");
  process.exit(1);
}

const currentDir = process.cwd();
const projectPath = path.join(currentDir, projectName);
const gitRepo = "https://github.com/suryakarmakar-codeclouds/express-pro"; // YOUR REPO URL

try {
  console.log(`🚀 Creating a new Express Pro project in ${projectPath}...`);

  // 2. Clone the repository
  execSync(`git clone --depth 1 ${gitRepo} "${projectPath}"`, {
    stdio: "inherit",
  });

  // 3. Clean up the project
  process.chdir(projectPath);

  // Remove the .git folder so it's a fresh project for the user
  fs.removeSync(path.join(projectPath, ".git"));

  console.log("📦 Installing dependencies...");
  execSync("npm install", { stdio: "inherit" });

  console.log("\n✅ Success! To get started:");
  console.log(`  cd ${projectName}`);
  console.log("  npm run dev");
} catch (error) {
  console.error("❌ Failed to create project:", error);
  process.exit(1);
}
