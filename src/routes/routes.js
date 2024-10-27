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
    const [userTag, setUserTag] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tag = localStorage.getItem('tag');
        
        if (token) {
            setSigned(true);
        }
        if (tag) {
            setUserTag(tag);
        }
        setLoading(false); 
    }, []);

    const PrivateRoute = ({ children, requiresAdminOrCoordinator = false, requiresAdmin = false }) => {
        if (loading) return null; 

        if (!signed) {
            return <Navigate to='/login' />;
        }

        if (requiresAdminOrCoordinator && !['COORDENADOR', 'ADMINISTRADOR'].includes(userTag)) {
            return <Navigate to='/dashboard' />;
        }

        if (requiresAdmin && userTag !== 'ADMINISTRADOR') {
            return <Navigate to='/dashboard' />;
        }

        return children;
    };

    const PublicRoute = ({ children }) => {
        if (loading) return null; 
        return signed ? <Navigate to='/dashboard' /> : children;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path='/historypoint' element={<PrivateRoute><HistoryPoint /></PrivateRoute>} />
                <Route path='/management/users' element={<PrivateRoute requiresAdminOrCoordinator={true}><User /></PrivateRoute>} />
                <Route path='/management/duedatebank' element={<PrivateRoute requiresAdminOrCoordinator={true}><DueDateBank /></PrivateRoute>} />
                <Route path='/management/requests' element={<PrivateRoute requiresAdminOrCoordinator={true}><Requests /></PrivateRoute>} />
                <Route path='/management/organization' element={<PrivateRoute requiresAdmin={true}><Organization /></PrivateRoute>} />
                <Route path='/management/reports' element={<PrivateRoute requiresAdminOrCoordinator={true}><Reports /></PrivateRoute>} />
                <Route path='/management/audit' element={<PrivateRoute requiresAdmin={true}><Audit /></PrivateRoute>} />
                <Route path='/login' element={<PublicRoute><SignIn /></PublicRoute>} />
                <Route path='*' element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default ApplicationRoutes;
