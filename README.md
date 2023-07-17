# Create Mono

`create-mono` is NOT a monorepo. It's a build script that builds each module into its own bundle, including its dependencies. The script automatically injects a package.json file into the `./dist` folder for each module. The package.json name is named by prepending the root package.json name as a namespace followed by the module name (e.g., `@root/moduleA`).

## Scripts

| Script Name      | Description                                                                                                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clean.js`       | Scans for all ./packages/\*/dist folders and .d.ts files and deletes them.                                                                                                                                                                                                         |
| `build-types.js` | Creates a /dist/types directory if it doesn't exist. Moves all .d.ts files into /dist/types. Creates a /dist/index.d.ts that exports all types.                                                                                                                                    |
| `reset.js`       | This script appears to perform some sort of reset operation. The specifics are not clear from the script content.                                                                                                                                                                  |
| `bump.js`        | Reads the current version from package.json. Asks the user for the new version and defaults to patch if no input is provided. Updates and saves the new version to package.json.                                                                                                   |
| `create-mono.js` | Contains a function to copy directory content recursively. Creates the destination directory if it doesn't exist. Changes the directory to the newly created monorepo. Updates package.json to mark it as private and rename it. Creates a .gitignore file. Installs dependencies. |
| `publish.js`     | Resolves the packages directory. Gets all directories inside the packages directory. Checks if a specific package was provided as an argument. Navigates to each package's dist directory and executes npm publish. Only tries to publish if the dist directory exists.            |
| `build.js`       | This script appears to be dealing with dependencies in the rootPackageJson. It may be used to build the project, but the specific actions aren't clear from the available comments and function names.                                                                             |

## Usage

```
npx create-mono <project_name>
```

## Contribution

Contributions, issues, and feature requests are welcome!

## License

This project is licensed under the [MIT License](LICENSE).
