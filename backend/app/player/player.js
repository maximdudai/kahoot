class Player {
  constructor(username, socket, token, gameid) {
    this.username = username
    this.socket = socket;
    this.token = token;
    this.gameid = gameid;
    this.answers = [];
    this.score = 0;
    this.inQueue = false;
  }
}

export default Player;