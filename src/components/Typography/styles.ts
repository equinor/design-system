import { EDSStyleSheet } from "../../styling";
import { TypographySizeToken, TypographyToken } from "../../styling/tokens";
import { TypographyStyleProps } from "./types";
import { PROP_TOKEN_FIELD_MAP } from "./utility";

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
            const fontFamilySize = token.newTypography[group]
                .fontFamilySize as Record<string, TypographySizeToken>;
            const sizeToken = fontFamilySize[size as string];

            return {
                text: {
                    fontFamily:
                        token.newTypography[group].typography.fontFamily,
                    fontSize: sizeToken.fontSize,
                    fontWeight: sizeToken[PROP_TOKEN_FIELD_MAP.weight[weight]],
                    lineHeight:
                        sizeToken[PROP_TOKEN_FIELD_MAP.lineHeight[lineHeight]],
                    letterSpacing:
                        sizeToken[PROP_TOKEN_FIELD_MAP.tracking[tracking]],
                    color: token.newColors.text.neutral.strong,
                },
            };
        }
    );
}
