export const loadState = () => {
  try {
    const serialState = localStorage.getItem('appState');
    if (serialState === null) {
      return undefined;
    }
    return JSON.parse(serialState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serialState = JSON.stringify(state);
    localStorage.setItem('appState', serialState);
  } catch (err) {
    console.log(err);
  }
};

export const setToken = (userToken: string) => {
  localStorage.setItem('accessToken', userToken);
};

export const getToken = () => {
  return localStorage.getItem('jwt');
};
