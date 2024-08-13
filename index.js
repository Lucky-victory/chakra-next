const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const readline = require("readline");
const { execSync } = require("child_process");
const {
  detectPackageManager,
  checkChakraUIInstalled,
  createDirectoryIfNotExists,
  getComponentFamily,
} = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function installChakraUI() {
  const packageManager = detectPackageManager();
  const installCommand = {
    npm: "npm install",
    yarn: "yarn add",
    pnpm: "pnpm add",
  }[packageManager];

  try {
    execSync(
      `${installCommand} @chakra-ui/react @chakra-ui/next-js @emotion/react @emotion/styled framer-motion`,
      { stdio: "inherit" }
    );
    console.log("Chakra UI has been successfully installed.");
  } catch (error) {
    console.error("Failed to install Chakra UI:", error.message);
    process.exit(1);
  }
}

function exportComponent(componentName, outputDir, fileExtension) {
  const components = getComponentFamily(componentName);
  const filePath = path.join(outputDir, `${componentName}.${fileExtension}`);

  const content = `'use client'

import { ${components.join(", ")} } from '@chakra-ui/react'

export { ${components.join(", ")} }
`;

  fs.writeFileSync(filePath, content);
  console.log(`Exported ${components.join(", ")} to ${filePath}✔️`);
}

function validateComponentName(name) {
  return /^[A-Z][a-zA-Z]*$/.test(name);
}

async function promptForComponentName() {
  let componentName;
  do {
    componentName = await prompt(
      "Please enter a valid chakra component name (e.g., Button, Input, etc.): "
    );
    if (!validateComponentName(componentName)) {
      console.log(
        "Invalid component name. It must start with an uppercase letter and contain only letters."
      );
    }
  } while (!validateComponentName(componentName));
  return componentName;
}

async function processComponent(component, outputDir, fileExtension) {
  let componentName = component;
  while (!validateComponentName(componentName)) {
    console.log(
      "Invalid component name. It must start with an uppercase letter and contain only letters."
    );
    componentName = await promptForComponentName();
  }
  exportComponent(componentName, outputDir, fileExtension);
}

async function setupChakraUI() {
  const isTypeScript =
    (await prompt("Are you using TypeScript? (y/n): ")).toLowerCase() === "y";
  const isUsingAppRouter =
    (await prompt("Are you using the App Router? (y/n): ")).toLowerCase() ===
    "y";
  const fileExtension = isTypeScript ? "ts" : "js";

  // Create/update lib/theme file
  const themeContent = `
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  // Add your custom theme configuration here
})

export default theme
`;

  const themeDir = path.join(process.cwd(), "lib");
  createDirectoryIfNotExists(themeDir);
  fs.writeFileSync(path.join(themeDir, `theme.${fileExtension}`), themeContent);
  console.log(`Created/updated lib/theme.${fileExtension}✅`);

  // Create ChakraProvider setup
  const providerContent = `${isUsingAppRouter ? "'use client'\n\n" : ""}
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../lib/theme'

export function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}
`;

  const providersDir = path.join(process.cwd(), "providers");
  createDirectoryIfNotExists(providersDir);
  fs.writeFileSync(
    path.join(providersDir, `chakra-provider.${fileExtension}x`),
    providerContent
  );
  console.log(`Created providers/chakra-provider.${fileExtension}x ✅`);

  // Update layout file if using App Router
  if (isUsingAppRouter) {
    const layoutPath = path.join(
      process.cwd(),
      "app",
      `layout.${fileExtension}x`
    );
    let layoutContent = fs.existsSync(layoutPath)
      ? fs.readFileSync(layoutPath, "utf-8")
      : "";

    if (!layoutContent.includes("Providers")) {
      const providerImport =
        "import { Providers } from '../providers/chakra-provider'\n";
      layoutContent = providerImport + layoutContent;

      layoutContent = layoutContent.replace(
        /return \(/,
        "return (\n    <Providers>"
      );

      layoutContent = layoutContent.replace(
        /(\s*)\)\s*$/,
        "$1  </Providers>\n$1)"
      );

      fs.writeFileSync(layoutPath, layoutContent);
      console.log(`Updated app/layout.${fileExtension}x ✅`);
    }
  } else {
    console.log(
      "Please manually wrap your app with the Providers component in your _app.js or _app.tsx file."
    );
  }

  rl.close();
}

program
  .name("chakra-next")
  .description("Exports Chakra UI components and sets up Chakra UI for NextJS")
  .argument("[components...]", "Names of the component(s) to export")
  .option(
    "-o, --output <dir>",
    "Output directory for component files",
    "components/ui"
  )
  .option(
    "-e, --extension <ext>",
    "File extension for component files (tsx or jsx)",
    "tsx"
  )
  .option("--init", "Initialize Chakra UI setup")
  .action(async (components, options) => {
    if (options.init || components.length === 0) {
      await setupChakraUI();
    }
    if (!checkChakraUIInstalled()) {
      installChakraUI();
    }

    if (components.length > 0) {
      const outputDir = path.resolve(options.output);
      const fileExtension = options.extension === "jsx" ? "jsx" : "tsx";
      createDirectoryIfNotExists(outputDir);

      for (const component of components) {
        await processComponent(component, outputDir, fileExtension);
      }
    }
  });

program.parse();
