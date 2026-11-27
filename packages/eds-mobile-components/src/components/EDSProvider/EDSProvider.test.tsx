import React from "react";
import { theme as darkComfortableTheme } from "@equinor/eds-tokens/next/ts/dark-comfortable";
import { theme as darkCompactTheme } from "@equinor/eds-tokens/next/ts/dark-compact";
import { theme as lightComfortableTheme } from "@equinor/eds-tokens/next/ts/light-comfortable";
import { theme as lightCompactTheme } from "@equinor/eds-tokens/next/ts/light-compact";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { useToken } from "../../hooks/useToken";
import {
    comfortableSpacingToken,
    darkColorToken,
    lightColorToken,
    spaciousSpacingToken,
} from "../../styling/tokens";
import { EDSProvider } from "./index";

const TokenSpy = ({ onToken }: { onToken: (token: unknown) => void }) => {
    const token = useToken();
    onToken(token);
    return null;
};

describe("EDSProvider", () => {
    it("renders its children", async () => {
        await render(
            <EDSProvider colorScheme="light" density="comfortable">
                <Text>Hello world</Text>
            </EDSProvider>
        );
        expect(screen.getByText("Hello world")).toBeTruthy();
    });

    it("resolves the light color token for colorScheme=light", async () => {
        const onToken = jest.fn();
        await render(
            <EDSProvider colorScheme="light" density="comfortable">
                <TokenSpy onToken={onToken} />
            </EDSProvider>
        );
        expect(onToken).toHaveBeenCalledWith(
            expect.objectContaining({ colors: lightColorToken })
        );
    });

    it("resolves the dark color token for colorScheme=dark", async () => {
        const onToken = jest.fn();
        await render(
            <EDSProvider colorScheme="dark" density="comfortable">
                <TokenSpy onToken={onToken} />
            </EDSProvider>
        );
        expect(onToken).toHaveBeenCalledWith(
            expect.objectContaining({ colors: darkColorToken })
        );
    });

    it("resolves the comfortable spacing token for density=comfortable", async () => {
        const onToken = jest.fn();
        await render(
            <EDSProvider colorScheme="light" density="comfortable">
                <TokenSpy onToken={onToken} />
            </EDSProvider>
        );
        expect(onToken).toHaveBeenCalledWith(
            expect.objectContaining({ spacing: comfortableSpacingToken })
        );
    });

    it("resolves the spacious spacing token for density=spacious", async () => {
        const onToken = jest.fn();
        await render(
            <EDSProvider colorScheme="light" density="spacious">
                <TokenSpy onToken={onToken} />
            </EDSProvider>
        );
        expect(onToken).toHaveBeenCalledWith(
            expect.objectContaining({ spacing: spaciousSpacingToken })
        );
    });

    describe("theme token", () => {
        // The provider's `comfortable` density is the export's `compact`,
        // and the provider's `spacious` density is the export's `comfortable`.
        it.each([
            ["light", "comfortable", lightCompactTheme],
            ["light", "spacious", lightComfortableTheme],
            ["dark", "comfortable", darkCompactTheme],
            ["dark", "spacious", darkComfortableTheme],
        ] as const)(
            "resolves the %s theme for density=%s",
            async (colorScheme, density, expectedTheme) => {
                const onToken = jest.fn();
                await render(
                    <EDSProvider colorScheme={colorScheme} density={density}>
                        <TokenSpy onToken={onToken} />
                    </EDSProvider>
                );
                expect(onToken).toHaveBeenCalledWith(
                    expect.objectContaining({ theme: expectedTheme })
                );
            }
        );

        it("keeps the old color, spacing and typography tokens next to the theme", async () => {
            const onToken = jest.fn();
            await render(
                <EDSProvider colorScheme="light" density="comfortable">
                    <TokenSpy onToken={onToken} />
                </EDSProvider>
            );
            expect(onToken).toHaveBeenCalledWith(
                expect.objectContaining({
                    colors: lightColorToken,
                    spacing: comfortableSpacingToken,
                    theme: lightCompactTheme,
                })
            );
        });
    });

    it("throws from useToken when used outside of an EDSProvider", async () => {
        // Expected: React logs the thrown error to the console during render.
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => undefined);
        await expect(render(<TokenSpy onToken={jest.fn()} />)).rejects.toThrow(
            "useToken must be called within a EDSProvider"
        );
        consoleError.mockRestore();
    });
});
