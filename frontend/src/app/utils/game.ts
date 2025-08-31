export const MAX_GAME_CODE_LENGTH = 6;

export const generateGameId = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

export const saveData = (item: any | any[]) => {
  if (Array.isArray(item)) {
    item.forEach((i) => localStorage.setItem(i.toString(), JSON.stringify(i)));
  } else {
    localStorage.setItem(item.toString(), JSON.stringify(item));
  }
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