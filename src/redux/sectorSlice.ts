import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DistanceMap, System, NCO } from '../utils/system-generator/generate-sector';
import { Planet } from '../types/planet-interface';

export interface Sector {
  systems: System[];
  NCO: NCO[];
  distancesMap: DistanceMap;
  sectorName: string;
}

interface ActiveState {
  activeSector: Sector;
  activeSystem: System;
  activePlanet: Planet;
}

const initialState: ActiveState = {
  activeSector: {} as Sector,
  activeSystem: {} as System,
  activePlanet: {} as Planet
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
    setPlanet: (state, action: PayloadAction<Planet>) => {
      state.activePlanet = action.payload;
    },
  },
});

export const { setSector, setSystem, setPlanet } = sectorSlice.actions;

export default sectorSlice.reducer;
