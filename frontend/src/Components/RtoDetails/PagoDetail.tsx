import React, { useState } from "react";
import { Factura, pagoContado, pagoTarjeta } from "../../redux/features/rtoSlice";
import Button from "../Buttons/Button";
import './PagoDetail.css'
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FacturaPDF from "../Pdf/FacturaPDF";

interface PagoDetailProps{
    factura:Factura;
    patente:string
}


const PagoDetailModal: React.FC<PagoDetailProps> = ({factura, patente}) => {
    
    const [contado, setContado] = useState<boolean>(false)
    const [tarjeta, setTarjeta] = useState<boolean>(false)

    const [imprimir, setImprimir] = useState<boolean>(true)

    const [nroTarjeta, setNumeroTarjeta] = useState<number>(0)
    const [codSeg, setCodSeg] = useState<number>(0)


    const message:string|null = useSelector((state:RootState) => state.rto.message)
    const msg_style:boolean = useSelector((state:RootState) => state.rto.msg_success)

    const dispatch: AppDispatch = useDispatch();

    const onSubmitPago = () => {
        
        dispatch(pagoContado({patente, imprimir}))
    }

    const onSubmitPagoTarjeta = () => {
        
        dispatch(pagoTarjeta({patente, imprimir, nro:nroTarjeta, codSeg}))
        
    }

    const handleContado = () => {
        setContado(!contado)
        setTarjeta(false)
    }

    const handleTarjeta = () => {
        setTarjeta(!tarjeta)
        setContado(false)
    }

    const CancelPago = () => {
        setContado(false)
        setTarjeta(false)
    }

    const handleImprimir = () => {
        setImprimir(!imprimir)
    }

    const handleChangeCodSeg = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        // Verificar si el valor es un número válido
        if (newValue === '' || !isNaN(Number(newValue)) && newValue.length <= 3) {
            setCodSeg(newValue === '' ? 0 : Number(newValue));
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        // Verificar si el valor es un número válido
        if (newValue === '' || !isNaN(Number(newValue)) && newValue.length <= 16) {
            setNumeroTarjeta(newValue === '' ? 0 : Number(newValue));
        }
    };

    return (
        <div className="cont modal-pago">
            <div className="div-modal column center">
                <p className="title-modal">Conceptos:</p>
                {
                    factura.lineas.map((item, index) => (
                        <div className="concept-element" key={index}>
                            <p className="text-concept">{item.descripcion}</p>
                            <p className="text-concept">${item.monto}</p>
                        </div>
                    ))
                }
            </div>
            <div className="div-modal center">
                <p className="title-modal">Total: ${factura.monto}</p>   
            </div>
            <div className="div-modal column center">
                {
                    !contado && !tarjeta ?
                    <>
                    <p className="title-modal">Metodos de pago:</p>
                    <Button onClickAction={handleContado} text="Contado" />
                    <Button onClickAction={handleTarjeta} text="Tarjeta" />
                    </>:<></>
                }
                {
                    tarjeta&& !contado ?
                    <>
                        <Button disable_option={imprimir} onClickAction={handleImprimir} text="Imprimir factura"/>
                        <input
                            id="nro_tarjeta"
                            value={nroTarjeta}
                            type="number"
                            onChange={e=>handleChange(e)}
                            required
                            className="input"
                            placeholder="Numero de tarjeta"
                        />
                        <input
                            id="cod_seg"
                            value={codSeg}
                            type="number"
                            onChange={e=>handleChangeCodSeg(e)}
                            required
                            className="input"
                            placeholder="Codigo de seguridad"
                        />
                        {
                            !imprimir ?
                            <PDFDownloadLink document={<FacturaPDF tarjeta={true} factura={factura}/>} fileName="factura.pdf">
                                <Button text="Realizar" onClickAction={onSubmitPagoTarjeta}/>
                            </PDFDownloadLink>
                            :
                            <Button text="Realizar" onClickAction={onSubmitPagoTarjeta}/>
                        }
                        <span onClick={CancelPago} className="cancel">Cancelar</span>
                    </>
                    :
                    <></>
                }
                {
                    contado && !tarjeta ?
                    (
                        <>
                        <Button disable_option={imprimir} onClickAction={handleImprimir} text="Imprimir factura"/>
                        {
                            !imprimir ?
                            <PDFDownloadLink document={<FacturaPDF factura={factura} tarjeta={false}/>} fileName="factura.pdf">
                                <Button text="Realizar" onClickAction={onSubmitPago}/>
                            </PDFDownloadLink>
                            :
                            <Button text="Realizar" onClickAction={onSubmitPago}/>
                        }
                        <span onClick={CancelPago} className="cancel">Cancelar</span>
                        </>
                    ):<></>
                }
                {
                    message &&
                    <p className={msg_style ? `accept-rto`:`reject-rto`}>{message}</p>
                }
            </div>
        </div>
    )
}


export default PagoDetailModal;