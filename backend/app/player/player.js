class Player {
  constructor(username, socket, gameid) {
    this.username = username
    this.socket = socket;
    this.gameid = gameid;
    this.score = 0;
  }

  increaseScore() {
    this.score++;
  }

  setGameId(gameid) {
    this.gameid = gameid;
  }

  getGameId() {
    return this.gameid;
  }

  getUsername() {
    return this.username;
  }

  getScore() {
    return this.score;
  }

  resetScore() {
    this.score = 0;
  }

  resetGameId() {
    this.gameid = null;
  }

  toJSON() {
    return {
      name: this.name,
      score: this.score,
      gameid: this.gameid,
    };
  }
}

module.exports = Player;