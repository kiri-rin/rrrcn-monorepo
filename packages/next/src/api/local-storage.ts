export const JWT_LOCAL_STORAGE_KEY = "RRRCN_GIS_JWT";
export const getLocalStorageJWT = () =>
  localStorage.getItem(JWT_LOCAL_STORAGE_KEY);
export const setLocalStorageJWT = (token: string | null) =>
  token !== null
    ? localStorage.setItem(JWT_LOCAL_STORAGE_KEY, token)
    : localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
