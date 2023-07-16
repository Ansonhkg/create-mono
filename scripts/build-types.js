const fs = require("fs");
const path = require("path");

console.log("Reading root package.json...");
const rootPackageJson = require(path.resolve(__dirname, "../package.json"));

console.log("Resolving packages directory...");
const packagesDir = path.join(__dirname, "../packages");

console.log("Reading package directories...");
const packageDirs = fs
  .readdirSync(packagesDir)
  .filter((file) => fs.statSync(path.join(packagesDir, file)).isDirectory());

console.log(`Found ${packageDirs.length} package directories:`, packageDirs);

packageDirs.forEach((packageDir) => {
  console.log(`\nCreating types for package "${packageDir}"...`);

  try {
    // Create /dist/types directory if it doesn't exist
    const typesDir = path.join(packagesDir, packageDir, "dist", "types");
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }

    // Move all .d.ts files into /dist/types
    const dtsFiles = fs
      .readdirSync(path.join(packagesDir, packageDir))
      .filter((file) => file.endsWith(".d.ts"));
    for (const dtsFile of dtsFiles) {
      fs.renameSync(
        path.join(packagesDir, packageDir, dtsFile),
        path.join(typesDir, dtsFile)
      );
    }

    // Create /dist/index.d.ts that exports all types
    const exportedTypes = dtsFiles
      .map(
        (dtsFile) => `export * from './types/${dtsFile.replace(".d.ts", "")}';`
      )
      .join("\n");

    fs.writeFileSync(
      path.join(packagesDir, packageDir, "dist", "index.d.ts"),
      exportedTypes
    );

    console.log(`Types created for package "${packageDir}".`);
  } catch (err) {
    console.error(
      `Error occurred while creating types for package "${packageDir}":`,
      err
    );
  }
});

console.log("\nTypes creation process completed.");
