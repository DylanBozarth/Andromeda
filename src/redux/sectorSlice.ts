import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DistanceMap, System, NCO } from '../utils/system-generator/generate-sector';
import { Planet } from '../types/planet-interface';

export interface Sector {
  systems: System[];
  NCO: NCO[];
  distancesMap: DistanceMap;
  sectorName: string;
  fleetsInTransit: Array<string> // fleets here will be storage of ships going from one place to another
}

interface ActiveState {
  activeSector: Sector;
  activeSystem: System;
  activePlanet: Planet;
  activeNCO: NCO;
}

const initialState: ActiveState = {
  activeSector: {} as Sector,
  activeSystem: {} as System,
  activePlanet: {} as Planet,
  activeNCO: {} as NCO
};
// Controls data being passed from Sector => System => Planet
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
      state.activeSystem.activePlanet = action.payload;
    },
    setNCO: (state, action: PayloadAction<NCO>) => {
      state.activeNCO = action.payload;
    },
  },
});

export const { setSector, setSystem, setPlanet, setNCO } = sectorSlice.actions;

export default sectorSlice.reducer;
