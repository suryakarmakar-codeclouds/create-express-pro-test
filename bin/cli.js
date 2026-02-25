#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import fs from "fs-extra";

// Get arguments
const commandOrName = process.argv[2]; // e.g., 'my-app' OR 'add'
const moduleName = process.argv[3]; // e.g., undefined OR 'logger'

if (!commandOrName) {
  console.error("❌ Please specify a command or project directory:");
  console.log("  npx create-express-pro-test <project-directory>");
  console.log("  npx create-express-pro-test add <module-name>");
  process.exit(1);
}

// ==========================================
// LOGIC 1: ADD A MODULE (The shadcn way)
// ==========================================
if (commandOrName === "add") {
  if (!moduleName) {
    console.error("❌ Please specify a module to add (e.g., logger, auth).");
    process.exit(1);
  }

  // Replace this with your actual RAW GitHub URL for the registry
  const registryBaseUrl =
    "https://raw.githubusercontent.com/suryakarmakar-codeclouds/express-pro-registry/main";
  const moduleUrl = `${registryBaseUrl}/${moduleName}.json`;

  const addModule = async () => {
    try {
      console.log(`⬇️  Fetching ${moduleName} from registry...`);

      // Using native fetch (Node 18+)
      const response = await fetch(moduleUrl);
      if (!response.ok) throw new Error("Module not found in registry.");

      const moduleData = await response.json();

      // 1. Install Dependencies if the module has any
      if (moduleData.dependencies && moduleData.dependencies.length > 0) {
        console.log(
          `📦 Installing dependencies: ${moduleData.dependencies.join(", ")}`,
        );
        execSync(`npm install ${moduleData.dependencies.join(" ")}`, {
          stdio: "inherit",
        });
      }

      // 2. Create the files in the user's project
      for (const file of moduleData.files) {
        const destination = path.join(process.cwd(), file.targetPath);

        // Ensure the folder exists (e.g., 'utils/')
        await fs.ensureDir(path.dirname(destination));

        // Write the code to the file
        await fs.writeFile(destination, file.content);
        console.log(`✅ Created: ${file.targetPath}`);
      }

      console.log(`\n🚀 Successfully added ${moduleName}!`);
    } catch (error) {
      console.error(`❌ Failed to add module: ${error.message}`);
    }
  };

  addModule();
}
// ==========================================
// LOGIC 2: CREATE A NEW PROJECT
// ==========================================
else {
  const currentDir = process.cwd();
  const projectPath = path.join(currentDir, commandOrName);
  const gitRepo = "https://github.com/suryakarmakar-codeclouds/express-pro";

  try {
    console.log(`🚀 Creating a new Express Pro project in ${projectPath}...`);

    execSync(`git clone --depth 1 ${gitRepo} "${projectPath}"`, {
      stdio: "inherit",
    });

    process.chdir(projectPath);
    fs.removeSync(path.join(projectPath, ".git"));

    console.log("📦 Installing base dependencies...");
    execSync("npm install", { stdio: "inherit" });

    console.log("\n✅ Success! To get started:");
    console.log(`  cd ${commandOrName}`);
    console.log("  npm run dev");
  } catch (error) {
    console.error("❌ Failed to create project:", error);
    process.exit(1);
  }
}
