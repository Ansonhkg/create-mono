const esbuild = require("esbuild");
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

packageDirs.forEach(async (packageDir) => {
  console.log(`\nBuilding package "${packageDir}"...`);

  try {
    console.log(
      `Bundling package "${packageDir}" into CommonJS with esbuild...`
    );
    await esbuild.build({
      entryPoints: [path.join(packagesDir, packageDir, "index.js")],
      bundle: true,
      format: "cjs",
      outfile: path.join(packagesDir, packageDir, "dist", "cjs", "index.js"),
      // external: Object.keys(rootPackageJson.dependencies || {}),
      logLevel: "info",
    });

    console.log(
      `Bundling package "${packageDir}" into ECMAScript Module with esbuild...`
    );
    await esbuild.build({
      entryPoints: [path.join(packagesDir, packageDir, "index.js")],
      bundle: true,
      format: "esm",
      outfile: path.join(packagesDir, packageDir, "dist", "esm", "index.js"),
      // external: Object.keys(rootPackageJson.dependencies || {}),
      logLevel: "info",
    });

    console.log(`Bundling of package "${packageDir}" completed.`);

    console.log(`Writing package.json for package "${packageDir}"...`);
    const packageJsonContent = {
      name: `@${rootPackageJson.name}/${packageDir}`,
      version: rootPackageJson.version,
      main: "./cjs/index.js",
      module: "./esm/index.js",
      types: "./index.d.ts",
    };

    fs.writeFileSync(
      path.join(packagesDir, packageDir, "dist", "package.json"),
      JSON.stringify(packageJsonContent, null, 2)
    );

    console.log(`Package.json written for package "${packageDir}".`);
  } catch (err) {
    console.error(
      `Error occurred while building package "${packageDir}":`,
      err
    );
  }
});

console.log("\nBuild process completed.");
