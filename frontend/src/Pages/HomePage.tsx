import React from "react";
import PrincipalLayout from "../Components/Layouts/PrincipalLayout";
import './Home.css'
import otrosIcon from '../assets/otros.svg'
import admIcon from '../assets/adm.svg'
import facIcon from '../assets/facturacion.svg'
import {Link} from 'react-router-dom'

interface HomeProps {
    
}

const Home:React.FC<HomeProps> = ({}) => {

    
    return(
        <PrincipalLayout>
            <div className="cont">
                <ul className="ul-home">
                    <h3 className="text">Menu</h3>
                    <Link className='link'to={'/facturacion'}><li className="li-menu" key={1}><img className="icon" src={facIcon}/> <p className="text">Facturacion</p></li></Link>
                    <li className="li-menu" key={2}><img className="icon" src={admIcon}/> <p className="text">Administracion</p></li>
                    <li className="li-menu" key={3}><img className="icon" src={otrosIcon}/> <p className="text">Otros</p></li>
                </ul>
            </div>
        </PrincipalLayout>
    )
};
export default Home;