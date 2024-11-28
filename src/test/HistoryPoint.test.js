import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

describe("HistoryPoint Logic (Without Requests)", () => {
    test("getPeriodStatus - calculates period status correctly", () => {
        const today = dayjs();
        const getPeriodStatus = (startDate, endDate) => {
            const start = dayjs(startDate);
            const end = dayjs(endDate);

            if (today.isBetween(start, end, "day", "[]")) {
                return " - Atual";
            } else if (today.isAfter(end)) {
                return " - Fechado";
            } else {
                return "";
            }
        };

        expect(getPeriodStatus(today.subtract(1, "day").toString(), today.add(1, "day").toString())).toBe(" - Atual");
        expect(getPeriodStatus(today.subtract(10, "day").toString(), today.subtract(5, "day").toString())).toBe(" - Fechado");
        expect(getPeriodStatus(today.add(1, "day").toString(), today.add(10, "day").toString())).toBe("");
    });

    test("formatBalance - formats balance correctly", () => {
        const formatBalance = (balance) => {
            const symbol = balance.substring(0, 1);
            const time = balance.substring(1);
            const [hours, minutes] = time.split(":");
            return {
                symbol,
                formattedTime: `${hours}h${minutes}min`,
            };
        };

        const result = formatBalance("+12:34");
        expect(result).toEqual({
            symbol: "+",
            formattedTime: "12h34min",
        });

        const resultNegative = formatBalance("-00:45");
        expect(resultNegative).toEqual({
            symbol: "-",
            formattedTime: "00h45min",
        });
    });

    test("handles mock periods data and calculates correctly", () => {
        const mockPeriods = [
            { id: 1, startDate: "2024-10-01", endDate: "2024-10-15" },
            { id: 2, startDate: "2024-11-01", endDate: "2024-11-15" },
        ];

        const sortPeriods = (periods) =>
            periods.sort((a, b) => dayjs(b.endDate).valueOf() - dayjs(a.endDate).valueOf());

        const sortedPeriods = sortPeriods(mockPeriods);
        expect(sortedPeriods).toEqual([
            { id: 2, startDate: "2024-11-01", endDate: "2024-11-15" },
            { id: 1, startDate: "2024-10-01", endDate: "2024-10-15" },
        ]);
    });

    test("calculates balances correctly with mock data", () => {
        const mockBalances = {
            currentPeriodBalance: "+10:00",
            previousPeriodBalance: "-05:00",
            totalBalance: "+05:00",
        };

        const formatBalance = (balance) => {
            const symbol = balance.substring(0, 1);
            const time = balance.substring(1);
            const [hours, minutes] = time.split(":");
            return {
                symbol,
                formattedTime: `${hours}h${minutes}min`,
            };
        };

        const formattedCurrent = formatBalance(mockBalances.currentPeriodBalance);
        const formattedPrevious = formatBalance(mockBalances.previousPeriodBalance);
        const formattedTotal = formatBalance(mockBalances.totalBalance);

        expect(formattedCurrent).toEqual({ symbol: "+", formattedTime: "10h00min" });
        expect(formattedPrevious).toEqual({ symbol: "-", formattedTime: "05h00min" });
        expect(formattedTotal).toEqual({ symbol: "+", formattedTime: "05h00min" });
    });
});
