async function ip() {
    let ip = [];
    for (let i = 0; i < 4; i++) {
      ip.push(Math.floor(Math.random() * 255));
    }

    return ip.join('.');
}

export { ip };