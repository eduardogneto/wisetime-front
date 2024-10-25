import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard.tsx';
import SignIn from '../pages/SignIn/SignIn.js';
import User from '../pages/User/User.tsx';
import HistoryPoint from '../pages/HistoryPoint/HistoryPoint.tsx';
import DueDateBank from '../pages/DueDateBank/DueDateBank.tsx';
import Requests from '../pages/Requests/Requests.tsx';
import Organization from '../pages/Organization/Organization.tsx';
import Reports from '../pages/Reports/Reports.tsx';
import Audit from '../pages/Audit/Audit.tsx';
import ErrorPage from '../pages/ErrorPage.tsx';

const ApplicationRoutes = () => {
    const [signed, setSigned] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token != null) {
            setSigned(true);
        }
    }, []);

    const PrivateRoute = ({ children }) => {
        return signed ? children : <Navigate to='/login' />;
    };

    const PublicRoute = ({ children }) => {
        return signed ? <Navigate to='/dashboard' /> : children;
    };

    return (<>
        <BrowserRouter>
            <Routes>
                <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path='/historypoint' element={<PrivateRoute><HistoryPoint /></PrivateRoute>} />
                <Route path='/management/users' element={<PrivateRoute><User /></PrivateRoute>} />
                <Route path='/management/duedatebank' element={<PrivateRoute><DueDateBank /></PrivateRoute>} />
                <Route path='/management/requests' element={<PrivateRoute><Requests /></PrivateRoute>} />
                <Route path='/management/organization' element={<PrivateRoute><Organization /></PrivateRoute>} />
                <Route path='/management/reports' element={<PrivateRoute><Reports /></PrivateRoute>} />
                <Route path='/management/audit' element={<PrivateRoute><Audit /></PrivateRoute>} />
                <Route path='/login' element={<PublicRoute><SignIn /></PublicRoute>} />
                <Route path='*' element={<ErrorPage/>} />
            </Routes>
        </BrowserRouter>
    </>
    );
};

export default ApplicationRoutes;
