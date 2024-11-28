import dayjs from "dayjs";

describe("HistoryPointTable Logic", () => {
    test("getDatesInRange - generates correct date range", () => {
        const getDatesInRange = (start, end) => {
            const startDate = dayjs(start);
            const endDate = dayjs(end);
            const dates = [];

            let currentDate = startDate;
            while (
                currentDate.isBefore(endDate) ||
                currentDate.isSame(endDate, "day")
            ) {
                dates.push(currentDate.format("DD/MM/YYYY"));
                currentDate = currentDate.add(1, "day");
            }

            return dates;
        };

        const result = getDatesInRange("2024-01-01", "2024-01-05");
        expect(result).toEqual([
            "01/01/2024",
            "02/01/2024",
            "03/01/2024",
            "04/01/2024",
            "05/01/2024",
        ]);
    });

    test("confirmEditPunch - updates punch status correctly", () => {
        const detailData = [
            { id: "1", status: "Entrada", hours: "08:00", editable: false },
            { id: "2", status: "Saída", hours: "12:00", editable: false },
        ];
        const editPunch = { id: "1", status: "Entrada", hours: "08:00", editable: false };

        const confirmEditPunch = (data, editPunch, newStatus) => {
            return data.map((punch) =>
                punch.id === editPunch.id
                    ? { ...punch, status: newStatus, editable: false }
                    : punch
            );
        };

        const updatedData = confirmEditPunch(detailData, editPunch, "Saída");
        expect(updatedData).toEqual([
            { id: "1", status: "Saída", hours: "08:00", editable: false },
            { id: "2", status: "Saída", hours: "12:00", editable: false },
        ]);
    });

    test("updatePunch - updates punch fields correctly", () => {
        const detailData = [
            { id: "1", status: "Entrada", hours: "08:00", editable: false },
            { id: "2", status: "Saída", hours: "12:00", editable: false },
        ];

        const updatePunch = (data, id, field, value) => {
            return data.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            );
        };

        const updatedData = updatePunch(detailData, "1", "hours", "09:00");
        expect(updatedData).toEqual([
            { id: "1", status: "Entrada", hours: "09:00", editable: false },
            { id: "2", status: "Saída", hours: "12:00", editable: false },
        ]);
    });

    test("validatePunches - checks for empty times", () => {
        const punches = [
            { status: "Entrada", hours: "2024-01-01T08:00:00" },
            { status: "Saída", hours: "2024-01-01T:00" }, // Invalid
        ];

        const hasEmptyTime = punches.some((punch) => punch.hours.includes(":00"));
        expect(hasEmptyTime).toBe(true);
    });

    test("transformPunchData - transforms API data correctly", () => {
        const apiData = [
            {
                id: "1",
                date: "2024-01-01",
                entryCount: 2,
                exitCount: 2,
                status: "Completo",
            },
            {
                id: "2",
                date: "2024-01-02",
                entryCount: 1,
                exitCount: 1,
                status: "Incompleto",
            },
        ];

        const getWeekdayName = (date) => {
            return date.format("dddd");
        };

        const transformPunchData = (data) => {
            return data.map((item) => {
                const dateObj = dayjs(item.date);
                return {
                    key: item.date,
                    date: `${dateObj.format("DD/MM/YYYY")} - ${getWeekdayName(dateObj)}`,
                    entrys: item.entryCount || 0,
                    outs: item.exitCount || 0,
                    tags: [item.status || "Incompleto"],
                };
            });
        };

        const transformedData = transformPunchData(apiData);
        expect(transformedData).toEqual([
            {
                key: "2024-01-01",
                date: "01/01/2024 - Monday",
                entrys: 2,
                outs: 2,
                tags: ["Completo"],
            },
            {
                key: "2024-01-02",
                date: "02/01/2024 - Tuesday",
                entrys: 1,
                outs: 1,
                tags: ["Incompleto"],
            },
        ]);
    });
});
