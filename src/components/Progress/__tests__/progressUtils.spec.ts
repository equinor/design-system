import { summarizeStatuses } from "../progressUtils";
import { ProgressStatus } from "../types";

describe("summarizeStatuses", () => {
    it("should return error if there is an error in the statuses", () => {
        const statuses: ProgressStatus[] = ["error", "inProgress", "success", "notStarted"];
        const expectation: ProgressStatus = "error";

        const result = summarizeStatuses(statuses);

        expect(result).toBe(expectation);
    });

    it("should return inProgress if there is an inProgress in the statuses and no error", () => {
        const statuses: ProgressStatus[] = ["inProgress", "success", "notStarted"];
        const expectation: ProgressStatus = "inProgress";

        const result = summarizeStatuses(statuses);

        expect(result).toBe(expectation);
    });

    it("should return success if all statuses are success or removed", () => {
        const statuses: ProgressStatus[] = ["success", "success", "success"];
        const expectation: ProgressStatus = "success";

        const result = summarizeStatuses(statuses);

        expect(result).toBe(expectation);
    });

    it("should return notStarted if all statuses are notStarted", () => {
        const statuses: ProgressStatus[] = ["notStarted", "notStarted", "notStarted"];
        const expectation: ProgressStatus = "notStarted";

        const result = summarizeStatuses(statuses);

        expect(result).toBe(expectation);
    });

    it("should return inProgress if not all statuses are success or removed and there is no error", () => {
        const statuses: ProgressStatus[] = ["success", "notStarted"];
        const expectation: ProgressStatus = "inProgress";

        const result = summarizeStatuses(statuses);

        expect(result).toBe(expectation);
    });

    it("should return notStarted if there are no statuses", () => {
        const statuses: ProgressStatus[] = [];
        const expectation: ProgressStatus = "notStarted";

        const result = summarizeStatuses(statuses);

        expect(result).toBe(expectation);
    });
});
