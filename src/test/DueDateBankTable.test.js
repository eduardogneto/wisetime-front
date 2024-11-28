import moment from "moment";

describe("DueDateBankTable Logic", () => {
    test("transforms data correctly", () => {
        const mockApiData = [
            {
                id: "1",
                startDate: "2024-01-01",
                endDate: "2024-01-31",
                tag: "COMPLETO",
            },
            {
                id: "2",
                startDate: "2024-02-01",
                endDate: "2024-02-28",
                tag: "ANDAMENTO",
            },
        ];

        const transformData = (data) =>
            data.map((item) => ({
                key: item.id,
                period: `${moment(item.startDate).format("DD/MM/YYYY")} - ${moment(
                    item.endDate
                ).format("DD/MM/YYYY")}`,
                status: [item.tag],
                startDate: item.startDate,
            }));

        const transformedData = transformData(mockApiData);

        expect(transformedData).toEqual([
            {
                key: "1",
                period: "01/01/2024 - 31/01/2024",
                status: ["COMPLETO"],
                startDate: "2024-01-01",
            },
            {
                key: "2",
                period: "01/02/2024 - 28/02/2024",
                status: ["ANDAMENTO"],
                startDate: "2024-02-01",
            },
        ]);
    });

    test("sorts data by startDate correctly", () => {
        const transformedData = [
            {
                key: "1",
                period: "01/01/2024 - 31/01/2024",
                status: ["COMPLETO"],
                startDate: "2024-01-01",
            },
            {
                key: "2",
                period: "01/02/2024 - 28/02/2024",
                status: ["ANDAMENTO"],
                startDate: "2024-02-01",
            },
        ];

        const sortData = (data) =>
            data.sort(
                (a, b) => moment(b.startDate).unix() - moment(a.startDate).unix()
            );

        const sortedData = sortData(transformedData);

        expect(sortedData).toEqual([
            {
                key: "2",
                period: "01/02/2024 - 28/02/2024",
                status: ["ANDAMENTO"],
                startDate: "2024-02-01",
            },
            {
                key: "1",
                period: "01/01/2024 - 31/01/2024",
                status: ["COMPLETO"],
                startDate: "2024-01-01",
            },
        ]);
    });

    test("maps status to the correct tag properties", () => {
        const mapStatusToTag = (tag) => {
            let color = "";
            let icon;
            let traduction = "";
            switch (tag.toUpperCase()) {
                case "COMPLETO":
                    color = "green";
                    icon = "CheckCircleOutlined";
                    traduction = "Completo";
                    break;
                case "ANDAMENTO":
                    color = "blue";
                    icon = "SyncOutlined";
                    traduction = "Em Andamento";
                    break;
                case "PROXIMO":
                    color = "purple";
                    icon = "ClockCircleOutlined";
                    traduction = "Próximo";
                    break;
                default:
                    color = "gray";
            }
            return { color, icon, traduction };
        };

        const statusMap = mapStatusToTag("COMPLETO");
        expect(statusMap).toEqual({
            color: "green",
            icon: "CheckCircleOutlined",
            traduction: "Completo",
        });

        const statusMapNext = mapStatusToTag("PROXIMO");
        expect(statusMapNext).toEqual({
            color: "purple",
            icon: "ClockCircleOutlined",
            traduction: "Próximo",
        });

        const statusMapUnknown = mapStatusToTag("UNKNOWN");
        expect(statusMapUnknown).toEqual({
            color: "gray",
            icon: undefined,
            traduction: "",
        });
    });
});
