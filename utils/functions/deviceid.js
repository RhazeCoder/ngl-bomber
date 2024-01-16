async function deviceid() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let deviceId = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      deviceId += characters.charAt(randomIndex);
    }
  
    return deviceId;
}

export { deviceid };