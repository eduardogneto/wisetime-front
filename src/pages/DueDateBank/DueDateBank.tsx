import { Select } from "antd";
import React from "react";
import Header from "../../components/Header";
import "./DueDateBank.sass";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import { TopButtons } from "../../components/TopButtons/TopButtons";
import DueDateBankTable from "./DueDateBankTable";

const DueDateBank: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="wrapper-wise">
        <div className="container-wise">
          <div className="table">
            <Breadcrumb />
            <DueDateBankTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueDateBank;
