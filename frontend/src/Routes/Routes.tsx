import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom"
import Home from "../Pages/HomePage"
import ErrorPage from "../Pages/ErrorPage"
import Login from "../Pages/LoginPage"
import RedirectLoginRoot from "../Components/OutletRoutes/RedirectLoginRoot"
import AtencionRoot from "../Components/OutletRoutes/AtencionRoot"
import FacturacionPage from "../Pages/FacturacionPage"
import LoadUserRoot from "../Components/OutletRoutes/LoadUser"

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="*" element={<ErrorPage/>}/>
            <Route element={<LoadUserRoot/>}>

                <Route path="/" element={<Home/>}/>
                <Route element={<AtencionRoot/>}>
                    <Route path="facturacion" element={<FacturacionPage/>}/>
                </Route>
            </Route>
            <Route element={<RedirectLoginRoot/>}>
                <Route path="/login" element={<Login/>}/>
            </Route>
        </>
    )
)