import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { DistanceMap, System, NCO } from '../utils/system-generator/generate-sector';
import { Planet } from '../types/planet-interface';

export const fetchSectorData = createAsyncThunk('sectorSlice/fetchSectorData', async () => {
  try {
    const response = await fetch('https://andromeda-backend-production.up.railway.app/api/sectors');
    const responseJson = await response.json();
    return responseJson.data[0].attributes.sectorA;
  } catch (error) {
    console.error(error);
  }
});

export interface Sector {
  systems: System[];
  NCO: NCO[];
  distancesMap: DistanceMap;
  sectorName: string;
  fleetsInTransit: Array<string>; // fleets here will be storage of ships going from one place to another
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
  activeNCO: {} as NCO,
};
// Controls data being passed from Sector => System => Planet
export const sectorSlice = createSlice({
  name: 'sector',
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder.addCase(fetchSectorData.fulfilled, (state, action) => {
      if (action.payload) state.activeSector = action.payload;
    });
  },
});

export const { setSystem, setPlanet, setNCO } = sectorSlice.actions;

export default sectorSlice.reducer;
