import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Reading root package.json...");
const rootPackageJson = path.resolve(__dirname, "../package.json");

console.log("Resolving packages directory...");
const packagesDir = path.join(__dirname, "../packages");

console.log("Reading package directories...");
const packageDirs = fs
  .readdirSync(packagesDir)
  .filter((file) => fs.statSync(path.join(packagesDir, file)).isDirectory());

console.log(`Found ${packageDirs.length} package directories:`, packageDirs);

packageDirs.forEach(async (packageDir) => {
  console.log(`\nBuilding package "${packageDir}"...`);

  // try to read pkg.json
  const pkgJson = path.join(packagesDir, packageDir, "pkg.json");

  let pkgJsonContent = null;

  if (fs.existsSync(pkgJson)) {
    console.log(`Found pkg.json for package "${packageDir}".`);
    console.log(`Reading pkg.json for package "${packageDir}"...`);
    pkgJsonContent = JSON.parse(fs.readFileSync(pkgJson, "utf8"));
  }

  try {
    console.log(
      `Bundling package "${packageDir}" into CommonJS with esbuild...`
    );
    await esbuild.build({
      entryPoints: [path.join(packagesDir, packageDir, "index.js")],
      bundle: true,
      format: "cjs",
      outfile: path.join(packagesDir, packageDir, "dist", "cjs", "index.js"),
      logLevel: "info",
      ...(pkgJsonContent !== null && {
        platform: pkgJsonContent["create-mono"].platform,
      }),
    });

    console.log(
      `Bundling package "${packageDir}" into ECMAScript Module with esbuild...`
    );
    await esbuild.build({
      entryPoints: [path.join(packagesDir, packageDir, "index.js")],
      bundle: true,
      format: "esm",
      outfile: path.join(packagesDir, packageDir, "dist", "esm", "index.js"),
      logLevel: "info",
      ...(pkgJsonContent !== null && {
        platform: pkgJsonContent["create-mono"].platform,
      }),
    });

    console.log(`Bundling of package "${packageDir}" completed.`);

    console.log(`Writing package.json for package "${packageDir}"...`);
    const packageJsonContent = {
      name: `@${rootPackageJson.name}/${packageDir}`,
      version: rootPackageJson.version,
      main: "./cjs/index.js",
      module: "./esm/index.js",
      types: "./index.d.ts",
      ...(pkgJsonContent !== null && {
        platform: pkgJsonContent["create-mono"].platform,
      }),
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
