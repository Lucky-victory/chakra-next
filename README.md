# chakra-next

`chakra-next` is a command-line tool that exports Chakra UI components to separate files and adds the top-level "use client" directive, making them compatible with Next.js App Router. This tool streamlines the process of organizing and preparing Chakra UI components for use in Next.js projects.

## Features

- Exports individual Chakra UI components to separate files
- Automatically adds the "use client" directive for Next.js App Router compatibility
- Supports exporting entire component families (e.g., Menu, Modal, Tabs)
- Customizable output directory and file extension

## Installation

You can install `chakra-next` globally using npm:

```bash
npm install -g chakra-next
```

Or, if you prefer to use it as a dev dependency in your project:

```bash
npm install --save-dev chakra-next
```

## Usage

### Command Line Interface

Basic usage:

```bash
chakra-next [component-names...]
```

Options:

- `-o, --output <dir>`: Specify the output directory (default: "components/ui")
- `-e, --extension <ext>`: Specify the file extension (default: "tsx", options: "tsx" or "jsx")

Examples:

```bash
# Export a single component
chakra-next Button

# Export multiple components
chakra-next Button Menu Modal

# Specify output directory and file extension
chakra-next Button -o src/components -e jsx
```

If you run the command without specifying component names, you'll be prompted to enter them interactively.

### Programmatic Usage

You can also use `chakra-next` programmatically in your Node.js scripts:

```javascript
const { exportComponent, createDirectoryIfNotExists } = require('chakra-next');

// Create the output directory if it doesn't exist
createDirectoryIfNotExists('components/ui');

// Export a component
exportComponent('Button', 'components/ui', 'tsx');
```

## API

### `exportComponent(componentName, outputDir, fileExtension)`

Exports a Chakra UI component to a separate file.

- `componentName` (string): Name of the component to export
- `outputDir` (string): Directory to output the component file
- `fileExtension` (string): File extension for the component file ("tsx" or "jsx")

### `createDirectoryIfNotExists(dirPath)`

Creates a directory if it doesn't already exist.

- `dirPath` (string): Path of the directory to create

### `getComponentFamily(componentName)`

Returns an array of related components for compound components.

- `componentName` (string): Name of the component to get the family for

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Chakra UI](https://chakra-ui.com/) for their excellent component library
- [Commander.js](https://github.com/tj/commander.js/) for the command-line interface

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/lucky-victory/chakra-next/issues).
