import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { System } from '../utils/system-generator/generate-sector';
interface ActiveState {
  activeSector: System[];
}

const initialState: ActiveState = {
  activeSector: [],
};

export const sectorSlice = createSlice({
  name: 'sector',
  initialState,
  reducers: {
    setSector: (state, action: PayloadAction<System[]>) => {
      state.activeSector = action.payload;
    },
  },
});

export const { setSector } = sectorSlice.actions;

export default sectorSlice.reducer;
