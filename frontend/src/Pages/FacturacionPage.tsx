import React, { useEffect, useState } from "react";
import PrincipalLayout from "../Components/Layouts/PrincipalLayout";
import './Facturacion.css'
import './Login.css'
import Button from "../Components/Buttons/Button";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { Factura, mostrarMonto, mostrarRto, Rto } from "../redux/features/rtoSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RtoDetail from "../Components/RtoDetails/RtoDetail";
import Spinner from "../Components/Ui/Spinner";
import '../Components/Ui/Spinner.css'
import PagoModal from "../Components/RtoDetails/PagoModal";

interface FacturacionProps {
    
}


const FacturacionPage:React.FC<FacturacionProps> = ({}) => {
    
    const [disableBtn, setDisableBtn] = useState<boolean>(true) 
    const [patente, setPatente] = useState<string>('')
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch: AppDispatch = useDispatch();
    const [pagoModal, setPagoModal] = useState<boolean>(false)




    const handleModal = () =>{
        if (rto != null){
            dispatch(mostrarMonto({id_rto:rto.id}))
        }
        setPagoModal(!pagoModal)
    }

    useEffect(() => {
        const patenteFromUrl = searchParams.get('patente');
        if (patenteFromUrl) {
            dispatch(mostrarRto({ patente: patenteFromUrl }));
        }
    }, [searchParams, dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPatente(value);
        setDisableBtn(value.trim() === '');
    };

    const rto:Rto|null = useSelector((state:RootState) => state.rto.rto)
    const factura:Factura|null = useSelector((state:RootState) => state.rto.factura)
    const loading:boolean = useSelector((state:RootState) => state.rto.loading)
    const error:string|null = useSelector((state:RootState) => state.rto.error)
    const monto: number|null = useSelector((state:RootState) => state.rto.monto)

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        navigate(`/facturacion?patente=${patente}`);
    }

    return(
        <PrincipalLayout>
            <div className="cont cont-fact">
                <form className="form-fact" onSubmit={handleSubmit}>
                    <h3>Facturacion</h3>
                    <input
                    id='patente'
                    value={patente}
                    name='patente'
                    type="text"
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Ingrese la patente del vehiculo"
                    />
                    <Button text={"Buscar"} type={"submit"} disable_option={disableBtn}/>
                </form>
                
                {
                    rto && !pagoModal ?
                    <>
                    <RtoDetail rto={rto}/>
                    <div className="cont-button">
                        <Button text="Realizar Pago" onClickAction={handleModal}/>
                    </div>
                    </>
                    :
                    <></>
                }
                {
                    pagoModal && monto &&
                    <>
                    <p className="item-rto heavy-font">Monto a pagar: ${monto}</p>
                    <Button text="Pagar"/>
                    <div className="cont-button">
                        <p className="cancel" onClick={handleModal}>Cancelar</p>
                    </div>
                    </>
                }
                {
                    monto && pagoModal && factura &&
                    <>
                    <PagoModal monto={monto} factura={factura} handler={handleModal}/>

                    </>
                }
                {
                    loading?
                    <Spinner/>
                    : <></>
                }
                {
                    error ? 
                    <p className="error-message">{error}</p>
                    :
                    <></>
                }
            </div>
                
            
        </PrincipalLayout>
    )
};

export default FacturacionPage;