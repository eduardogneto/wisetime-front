import { Select } from "antd";
import React from "react";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb.tsx";
import Header from "../../components/Header";
import { TopButtons } from "../../components/TopButtons/TopButtons.tsx";
import "./DueDateBank.sass";
import DueDateBankTable from "./DueDateBankTable.tsx";

const DueDateBank: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="container-wise">
        <div className="table">
          <Breadcrumb />
          <DueDateBankTable />
        </div>
      </div>
    </div>
  );
};

export default DueDateBank;
