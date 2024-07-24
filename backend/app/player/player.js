class Player {
  constructor(name, socket, gameid, creator = false) {
    this.name = name;
    this.socket = socket;
    this.gameid = gameid;
    this.isCreator = creator
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

  getName() {
    return this.name;
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