import { ReactNode, HTMLAttributes } from "react";

type FontSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";
type LineHeight = "default" | "squished";
type FontFamily = "header" | "ui";
type Baseline = "grid" | "center";
type As =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "label"
  | "strong"
  | "em";

interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  children: ReactNode;
  size?: FontSize;
  lineHeight?: LineHeight;
  baseline?: Baseline | false;
  debug?: boolean;
  as?: As;
  className?: string;
  weight?: "lighter" | "normal" | "bolder";
  family?: FontFamily;
}

/**
 * Typography component using the EDS 2.0 typography system from @equinor/eds-tokens
 *
 * Implements a data-attribute driven sizing system with:
 * - Baseline grid text alignment
 * - Font family selection (header or ui)
 * - Font size, weight, and line height controls
 *
 * @example
 * // Basic usage
 * <Typography size="md">Body text</Typography>
 *
 * @example
 * // With all props
 * <Typography
 *   size="lg"
 *   lineHeight="squished"
 *   baseline="center"
 *   weight="bolder"
 *   family="header"
 *   as="h2"
 * >
 *   Heading
 * </Typography>
 */
export function Typography({
  children,
  size = "lg",
  lineHeight = "default",
  baseline = "grid",
  debug = false,
  as: Component = "p",
  className = "",
  weight = "normal",
  family = "ui",
  style,
  ...props
}: TypographyProps) {
  // Build data attributes based on props using EDS tokens system
  const dataAttributes = {
    "data-font-family": family,
    "data-font-size": size,
    "data-font-weight": weight,
    "data-line-height": lineHeight,
    ...(baseline && { "data-baseline": baseline }),
    ...(debug && { "data-debug": "" }),
  };

  return (
    <Component
      className={className || undefined}
      style={style}
      {...dataAttributes}
      {...props}
    >
      {children}
    </Component>
  );
}

// ============================================
// Preset components for common use cases
// ============================================

interface HeadingProps extends Omit<TypographyProps, "as"> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Heading component for headings (H1-H6)
 *
 * Defaults to normal weight and squished line-height for compact headings
 * Uses "header" font family (Equinor) by default
 *
 * @example
 * <Heading level={1}>Main heading</Heading>
 * <Heading level={2} weight="bolder">Subheading</Heading>
 */
export function Heading({
  level = 1,
  size = "lg",
  lineHeight = "squished",
  weight = "normal",
  family = "header",
  ...props
}: HeadingProps) {
  return (
    <Typography
      as={`h${level}` as As}
      size={size}
      lineHeight={lineHeight}
      weight={weight}
      family={family}
      {...props}
    />
  );
}

/**
 * Body component for body text
 *
 * Uses large size (16px) by default with default line-height
 * Uses "ui" font family (Inter) by default
 *
 * @example
 * <Body>This is a regular text paragraph</Body>
 * <Body size="lg">Larger body text</Body>
 */
export function Body({
  children,
  size = "lg",
  ...props
}: Omit<TypographyProps, "as">) {
  return (
    <Typography as="p" size={size} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Caption component for helper text and secondary information
 *
 * Uses medium size (14px) by default
 *
 * @example
 * <Caption>Last updated: September 29, 2025</Caption>
 */
export function Caption({
  children,
  size = "md",
  ...props
}: Omit<TypographyProps, "as">) {
  return (
    <Typography as="span" size={size} {...props}>
      {children}
    </Typography>
  );
}

/**
 * Label component for form labels and tags
 *
 * Uses small size (12px) by default with bolder weight
 * Uses "center" baseline for better optical centering in UI components
 *
 * @example
 * <Label htmlFor="email">Email address</Label>
 */
export function Label({
  children,
  size = "sm",
  baseline = "center",
  weight = "bolder",
  ...props
}: Omit<TypographyProps, "as">) {
  return (
    <Typography
      as="label"
      size={size}
      baseline={baseline}
      weight={weight}
      {...props}
    >
      {children}
    </Typography>
  );
}

/**
 * Strong component for emphasized text
 *
 * Uses bolder weight by default
 *
 * @example
 * <Strong>Important information</Strong>
 */
export function Strong({
  children,
  weight = "bolder",
  ...props
}: Omit<TypographyProps, "as">) {
  return (
    <Typography as="strong" weight={weight} {...props}>
      {children}
    </Typography>
  );
}
