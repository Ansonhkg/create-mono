import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packagesDir = path.join(__dirname, "../packages");

const packageDirs = fs
  .readdirSync(packagesDir)
  .filter((file) => fs.statSync(path.join(packagesDir, file)).isDirectory());

packageDirs.forEach((packageDir) => {
  console.log(`🧹 Cleaning package "${packageDir}"...`);
  const distDir = path.join(packagesDir, packageDir, "dist");
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log(`Deleted dist directory for package "${packageDir}"`);
  }

  // scan for all .d.ts files
  const dtsFiles = fs
    .readdirSync(path.join(packagesDir, packageDir))
    .filter((file) => file.endsWith(".d.ts"));

  // delete all .d.ts files
  for (const dtsFile of dtsFiles) {
    fs.rmSync(path.join(packagesDir, packageDir, dtsFile));
  }
});
