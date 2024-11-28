import React from "react";
import Header from "../../components/Header";
import "./Audit.sass";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import AuditTable from "./AuditTable";

const Audit: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="wrapper-wise">
        <div className="container-wise">
          <div className="table">
            <Breadcrumb />
            <AuditTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
