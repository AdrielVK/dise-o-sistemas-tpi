import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../redux/store';



const AtencionRoot: React.FC = () => {

    const user = useSelector((state: RootState) => state.user.user)

    if (user && user.role == 'atencion') {
        return <Outlet/>
    }
    
    return <Navigate to={'/'}/> 
};

export default AtencionRoot;