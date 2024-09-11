import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Categoria {
    precio: number,
    tipo: string;
}

export interface Vehiculo {
    patente: string;
    rel_categoria: Categoria;
    modelo: string;
    marca: string;
    anio: number;
    primera_rto: boolean;
}

export interface Rto {
    id: number;
    descripcion: string;
    //nombre_mecanico: string;
    resultado: string;
    rel_vehiculo: Vehiculo;
}

export interface Lineas {
    monto: number;
    descripcion: string;
}

export interface Factura {
    id: number;
    nro_factura: number;
    fecha_emision: Date;
    rel_rto: Rto;
    pagado: boolean;
}



export interface RtoState {
    opciones: string[] | null;
    rto: Rto | null;
    monto: number | null;
    factura: Factura | null;
    error: string | null;
    loading: boolean;
    message: string | null;
    pago_success: boolean
    metodos: string[] | null
}

interface PayloadOpciones {
    opciones: string[]
}

interface PayloadRto {
    rto: Rto
}

interface PayloadMonto {
    monto: number,
    factura: Factura
}

interface PayloadMetodos {
    metodos: string[]
}

const initialState: RtoState = {
    opciones: null,
    metodos:null,
    rto: null,
    monto: null,
    factura: null,
    error: null,
    loading: false,
    message: null,
    pago_success: false
}

export const mostrarRto = createAsyncThunk(
    'mostrarRto',
    async (credentials:{patente:string}, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.get
            (`${import.meta.env.VITE_BACKEND_URL}/realizar_pago/pagar/mostrar-rto/`, 
                
                {
                    params:{
                        patente: credentials.patente,
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                }
            );

            return response.data
        } catch(error:any) {
            console.log(error)
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const mostrarOpciones = createAsyncThunk(
    'mostrarOpciones',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/realizar_pago/pagar/mostrar-opciones/`, 
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
            );
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const mostrarMP = createAsyncThunk(
    'mostrarMP',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/realizar_pago/pagar/mostrar-mp/`, 
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
            );
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const mostrarMonto = createAsyncThunk(
    'mostrarMonto',
    async (credentials: {id_rto:number}, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');

        console.log(credentials.id_rto)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/realizar_pago/pagar/mostrar-monto/`, 
                {
                    params: {
                        id_rto: credentials.id_rto
                    },
                    
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const pagar = createAsyncThunk(
    'pagar',
    async (credentials: {mp: string, id_factura:number, monto:number, nro_tarjeta:number|null, cod_seg:number|null}, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');
        console.log(accessToken)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/realizar_pago/pagar/pagar/`, 
                null, 
                {
                    params: {
                        mp: credentials.mp,
                        id_factura: credentials.id_factura,
                        monto: credentials.monto,
                        nro_tarjeta: credentials.nro_tarjeta,
                        cod_seg: credentials.cod_seg
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.log(error)
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export interface PagoPayload {
    success: string;
}


const rtoSlice = createSlice({
    name: 'rto',
    initialState,
    reducers: {
        clearMessage(state) {
            state.message = null
        },
        clearSuccessPay(state) {
            state.pago_success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(mostrarRto.fulfilled, (state, action: PayloadAction<PayloadRto>) => {
                state.loading = false;
                state.error = null;
                state.rto = action.payload.rto;
            })
            .addCase(mostrarRto.rejected, (state) => {
                state.loading = false;
                state.error = "No se encotro patente";

            })
            .addCase(mostrarRto.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mostrarMonto.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mostrarMonto.fulfilled, (state, action: PayloadAction<PayloadMonto>) => {
                state.loading = false;
                state.monto = action.payload.monto;
                state.factura = action.payload.factura;
            })
            .addCase(mostrarMonto.rejected, (state) => {
                state.loading = false;
                state.error = "Error al obtener monto";
            })

            .addCase(mostrarOpciones.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mostrarOpciones.fulfilled, (state, action: PayloadAction<PayloadOpciones>) => {
                state.loading = false;
                state.opciones = action.payload.opciones;
            })
            .addCase(mostrarOpciones.rejected, (state) => {
                state.loading = false;
                state.opciones = null;
                state.error = "Menu vacio";
            })

            .addCase(mostrarMP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mostrarMP.fulfilled, (state, action: PayloadAction<PayloadMetodos>) => {
                state.loading = false;
                state.metodos = action.payload.metodos;
            })
            .addCase(mostrarMP.rejected, (state) => {
                state.loading = false;
                state.opciones = null;
                state.error = "Sin metodos de pago disponibles";
            })
            .addCase(pagar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(pagar.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.pago_success = true;
                state.message = action.payload
            })
            .addCase(pagar.rejected, (state) => {
                state.loading = false;
                state.pago_success = false;
                state.message = null;
                state.error = "Error al realizar el pago";
            });
    }
})


export const { clearMessage, clearSuccessPay } = rtoSlice.actions;
export default rtoSlice.reducer;
