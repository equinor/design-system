import { ReactNode, HTMLAttributes, CSSProperties } from "react";

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
type LineHeight = "normal" | "squished";
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
  isBaselineAligned?: boolean;
  debug?: boolean;
  as?: As;
  className?: string;
  weight?: "lighter" | "normal" | "bolder";
}

/**
 * Typography component using the EDS 2.0 typography system
 *
 * Implements a data-attribute driven sizing system with:
 * - Baseline grid text alignment
 * - Space toggle based CSS custom properties
 * - Ratio-based padding calculations for optical alignment
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
 *   isBaselineAligned={false}
 *   weight="semibold"
 *   as="h2"
 * >
 *   Heading
 * </Typography>
 */
export function Typography({
  children,
  size = "lg",
  lineHeight = "normal",
  isBaselineAligned = true,
  debug = false,
  as: Component = "p",
  className = "",
  weight,
  style,
  ...props
}: TypographyProps) {
  // Build data attributes based on props
  const dataAttributes = {
    "data-font-size": size,
    "data-line-height": lineHeight,
    "data-baseline-aligned": isBaselineAligned,
    ...(debug && { "data-debug": "" }),
  };

  // Add font-weight if specified
  const fontWeights = {
    lighter: 300,
    normal: 400,
    bolder: 500,
  };

  const computedStyle: CSSProperties = {
    ...style,
    ...(weight && { fontWeight: fontWeights[weight] }),
  };

  return (
    <Component
      className={`type ${className}`}
      style={computedStyle}
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
 * TODO: Consider default settings (these are just suggestions for the demo page)
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
  ...props
}: HeadingProps) {
  return (
    <Typography
      as={`h${level}` as As}
      size={size}
      lineHeight={lineHeight}
      weight={weight}
      {...props}
    />
  );
}

/**
 * Body component for body text
 *
 * Uses large size (16px) by default with normal line-height
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
 * Uses small size (12px) by default
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
 * Uses extra small size (12px) by default with bolder weight
 * Not baseline-aligned for better optical centering in UI components
 *
 * @example
 * <Label htmlFor="email">Email address</Label>
 */
export function Label({
  children,
  size = "sm",
  isBaselineAligned = false,
  weight = "bolder",
  ...props
}: Omit<TypographyProps, "as">) {
  return (
    <Typography
      as="label"
      size={size}
      isBaselineAligned={isBaselineAligned}
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
 * Uses semibold weight by default
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
