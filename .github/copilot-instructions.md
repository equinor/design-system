# GitHub Copilot Instructions for Equinor Design System

## Project Overview

This monorepo contains Equinor's Design System (EDS) - a component library and design tokens that implement Equinor's design language. The design system consists of multiple packages, including:

- `@equinor/eds-core-react`: Core React components
- `@equinor/eds-tokens`: Design tokens and variables
- `@equinor/eds-icons`: Icon library
- `@equinor/eds-lab-react`: Experimental components
- `@equinor/eds-data-grid-react`: Data grid component

Apply the [global coding guidelines](./instructions/global-coding.instructions.md).
Apply the [typeScript guidelines](./instructions/ts.instructions.md).
Apply the [react guidelines](./instructions/react.instructions.md).
Apply the [styling guidelines](./instructions/styling.instructions.md).
Apply the [create component from figma instructions](./instructions/figma.instructions.md).

## Testing Requirements

- All components and features should be thoroughly tested
- All components should have appropriate unit tests using Jest
- Visual regression tests should be included where applicable
- Test accessibility features explicitly
- Include test cases for edge cases and error states

## Documentation

- All components should have Storybook stories
- Include usage examples in documentation
- Document all props, including types and default values
- Add information about accessibility features
- Provide guidance on common patterns and implementation details

## PR and Code Review Process

- Use conventional commits for commit messages
- PRs should include tests and documentation
- Link relevant Figma designs when applicable
- Ensure changes pass all CI checks
