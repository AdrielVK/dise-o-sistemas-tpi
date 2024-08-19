import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Vehiculo {
    patente: string;
    categoria: string;
    categoria_desc: string;
    modelo: string;
    marca: string;
    anio: number;
    primera_rto: boolean;
}

export interface Rto {
    descripcion: string;
    nombre_mecanico: string;
    resultado: string;
    rel_vehiculo: Vehiculo;
}

export interface Lineas {
    monto: number;
    descripcion: string;
}

export interface Factura {
    nro_factura: number;
    fecha_emision: Date;
    rel_rto: Rto;
    lineas: Lineas[];
    monto: number;
}



export interface RtoState {
    rto: Rto | null;
    factura: Factura | null;
    error: string | null;
    loading: boolean;
    message: string | null;
    pago_success: boolean
}

interface ActionPayloadSearchRto {
    rto: Rto;
    factura: Factura;
}

const initialState: RtoState = {
    rto: null,
    factura: null,
    error: null,
    loading: false,
    message: null,
    pago_success: false
}

// Thunks
export const searchRto = createAsyncThunk(
    'rto/search',
    async (credentials: { patente: string }, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/realizar_pago/get_rto/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    patente: credentials.patente,
                },
            });
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export interface PagoPayload {
    success: string;
}

export const pagoContado = createAsyncThunk(
    'rto/pago/contado',
    async (credentials: { patente: string }, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/realizar_pago/pagar/`,
                {
                    patente: credentials.patente,
                    //imprimir: !(credentials.imprimir),
                    modo_de_pago: 'efectivo'
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                }
            );
            return response.data;
            
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const pagoTarjeta = createAsyncThunk(
    'rto/pago/tarjeta',
    async (credentials: {patente:string, nro:number, codSeg:number}, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/realizar_pago/pagar/`,
                {
                    patente: credentials.patente,
                    //imprimir: !(credentials.imprimir),
                    modo_de_pago: 'tarjeta',
                    nro: credentials.nro,
                    cod_seguridad: credentials.codSeg
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                }
            );
            console.log(response.data)
            return response.data
        } catch(error:any){
            console.log(thunkAPI.rejectWithValue(error.response))
            return thunkAPI.rejectWithValue(error.response.data);

        }
    }
)

const rtoSlice = createSlice({
    name: 'rto',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(pagoTarjeta.fulfilled, (state, action: PayloadAction<PagoPayload>) => {
                state.loading = false;
                state.pago_success = true
                state.message = action.payload.success;
            })
            .addCase(pagoTarjeta.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.message = action.payload.detail;
                state.pago_success = false

            })
            .addCase(pagoTarjeta.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(pagoContado.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(pagoContado.fulfilled, (state, action: PayloadAction<PagoPayload>) => {
                state.loading = false;
                state.message = action.payload.success;
            })
            .addCase(pagoContado.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(searchRto.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchRto.fulfilled, (state, action: PayloadAction<ActionPayloadSearchRto>) => {
                state.loading = false;
                state.rto = action.payload.rto;
                state.factura = action.payload.factura;
            })
            .addCase(searchRto.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    }
})

export default rtoSlice.reducer;
