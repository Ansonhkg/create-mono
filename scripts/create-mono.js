#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const projectName = process.argv[2] || "my-monorepo";

const templatePath = path.join(__dirname, "../");
const destinationPath = path.resolve(process.cwd(), projectName);

console.log(`Creating monorepo at ${destinationPath}`);

// Function to copy directory content recursively
const copyDir = (src, dest) => {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

try {
  copyDir(templatePath, destinationPath);

  console.log("🎉 Monorepo created successfully!");

  // Change directory to the newly created monorepo
  process.chdir(destinationPath);

  // Update package.json to mark it as private and rename it
  const packageJsonPath = path.join(destinationPath, "package.json");
  const packageJson = require(packageJsonPath);
  packageJson.private = true;
  packageJson.name = projectName;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Create .gitignore file
  fs.writeFileSync(
    path.join(destinationPath, ".gitignore"),
    "node_modules\npackages/*/dist\n.gitignore\nyarn-error.log\nyarn.lock\n.DS_Store\n",
    "utf8"
  );

  // Install dependencies
  console.log("Installing dependencies...");
  execSync("yarn install", { stdio: "inherit" });

  console.log("Done!");
} catch (err) {
  console.error("Error creating monorepo:", err);
  process.exit(1);
}
