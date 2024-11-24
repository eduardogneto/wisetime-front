import { Select, Spin, message, Skeleton } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.tsx";
import Header from "../../components/Header";
import { TopButtons } from "../../components/TopButtons/TopButtons.tsx";
import api from "../../connection/api";
import HistoryPointTable from "./HistoryPointTable.tsx";
import { LoadingOutlined } from "@ant-design/icons";
import "./HistoryPoint.sass";

dayjs.extend(isBetween);

const { Option } = Select;

interface Period {
  id: number;
  startDate: string;
  endDate: string;
}

const HistoryPoint: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });
  const [defaultValue, setDefaultValue] = useState<string | undefined>(
    undefined
  );

  const [balances, setBalances] = useState({
    currentPeriodBalance: "+00:00",
    previousPeriodBalance: "+00:00",
    totalBalance: "+00:00",
  });

  const [loading, setLoading] = useState(true);

  const getPeriodStatus = (startDate: string, endDate: string): string => {
    const today = dayjs();
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

  const handleChange = (value: string) => {
    const period = periods.find((p) => p.id.toString() === value);
    if (period) {
      setSelectedPeriod({
        start: period.startDate,
        end: period.endDate,
      });
    }
  };

  const fetchPeriods = async () => {
    try {
      const organizationId = localStorage.getItem("organizationId");
      if (!organizationId) {
        throw new Error("Organização não encontrada.");
      }

      const response = await api.get(
        `/api/dueDateBank/periods/${organizationId}`
      );

      const sortedPeriods = response.data.sort((a: Period, b: Period) => {
        return dayjs(b.endDate).valueOf() - dayjs(a.endDate).valueOf();
      });

      setPeriods(sortedPeriods);

      if (sortedPeriods.length > 0) {
        const firstPeriod = sortedPeriods[0];
        setSelectedPeriod({
          start: firstPeriod.startDate,
          end: firstPeriod.endDate,
        });
        setDefaultValue(firstPeriod.id.toString());
      }
    } catch (error) {
      console.error("Erro ao buscar os períodos:", error);
      message.error("Erro ao buscar os períodos.");
    }
  };

  const fetchBalances = async () => {
    try {
      let userId = localStorage.getItem("id");
      let organizationId = localStorage.getItem("organizationId");

      if (!userId || !organizationId) {
        throw new Error("Usuário ou organização não encontrados.");
      }

      const response = await api.get(`/api/users/${userId}/balances`, {
        params: { organizationId },
      });

      setBalances(response.data);
    } catch (error) {
      console.error("Erro ao buscar os saldos:", error);
      message.error("Erro ao buscar os saldos");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPeriods(), fetchBalances()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatBalance = (balance: string) => {
    const symbol = balance.substring(0, 1);
    const time = balance.substring(1);
    const [hours, minutes] = time.split(":");
    const formattedTime = `${hours}h${minutes}min`;
    return { symbol, formattedTime };
  };

  return (
    <div className="history-point-container">
      <Header />
      <div className="container-wise">
        <div className="table">
          <Breadcrumb />
          {loading ? (
            <div className="skeleton-wrapper">
              <Skeleton active paragraph={{ rows: 4 }} title />
              <Skeleton.Button
                active
                size="large"
                block
                style={{ marginTop: 20 }}
              />
              <Skeleton active paragraph={{ rows: 10 }} title />
            </div>
          ) : (
            <>
              <div className="containers-balance">
                <div className="balance-point">
                  <p className="top-point-balace">Saldo Anterior</p>
                  <p className="low-point-balace">
                    {(() => {
                      const { symbol, formattedTime } = formatBalance(
                        balances.previousPeriodBalance
                      );
                      return (
                        <>
                          <span className="pink">{symbol}</span>
                          <span>{formattedTime}</span>
                        </>
                      );
                    })()}
                  </p>
                </div>
                <div className="balance-point">
                  <p className="top-point-balace">Saldo Período</p>
                  <p className="low-point-balace">
                    {(() => {
                      const { symbol, formattedTime } = formatBalance(
                        balances.currentPeriodBalance
                      );
                      return (
                        <>
                          <span className="pink">{symbol}</span>
                          <span>{formattedTime}</span>
                        </>
                      );
                    })()}
                  </p>
                </div>
                <div className="balance-point">
                  <p className="top-point-balace">Saldo Geral</p>
                  <p className="low-point-balace">
                    {(() => {
                      const { symbol, formattedTime } = formatBalance(
                        balances.totalBalance
                      );
                      return (
                        <>
                          <span className="pink">{symbol}</span>
                          <span>{formattedTime}</span>
                        </>
                      );
                    })()}
                  </p>
                </div>
              </div>
              <p style={{ marginLeft: 10 }}>Período</p>
              <div className="filters-history">
                <div className="left-filters">
                  <Select
                    onChange={handleChange}
                    className="select"
                    placeholder="Selecione o Período"
                    value={defaultValue}
                    style={{ width: 250 }}
                    loading={periods.length === 0}
                  >
                    {periods.map((period) => (
                      <Option key={period.id} value={period.id.toString()}>
                        {`${dayjs(period.startDate).format(
                          "DD/MM/YYYY"
                        )} - ${dayjs(period.endDate).format(
                          "DD/MM/YYYY"
                        )}${getPeriodStatus(period.startDate, period.endDate)}`}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="right-filters">
                  <TopButtons />
                </div>
              </div>
              <HistoryPointTable selectedPeriod={selectedPeriod} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPoint;
