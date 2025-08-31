export const MAX_GAME_CODE_LENGTH = 6;

export const generateGameId = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}
