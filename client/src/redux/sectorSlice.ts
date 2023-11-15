import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { DistanceMap, System, NCO } from '../utils/system-generator/generate-sector';
import { Planet } from '../types/planet-interface';
import { BACKEND_URL } from '../clientLibrary/backendURL';
import { getToken } from './localStorage';

export const fetchSectorData = createAsyncThunk('sectorSlice/fetchSectorData', async () => {
  try {
    const response = await fetch(`${BACKEND_URL}sectors`, {
      method: 'GET',
    });
    const responseJson = await response.json();
    console.log('sector response is', responseJson[0])
    return responseJson[0]
  } catch (error) {
    console.error('Fetch sector data has failed', error);
  }
});

export interface Sector {
  systems: System[];
  NCO: NCO[];
  distancesMap: DistanceMap;
  sectorName: string;
  fleetsInTransit: Array<string>; // fleets here will be storage of ships going from one place to another
}

interface ActiveSector {
  sector: Sector;
  loading: boolean;
}

interface ActiveState {
  activeSector: ActiveSector;
  activeSystem: System;
  activePlanet: Planet;
  activeNCO: NCO;
}

const initialState: ActiveState = {
  activeSector: { sector: {} as Sector, loading: true }, 
  activeSystem: {} as System,
  activePlanet: {} as Planet,
  activeNCO: {} as NCO,
};

// Controls data being passed from Sector => System => Planet
// THIS IS THE VERSION TO USE WITH A SERVER
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
    builder.addCase(fetchSectorData.pending, (state) => {
      state.activeSector.loading = true;
    });
    builder.addCase(fetchSectorData.fulfilled, (state, action) => {
      if (action.payload) {
        state.activeSector.sector = action.payload;
        state.activeSector.loading = false;
      }
    });
  },
});

export const { setSystem, setPlanet, setNCO } = sectorSlice.actions;

export default sectorSlice.reducer;
