import React from "react";
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
    it("renders its children", () => {
        render(
            <EDSProvider colorScheme="light" density="comfortable">
                <Text>Hello world</Text>
            </EDSProvider>
        );
        expect(screen.getByText("Hello world")).toBeTruthy();
    });

    it("resolves the light color token for colorScheme=light", () => {
        const onToken = jest.fn();
        render(
            <EDSProvider colorScheme="light" density="comfortable">
                <TokenSpy onToken={onToken} />
            </EDSProvider>
        );
        expect(onToken).toHaveBeenCalledWith(
            expect.objectContaining({ colors: lightColorToken })
        );
    });

    it("resolves the dark color token for colorScheme=dark", () => {
        const onToken = jest.fn();
        render(
            <EDSProvider colorScheme="dark" density="comfortable">
                <TokenSpy onToken={onToken} />
            </EDSProvider>
        );
        expect(onToken).toHaveBeenCalledWith(
            expect.objectContaining({ colors: darkColorToken })
        );
    });

    it("resolves the comfortable spacing token for density=comfortable", () => {
        const onToken = jest.fn();
        render(
            <EDSProvider colorScheme="light" density="comfortable">
                <TokenSpy onToken={onToken} />
            </EDSProvider>
        );
        expect(onToken).toHaveBeenCalledWith(
            expect.objectContaining({ spacing: comfortableSpacingToken })
        );
    });

    it("resolves the spacious spacing token for density=spacious", () => {
        const onToken = jest.fn();
        render(
            <EDSProvider colorScheme="light" density="spacious">
                <TokenSpy onToken={onToken} />
            </EDSProvider>
        );
        expect(onToken).toHaveBeenCalledWith(
            expect.objectContaining({ spacing: spaciousSpacingToken })
        );
    });

    it("throws from useToken when used outside of an EDSProvider", () => {
        // Expected: React logs the thrown error to the console during render.
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => undefined);
        expect(() => render(<TokenSpy onToken={jest.fn()} />)).toThrow(
            "useToken must be called within a EDSProvider"
        );
        consoleError.mockRestore();
    });
});
