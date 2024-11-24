import React from 'react';
import Header from '../../components/Header';
import './Audit.sass';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import AuditTable from './AuditTable.tsx';


const Audit: React.FC = () => {

    return (
        <div>
            <Header />
            <div className='container-wise'>
                <div className='table'>
                    <Breadcrumb />
                    <AuditTable />
                </div>
            </div>
        </div>
    );
};

export default Audit;
