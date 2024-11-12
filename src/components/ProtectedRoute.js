import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ element, ...rest }) => {
    const { user } = useAuth();

    return (
        <Route
            {...rest}
            element={user ? element : <Navigate to="/AuthPage" replace />}
        />
    );
};

export default ProtectedRoute;
