# chakra-next

`chakra-next` is a command-line tool that exports Chakra UI components to separate files, sets up Chakra UI configuration, and ensures compatibility with App Router. This tool streamlines the process of organizing and preparing Chakra UI components for use in Next.js projects.

## Features

- Exports individual Chakra UI components to separate files
- Automatically adds the "use client" directive for Next.js App Router compatibility
- Supports exporting entire component families (e.g., Menu, Modal, Tabs)
- Customizable output directory and file extension
- Sets up Chakra UI configuration and provider
- Supports both TypeScript and JavaScript projects
- Configures for both App Router and Pages Router

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

- `-o, --output <dir>`: Specify the output directory for components (default: "components/ui")
- `-e, --extension <ext>`: Specify the file extension (default: "tsx", options: "tsx" or "jsx")
- `--init`: Initialize Chakra UI setup without exporting components

Examples:

```bash
# Initialize Chakra UI setup
chakra-next --init

# Export a single component
chakra-next Button

# Export multiple components
chakra-next Button Menu Modal

# Specify output directory and file extension
chakra-next Button -o src/components -e jsx
```

If you run the command without specifying component names or with the `--init` flag, you'll be guided through the Chakra UI setup process.

### Setup Process

When initializing or running without arguments, the script will:

1. Prompt you about TypeScript usage
2. Ask if you're using the Next.js App Router
3. Create or update a theme file in `lib/theme.(ts|js)`
4. Set up a Chakra provider in `providers/chakra-provider.(tsx|jsx)`
5. For App Router users, update the layout file to include the provider

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

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/your-username/chakra-next/issues).