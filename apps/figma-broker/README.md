# Figma broker

[Figma Developer Documentation](https://www.figma.com/developers/docs)

## Structure

Figma token:
`PAGE` -> `FRAME` -> `COMPONENT`

Figma style:
`PAGE` -> `FRAME` -> `INSTANCE` starting with `token-row` -> `RECTANGLE`

## Naming

We will use kebab-case (also called lisp-case) which uses hyphens as word seperator.

### Conversion across systems

| Figma                         | Token                          | CSS |
| ----------------------------- | ------------------------------ | --- |
| `Spacer Vertical / XXX Large` | `spacer-horizontal--xxx-large` | ?   |