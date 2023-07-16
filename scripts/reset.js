const fs = require("fs");
const path = require("path");

const packagesDir = path.join(__dirname, "../packages");

const packageDirs = fs
  .readdirSync(packagesDir)
  .filter((file) => fs.statSync(path.join(packagesDir, file)).isDirectory());

packageDirs.forEach((packageDir) => {
  const distDir = path.join(packagesDir, packageDir, "dist");
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log(`Deleted dist directory for package "${packageDir}"`);
  }
});

fs.rmSync(path.join(__dirname, "../yarn.lock"), { force: true });
fs.rmSync(path.join(__dirname, "../node_modules"), { recursive: true, force: true });