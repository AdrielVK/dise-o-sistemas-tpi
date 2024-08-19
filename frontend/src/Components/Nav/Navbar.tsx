import React from "react";
import './Nav.css'
import { logoutUser, User } from "../../redux/features/userSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";

interface NavbarProps{
    user: User | null
}

const Navbar: React.FC<NavbarProps> = ({user}) => {
    const dispatch: AppDispatch = useDispatch();

    const ClickLogout = () => {
        dispatch(logoutUser());
    }

    return (
        <nav className="navbar">
            <ul className="nav-ul">
                {
                    user ?
                    <> 
                    <li className="nav-li role" key={1}>{user.role}</li>
                    <li className="nav-li " key={2}>{user.username}</li>
                    <li className="nav-li name" key={3}>9Xpertos</li>
                    <li className="nav-li close-session" onClick={ClickLogout} key={4}>Cerrar Sesion</li>
                    </>
                    :
                    <></>
                }

            </ul>
        </nav>
    )
}


export default Navbar;