import axios from 'axios';
import { DATA_API_URL } from '.';

export const getAvailableBuildings = async () => {
  const response = await axios.get(`${DATA_API_URL}/building`);
  return response.data;
};
