import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {

    id: number;
    username:string;
    role: string;
    is_active: boolean;
    is_staff: boolean;

}

export interface UserState {
    user: User| null;
    loading: boolean;
    error: string | null
}

const initialState: UserState ={
    user : null,
    loading: false,
    error: null,
}

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (accessToken) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout/`, 
                    { refresh: refreshToken },  
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    }
                );
                localStorage.removeItem('accessToken'); 
                localStorage.removeItem('refreshToken'); 
                return response.data;
            } catch (error:any) {
                console.log(error)
                console.log("logout user")
                return thunkAPI.rejectWithValue(error);
            }
        } else {
            return thunkAPI.rejectWithValue('No token found');
        }
    }
);

export const fetchUserFromToken = createAsyncThunk(
    'user/fetchUserFromToken',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/user/me/`, {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            });
                return response.data;
            } catch (error: any) {
                console.log("feth user")
                console.log(error)
                return thunkAPI.rejectWithValue("Sesion vencida");
            }
        } 
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async(credentials : {username:string; password:string}, thunkAPI) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login/`, credentials)
            const data = response.data

            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            
            return data.user
        } catch (error: any) {
            console.log("login user")
            console.log(error)
             
            return thunkAPI.rejectWithValue(error.response.data);
         
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        removeError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action:PayloadAction<User>) =>{
            state.loading = false;
            state.user = action.payload
        })
        .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload.error || action.payload.detail;
        })
        .addCase(fetchUserFromToken.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserFromToken.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(fetchUserFromToken.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
        })
        .addCase(logoutUser.rejected, (state) => {
            state.loading = false;
            state.error = 'Error al cerrar sesion'
        })
        .addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
    },
});

export const {removeError} = userSlice.actions;

export default userSlice.reducer;
