export const generateUniqueId = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    return 'user' + code;
}