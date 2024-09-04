import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { clearMessage, clearSuccessPay, Factura, mostrarMP, pagar } from "../../redux/features/rtoSlice";
import { useSelector } from "react-redux";
import Button from "../Buttons/Button";
import './PagoDetail.css'
import FacturaPDF from "../Pdf/FacturaPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface PagoModalProps {
    monto:number,
    handler: () => void;
    factura: Factura;
}

const PagoModal: React.FC<PagoModalProps> = ({
    monto,
    handler,
    factura
}) => { 
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(mostrarMP())
        dispatch(clearMessage())
        dispatch(clearSuccessPay())
    }, [])

    const metodos = useSelector((state:RootState) => state.rto.metodos)
    const [tarjeta, setTarjeta] = useState<boolean>(false);
    const [efectivo, setEfectivo] = useState<boolean>(false);
    const pago_success = useSelector((state:RootState) => state.rto.pago_success)
    const error = useSelector((state:RootState) => state.rto.error)
    const message = useSelector((state:RootState) => state.rto.message)
    const [nroTarjeta, setNumeroTarjeta] = useState<number>(0)
    const [codSeg, setCodSeg] = useState<number>(0)


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

    const handleTarjeta = (type:string) => {
        if(type == 'efectivo') {
            setEfectivo(!efectivo)
        }
        else if (type == 'tarjeta'){
            setTarjeta(!tarjeta)
        }

    }
    const pagarActionTarjeta = () => {
        
        dispatch(pagar({mp:'tarjeta',id_factura:factura.id, monto:monto, nro_tarjeta:nroTarjeta, cod_seg:codSeg}))
        
    }

    const pagarEfectivoAction = () => {
        dispatch(pagar({mp:'efectivo',id_factura:factura.id, monto:monto, nro_tarjeta:null, cod_seg:null}))
    }

    const resetStates = () =>{
        setEfectivo(false)
        setTarjeta(false)
        handler();
    }

    return(
        <div className="modal-overlay">
            <div className="modal-pago">
            {
                !tarjeta && efectivo &&
                <div className="div-modal column center">
                    <p className="title-modal">Total a pagar: ${monto}</p>
                    <Button onClickAction={pagarEfectivoAction} text="Confirmar Pago"/>
                    {
                        pago_success &&
                        <PDFDownloadLink document={<FacturaPDF monto={monto} tarjeta={false} factura={factura}/>} fileName="factura.pdf">
                            <Button text="Imprimir factura"/>
                        </PDFDownloadLink>
                    }
                </div>
                
            }
            {
                tarjeta && !efectivo &&
                <>
                    <div className="div-modal column center">

                        <label className="label">
                            Numero de tarjeta:
                            <input
                            id="nro_tarjeta"
                            value={nroTarjeta}
                            type="number"
                            onChange={e=>handleChange(e)}
                            required
                            className="input"
                            placeholder="Numero de tarjeta"
                            />
                        </label>
                        <label className="label">
                            Codio de seguridad
                        <input
                            id="cod_seg"
                            value={codSeg}
                            type="number"
                            onChange={e=>handleChangeCodSeg(e)}
                            required
                            className="input"
                            placeholder="Codigo de seguridad"
                            />
                        </label>
                        <Button text="Realizar" onClickAction={pagarActionTarjeta}/>
                        {
                            pago_success &&
                            <PDFDownloadLink document={<FacturaPDF monto={monto} tarjeta={false} factura={factura}/>} fileName="factura.pdf">
                                <Button text="Imprimir factura"/>
                            </PDFDownloadLink>
                        }
                    </div>
                </>
            }
            {
                !tarjeta && !efectivo &&
                <>
                <div className="div-modal column center">
                    <p className="title-modal">Total a pagar: ${monto}</p>
                </div>
                <div className="div-modal column center">
                    {
                        metodos&&metodos.map((item, index)=>(
                            <Button onClickAction={() => handleTarjeta(item)} text={item} key={index}/>
                        ))
                    }
                </div>
                </>
            }
            {
                message && 
                <div className="div-modal column center">
                    <p className="accept-rto">{message}</p>
                </div>
            }
            {
                
                error && 
                <div className="div-modal column center">
                    <p className="error-message">{error}</p>
                </div>
            }
            <div className="div-modal column center">
                <p className="cancel" onClick={resetStates}>Cancelar</p>
            </div>
            </div>
        </div>
    )

}

export default PagoModal;
