import axios from 'axios';

export const getAvailableBuildings = async () => {
  const response = await axios.get('https://andromeda-space-game.herokuapp.com/building');
  return response.data;
};
