import React from "react";
import { Rto } from "../../redux/features/rtoSlice";
import './RtoDetail.css'

interface RtoDetailProps{
    rto:Rto;

}


const RtoDetail: React.FC<RtoDetailProps> = ({rto}) => {
    
    
    const styleCond:string = 
        rto.resultado == 'aceptado' ? 'accept-rto' :
        rto.resultado == 'rechazado' ? 'reject-rto' :
        'conditional-rto'
    
    return (
        <>
            <div className="cont cont-rto-detail">
                <div className="element-rto">
                    
                    <p className="item-rto">Categoria: {rto.rel_vehiculo.rel_categoria.tipo}</p>
                    <p className="item-rto">Marca: {rto.rel_vehiculo.marca}</p>
                    <p className="item-rto">Modelo: {rto.rel_vehiculo.modelo}</p>
                    <p className="item-rto">{rto.rel_vehiculo.anio}</p>
                </div>
                <div className="element-rto rto">
                    <p className="item-rto title-rto">Rto</p>
                    <div className="div-element">
                        <p className="item-rto heavy-font">Resultado: <span className={`heavy-font ${styleCond}`}>{rto.resultado}</span></p>
                        
                    </div>
                    <p className="item-rto desc">{rto.descripcion}</p>
                </div>
            </div>
           
        </>
    )
}


export default RtoDetail;