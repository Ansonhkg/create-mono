const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Resolve the packages directory
const packagesDir = path.resolve(__dirname, "../packages");

// Get all directories inside the packages directory
let packageDirs = fs
  .readdirSync(packagesDir)
  .filter((file) => fs.statSync(path.join(packagesDir, file)).isDirectory());

// Check if a specific package was provided as an argument
const specificPackage = process.argv[2];
if (specificPackage) {
  if (packageDirs.includes(specificPackage)) {
    packageDirs = [specificPackage];
  } else {
    console.error(`Package ${specificPackage} not found.`);
    process.exit(1);
  }
}

// Navigate to each package's dist directory and execute npm publish
packageDirs.forEach((packageDir) => {
  const distDir = path.join(packagesDir, packageDir, "dist");

  // Only try to publish if the dist directory exists
  if (fs.existsSync(distDir)) {
    console.log(`Publishing ${packageDir}...`);
    execSync("npm publish --access=public", { cwd: distDir, stdio: "inherit" });
    console.log(`Published ${packageDir}`);
  }
});
