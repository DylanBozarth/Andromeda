import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DistanceMap, System } from '../utils/system-generator/generate-sector';

interface Sector {
  systems: System[];
  distancesMap: DistanceMap;
}

interface ActiveState {
  activeSector: Sector;
}

const initialState: ActiveState = {
  activeSector: {} as Sector,
};

export const sectorSlice = createSlice({
  name: 'sector',
  initialState,
  reducers: {
    setSector: (state, action: PayloadAction<Sector>) => {
      state.activeSector = action.payload;
    },
  },
});

export const { setSector } = sectorSlice.actions;

export default sectorSlice.reducer;
