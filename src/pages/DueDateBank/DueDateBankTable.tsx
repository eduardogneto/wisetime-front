import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { Table, Tag, message } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { ColumnsType } from "antd/es/table/InternalTable";
import moment from "moment";
import React, { useEffect, useState } from "react";
import api from "../../connection/api";
import "./DueDateBank.sass";

interface DataType {
  key: string;
  period: string;
  status: string[];
  startDate: string;
}

const DueDateBankTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDueDateBanks = async () => {
      try {
        const organizationId = localStorage.getItem("organizationId");
        if (!organizationId) {
          message.error("ID da organização não encontrado!");
          return;
        }

        const response = await api.get(
          `/api/dueDateBank/organization/${organizationId}/duedates`
        );
        const responseData = response.data;

        if (!responseData || responseData.length === 0) {
          message.warning("Nenhum período encontrado.");
          setData([]);
          return;
        }

        const transformedData = responseData.map((item: any) => ({
          key: item.id,
          period: `${moment(item.startDate).format("DD/MM/YYYY")} - ${moment(
            item.endDate
          ).format("DD/MM/YYYY")}`,
          status: [item.tag],
          startDate: item.startDate,
        }));

        transformedData.sort(
          (a, b) => moment(b.startDate).unix() - moment(a.startDate).unix()
        );

        setData(transformedData);
      } catch (error) {
        console.error("Erro na requisição:", error);
        message.error("Erro ao carregar os períodos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDueDateBanks();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: "Período",
      dataIndex: "period",
      key: "period",
      align: "center",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (_, { status }) => (
        <>
          {status.map((tag) => {
            let color = "";
            let icon;
            let traduction = "";
            switch (tag.toUpperCase()) {
              case "COMPLETO":
                color = "green";
                icon = <CheckCircleOutlined />;
                traduction = "Completo";
                break;
              case "ANDAMENTO":
                color = "blue";
                icon = <SyncOutlined spin />;
                traduction = "Em Andamento";
                break;
              case "PROXIMO":
                color = "purple";
                icon = <ClockCircleOutlined />;
                traduction = "Próximo";
                break;
              default:
                color = "gray";
            }
            return (
              <Tag color={color} icon={icon} key={tag}>
                {traduction.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const rowSelection: TableRowSelection<DataType> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  return (
    <>
      <Table
        rowSelection={{ ...rowSelection }}
        className="tables-wise"
        scroll={{ y: 400 }}
        pagination={false}
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </>
  );
};

export default DueDateBankTable;
