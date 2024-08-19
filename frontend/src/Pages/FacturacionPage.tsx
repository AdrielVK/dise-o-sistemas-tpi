import React, { useEffect, useState } from "react";
import PrincipalLayout from "../Components/Layouts/PrincipalLayout";
import './Facturacion.css'
import './Login.css'
import Button from "../Components/Buttons/Button";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { Factura, Rto, searchRto } from "../redux/features/rtoSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RtoDetail from "../Components/RtoDetails/RtoDetail";
import Spinner from "../Components/Ui/Spinner";
import '../Components/Ui/Spinner.css'

interface FacturacionProps {
    
}


const FacturacionPage:React.FC<FacturacionProps> = ({}) => {
    
    const [disableBtn, setDisableBtn] = useState<boolean>(true) 
    const [patente, setPatente] = useState<string>('')
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const patenteFromUrl = searchParams.get('patente');
        if (patenteFromUrl) {
            dispatch(searchRto({ patente: patenteFromUrl }));
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
                    rto && factura ?
                    <RtoDetail rto={rto} factura={factura} />
                    :
                    <></>
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