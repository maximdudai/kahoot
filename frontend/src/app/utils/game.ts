export const MAX_GAME_CODE_LENGTH = 6;

export const generateGameId = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

export const saveData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
}

export const getData = (key?: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export const clearData = (key?: string) => {
  if(!key) {
    localStorage.clear();
    return;
  }
  localStorage.removeItem(key);
}