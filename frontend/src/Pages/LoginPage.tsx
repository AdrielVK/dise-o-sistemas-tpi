import React, { useState } from "react";
import Botton from "../Components/Buttons/Button"
import { useDispatch } from "react-redux";
import { loginUser  } from "../redux/features/userSlice";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import './Login.css'

interface LoginProps {

}



const Login:React.FC<LoginProps> = () => {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const { loading, error } = useSelector((state: RootState) => state.user);
    const dispatch: AppDispatch = useDispatch();

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({username, password}));
    }

    return(
        <div className="cont-login">
            <form className="form login" onSubmit={(e) => {handleSubmit(e)} } method="POST">
                <h2>Iniciar Sesion</h2>
                
                <input
                    id='username'
                    value={username}
                    name='username'
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input"
                    placeholder="Nombre de usuario"
                />
                <input
                    value={password}
                    id='password'
                    name='password'
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete='current-password'
                    required
                    className='input'
                    placeholder='Contrasena'
                />
                <Botton text={ loading ?"Ingresando...":"Ingresar"} type={"submit"} />
                <p className="error-message">{error? error: ''}</p>
            </form>
            
        
        </div>
    )
};
export default Login;