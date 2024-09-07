import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard.tsx';
import SignIn from '../pages/SignIn/SignIn.js';
import User from '../pages/User/User.tsx';
import HistoryPoint from '../pages/HistoryPoint/HistoryPoint.tsx';
import DueDateBank from '../pages/DueDateBank/DueDateBank.tsx';

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
                <Route path='/login' element={<PublicRoute><SignIn /></PublicRoute>} />
                <Route path='*' element={'ERRO 404 - REQUEST NAO RECONHECIDA'} />
            </Routes>
        </BrowserRouter>
    </>
    );
};

export default ApplicationRoutes;
