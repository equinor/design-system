import { EDSStyleSheet } from "../../styling";
import { TypographySizeToken, TypographyToken } from "../../styling/tokens";
import { TypographyStyleProps } from "./types";

type TypographyGroupStyleProps<TGroup extends keyof TypographyToken> = {
    size: keyof TypographyToken[TGroup]["fontFamilySize"];
} & TypographyStyleProps;

export function createTypographyStyles<TGroup extends keyof TypographyToken>(
    group: TGroup
) {
    return EDSStyleSheet.create(
        (
            token,
            {
                size,
                weight,
                lineHeight,
                tracking,
            }: TypographyGroupStyleProps<TGroup>
        ) => {
            const fontFamilySize = token.typography[group]
                .fontFamilySize as Record<string, TypographySizeToken>;
            const sizeToken = fontFamilySize[size as string];

            return {
                text: {
                    fontFamily:
                        token.typography[group].typography.fontFamily,
                    fontSize: sizeToken.fontSize,
                    fontWeight: sizeToken.fontWeight[weight],
                    lineHeight: sizeToken.lineHeight[lineHeight],
                    letterSpacing: sizeToken.tracking[tracking],
                    color: token.colors.text.neutral.strong,
                },
            };
        }
    );
}
