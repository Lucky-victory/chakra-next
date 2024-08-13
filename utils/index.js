const fs = require("fs");
function getComponentFamily(componentName) {
  const families = {
    Menu: [
      "Menu",
      "MenuButton",
      "MenuList",
      "MenuItem",
      "MenuItemOption",
      "MenuGroup",
      "MenuOptionGroup",
      "MenuDivider",
    ],
    AlertDialog: [
      "AlertDialog",
      "AlertDialogBody",
      "AlertDialogFooter",
      "AlertDialogHeader",
      "AlertDialogContent",
      "AlertDialogOverlay",
      "AlertDialogCloseButton",
    ],
    Popover: [
      "Popover",
      "PopoverTrigger",
      "PopoverContent",
      "PopoverHeader",
      "PopoverBody",
      "PopoverFooter",
      "PopoverArrow",
      "PopoverCloseButton",
    ],
    Modal: [
      "Modal",
      "ModalOverlay",
      "ModalContent",
      "ModalHeader",
      "ModalFooter",
      "ModalBody",
      "ModalCloseButton",
    ],
    Tabs: ["Tabs", "TabList", "Tab", "TabPanels", "TabPanel"],

    Avatar: ["Avatar", "AvatarBadge", "AvatarGroup"],
    Accordion: [
      "Accordion",
      "AccordionItem",
      "AccordionButton",
      "AccordionPanel",
      "AccordionIcon",
    ],
    Stepper: [
      "Step",
      "StepDescription",
      "StepIcon",
      "StepIndicator",
      "StepNumber",
      "StepSeparator",
      "StepStatus",
      "StepTitle",
      "Stepper",
      "useSteps",
    ],
    Form: ["FormControl", "FormLabel", "FormErrorMessage", "FormHelperText"],
    Table: [
      "Table",
      "Thead",
      "Tbody",
      "Tfoot",
      "Tr",
      "Th",
      "Td",
      "TableCaption",
      "TableContainer",
    ],
    List: ["List", "ListItem", "ListIcon", "OrderedList", "UnorderedList"],
    Breadcrumb: [
      "Breadcrumb",
      "BreadcrumbItem",
      "BreadcrumbLink",
      "BreadcrumbSeparator",
    ],
    Stat: [
      "Stat",
      "StatLabel",
      "StatNumber",
      "StatHelpText",
      "StatArrow",
      "StatGroup",
    ],
    Card: ["Card", "CardHeader", "CardBody", "CardFooter"],
    Skeleton: ["Skeleton", "SkeletonCircle", "SkeletonText"],
    NumberInput: [
      "NumberInput",
      "NumberInputField",
      "NumberInputStepper",
      "NumberIncrementStepper",
      "NumberDecrementStepper",
    ],
    RangeSlider: [
      "RangeSlider",
      "RangeSliderTrack",
      "RangeSliderFilledTrack",
      "RangeSliderThumb",
    ],
    Wrap: ["Wrap", "WrapItem"],
    Slider: [
      "Slider",
      "SliderTrack",
      "SliderFilledTrack",
      "SliderThumb",
      "SliderMark",
    ],

    Input: [
      "Input",
      "InputGroup",
      "InputLeftAddon",
      "InputRightAddon",
      "InputLeftElement",
      "InputRightElement",
    ],
  };
  for (const [family, components] of Object.entries(families)) {
    if (components.includes(componentName) || componentName === family) {
      return components;
    }
  }

  return [componentName];
}

function checkChakraUIInstalled() {
  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return !!packageJson.dependencies["@chakra-ui/react"];
  } catch (error) {
    return false;
  }
}
function detectPackageManager() {
  if (fs.existsSync("yarn.lock")) {
    return "yarn";
  } else if (fs.existsSync("pnpm-lock.yaml")) {
    return "pnpm";
  } else {
    return "npm";
  }
}
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}
module.exports = {
  detectPackageManager,
  checkChakraUIInstalled,
  getComponentFamily,
  createDirectoryIfNotExists,
};
