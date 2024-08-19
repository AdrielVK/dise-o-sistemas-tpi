import React, { ReactNode, useEffect, createContext, useContext } from "react";
import './Layout.css'
import Navbar from "../Nav/Navbar";
import { useDispatch } from "react-redux";
import { fetchUserFromToken, User  } from "../../redux/features/userSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface NavbarProps{
    children: ReactNode;
}

const UserContext = createContext<User | null>(null);


export const useUser = () => {
    const context = useContext(UserContext);
    
    return context;
}


const PrincipalLayout: React.FC<NavbarProps> = ({children}) => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserFromToken());
    }, [dispatch]);

    const user = useSelector((state:RootState) => state.user.user)

    return(

        <>
            <Navbar user={user}/>
            <main className="main">
                <UserContext.Provider value={user}>
                    {children}
                </UserContext.Provider>
            </main>
        </>
    )
}


export default PrincipalLayout;