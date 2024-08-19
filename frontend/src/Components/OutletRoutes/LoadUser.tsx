import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { fetchUserFromToken } from '../../redux/features/userSlice';



const LoadUserRoot: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserFromToken());
    }, []);

    const user = useSelector((state: RootState) => state.user.user)

    if (user) {
        return <Outlet/>
    }
    
    return <Navigate to={'/login'}/> 
};

export default LoadUserRoot;