import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DistanceMap, System } from '../utils/system-generator/generate-sector';

export interface Sector {
  systems: System[];
  distancesMap: DistanceMap;
  sectorName: string;
}

interface ActiveState {
  activeSector: Sector;
  activeSystem: System;
}

const initialState: ActiveState = {
  activeSector: {} as Sector,
  activeSystem: {} as System,
};

export const sectorSlice = createSlice({
  name: 'sector',
  initialState,
  reducers: {
    setSector: (state, action: PayloadAction<Sector>) => {
      state.activeSector = action.payload;
    },
    setSystem: (state, action: PayloadAction<System>) => {
      state.activeSystem = action.payload;
    },
  },
});

export const { setSector, setSystem } = sectorSlice.actions;

export default sectorSlice.reducer;
