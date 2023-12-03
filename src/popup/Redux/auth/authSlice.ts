import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface AuthState {
    value: boolean
  }
  
  // Define the initial state using that type
  const initialState: AuthState = {
    value: true,
  }

  export const authSlice = createSlice({
    name: 'auth',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
      loggedIn: (state) => {
        state.value = true
      },
      loggedOut: (state) => {
        state.value = false
      }
    },
  });

export const { loggedIn, loggedOut } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.loggedIn.value

export default authSlice.reducer