class Player {
  constructor(username, socket, gameid) {
    this.username = username
    this.socket = socket;
    this.gameid = gameid;
    this.answers = [];
    this.score = 0;
    this.inQueue = false;
  }
}

export default Player;