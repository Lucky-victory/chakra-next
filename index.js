const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const readline = require('readline');
const { execSync } = require('child_process');

function checkChakraUIInstalled() {
  try {
    require.resolve('@chakra-ui/react');
    return true;
  } catch (error) {
    console.log('Chakra UI is not installed. Installing...');
    return false;
  }
}

function detectPackageManager() {
  if (fs.existsSync('yarn.lock')) {
    return 'yarn';
  } else if (fs.existsSync('pnpm-lock.yaml')) {
    return 'pnpm';
  } else {
    return 'npm';
  }
}

function installChakraUI() {
  const packageManager = detectPackageManager();
  const installCommand = {
    npm: 'npm install',
    yarn: 'yarn add',
    pnpm: 'pnpm add'
  }[packageManager];

  try {
    execSync(`${installCommand} @chakra-ui/react @emotion/react @emotion/styled framer-motion`, { stdio: 'inherit' });
    console.log('Chakra UI has been successfully installed.');
  } catch (error) {
    console.error('Failed to install Chakra UI:', error.message);
    process.exit(1);
  }
}

function getComponentFamily(componentName) {
  const families = {
    Menu: ["Menu", "MenuButton", "MenuList", "MenuItem", "MenuItemOption", "MenuGroup", "MenuOptionGroup", "MenuDivider"],
    Popover: ["Popover", "PopoverTrigger", "PopoverContent", "PopoverHeader", "PopoverBody", "PopoverFooter", "PopoverArrow", "PopoverCloseButton"],
    Modal: ["Modal", "ModalOverlay", "ModalContent", "ModalHeader", "ModalFooter", "ModalBody", "ModalCloseButton"],
    Tabs: ["Tabs", "TabList", "Tab", "TabPanels", "TabPanel"],
    Accordion: ["Accordion", "AccordionItem", "AccordionButton", "AccordionPanel", "AccordionIcon"],
    Form: ["FormControl", "FormLabel", "FormErrorMessage", "FormHelperText"],
    Table: ["Table", "Thead", "Tbody", "Tfoot", "Tr", "Th", "Td", "TableCaption", "TableContainer"],
    List: ["List", "ListItem", "ListIcon", "OrderedList", "UnorderedList"],
    Breadcrumb: ["Breadcrumb", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbSeparator"],
    Stat: ["Stat", "StatLabel", "StatNumber", "StatHelpText", "StatArrow", "StatGroup"],
    Card: ["Card", "CardHeader", "CardBody", "CardFooter"],
    Skeleton: ["Skeleton", "SkeletonCircle", "SkeletonText"],
    NumberInput: ["NumberInput", "NumberInputField", "NumberInputStepper", "NumberIncrementStepper", "NumberDecrementStepper"],
  };

  for (const [family, components] of Object.entries(families)) {
    if (components.includes(componentName) || componentName===family) {
      return components;
    }
  }

  return [componentName];
}

function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

function exportComponent(componentName, outputDir, fileExtension) {
  const components = getComponentFamily(componentName);
  const filePath = path.join(outputDir, `${componentName}.${fileExtension}`);
  
  const content = `'use client'\n\nexport { ${components.join(', ')} } from '@chakra-ui/react'\n`;
  
  fs.writeFileSync(filePath, content);
  console.log(`Exported ${components.join(', ')} to ${filePath}`);
}

function validateComponentName(name) {
  return /^[A-Z][a-zA-Z]*$/.test(name);
}

function promptForComponentName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Please enter a valid component name (starting with an uppercase letter and containing only letters): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function processComponent(component, outputDir, fileExtension) {
  let componentName = component;
  while (!validateComponentName(componentName)) {
    console.log('Invalid component name. It must start with an uppercase letter and contain only letters.');
    componentName = await promptForComponentName();
  }
  exportComponent(componentName, outputDir, fileExtension);
}

program
  .name('chakra-next')
  .description('Exports Chakra UI components to separate files and adds a top-level "use client" directive to make it usable with NextJS App router')
  .argument('[components...]', 'Names of the component(s) to export')
  .option('-o, --output <dir>', 'Output directory for component files', 'components/ui')
  .option('-e, --extension <ext>', 'File extension for component files (tsx or jsx)', 'tsx')
  .action(async (components, options) => {
    if (!checkChakraUIInstalled()) {
      installChakraUI();
    }

    const outputDir = path.resolve(options.output);
    const fileExtension = options.extension === 'jsx' ? 'jsx' : 'tsx';
    createDirectoryIfNotExists(outputDir);

    if (components.length === 0) {
      const componentName = await promptForComponentName();
      components.push(componentName);
    }

    for (const component of components) {
      await processComponent(component, outputDir, fileExtension);
    }
  });

program.parse();
