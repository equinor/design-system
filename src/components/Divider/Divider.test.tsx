import React from "react";
import { render, screen } from "test-utils";
import { Divider } from "./index";

describe("Divider", () => {
    it("renders", () => {
        render(<Divider testID="divider" />);
        expect(screen.getByTestId("divider")).toBeTruthy();
    });

    it("is hidden from assistive technology", () => {
        render(<Divider testID="divider" />);
        const divider = screen.getByTestId("divider");
        expect(divider).toHaveProp("accessible", false);
        expect(divider).toHaveProp("importantForAccessibility", "no");
    });

    it("forwards additional view props", () => {
        render(<Divider testID="divider" style={{ marginVertical: 8 }} />);
        expect(screen.getByTestId("divider")).toHaveStyle({
            marginVertical: 8,
        });
    });
});
