import { createSlice } from '@reduxjs/toolkit';

interface TestState {
  testCount: number;
}

const initialState: TestState = {
  testCount: 0,
};

export const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    increment: (state) => {
      state.testCount += 1;
    },
    decrement: (state) => {
      state.testCount -= 1;
    },
  },
});

export const { increment, decrement } = testSlice.actions;

export default testSlice.reducer;
