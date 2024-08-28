import React, { useEffect } from "react";
import PrincipalLayout from "../Components/Layouts/PrincipalLayout";
import './Home.css'
import otrosIcon from '../assets/otros.svg'
import {Link} from 'react-router-dom'
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { mostrarOpciones } from "../redux/features/rtoSlice";
import { useDispatch } from "react-redux";

interface HomeProps {
    
}

const Home:React.FC<HomeProps> = ({}) => {


    const dispatch:AppDispatch = useDispatch()

    useEffect(() => {
        dispatch(mostrarOpciones());
    },[])

    const opciones:string[] | null = useSelector((state:RootState) => state.rto.opciones)
    
    return(
        <PrincipalLayout>
            <div className="cont">
                <ul className="ul-home">
                {
                    opciones&&opciones.map((item, key) => (
                        <Link key={key} className='link'to={`/${item}`}>
                            <li key={key} className="li-menu" >
                                <img className="icon" src={otrosIcon}/>
                                <p className="text">{item}</p>
                            </li>
                        </Link>
                    ))
                }
                </ul>
            </div>
        </PrincipalLayout>
    )
};
export default Home;