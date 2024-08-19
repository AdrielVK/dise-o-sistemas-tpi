import React, { useState } from "react";
import { Factura, Rto } from "../../redux/features/rtoSlice";
import Button from "../Buttons/Button";
import './RtoDetail.css'
import PagoDetailModal from "./PagoDetail";

interface RtoDetailProps{
    rto:Rto;
    factura:Factura;
}


const RtoDetail: React.FC<RtoDetailProps> = ({rto, factura}) => {
    
    const [pagoModal, setPagoModal] = useState<boolean>(false)

    const handleModal = () =>{
        setPagoModal(!pagoModal)
    }

    const styleCond:string = 
        rto.resultado == 'aceptado' ? 'accept-rto' :
        rto.resultado == 'rechazado' ? 'reject-rto' :
        'conditional-rto'
    
    return (
        <>
            <div className="cont cont-rto-detail">
                <div className="element-rto">
                    
                    <p className="item-rto">Categoria: {rto.rel_vehiculo.categoria}</p>
                    <p className="item-rto">Marca: {rto.rel_vehiculo.marca}</p>
                    <p className="item-rto">Modelo: {rto.rel_vehiculo.modelo}</p>
                    <p className="item-rto">{rto.rel_vehiculo.anio}</p>
                </div>
                <div className="element-rto rto">
                    <p className="item-rto title-rto">Rto</p>
                    <div className="div-element">
                        <p className="item-rto heavy-font">Resultado: <span className={`heavy-font ${styleCond}`}>{rto.resultado}</span></p>
                        <p className="item-rto heavy-font">Mecanico: <span className="light-font">{rto.nombre_mecanico}</span></p>
                    </div>
                    <p className="item-rto desc">{rto.descripcion}</p>
                </div>
                <div className="cont-button">
                    <Button text="Realizar Pago" onClickAction={handleModal}/>
                </div>
            </div>
            {
                pagoModal &&
                <div className="modal-overlay">
                    <span className="close-modal" onClick={handleModal}>Cerrar</span>
                    <PagoDetailModal patente={rto.rel_vehiculo.patente} factura={factura} />
                </div>
            }
        </>
    )
}


export default RtoDetail;