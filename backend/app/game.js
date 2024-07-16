const games = {};

app.post('/create-game', (req, res) => {
  const gameId = Math.random().toString(36).substr(2, 9);
  games[gameId] = {
    id: gameId,
    questions: req.body.questions || [],
    settings: { timePerQuestion: req.body.timePerQuestion || 30 },
    participants: [],
  };
  res.json({ gameId });
});

app.post('/join-game', (req, res) => {
  const { gameId, username } = req.body;
  if (games[gameId]) {
    games[gameId].participants.push({ username, correctAnswers: 0, totalQuestions: 0 });
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Game not found' });
  }
});

app.post('/submit-answer', (req, res) => {
  const { gameId, username, correct } = req.body;
  const game = games[gameId];
  if (game) {
    const participant = game.participants.find(p => p.username === username);
    if (participant) {
      participant.totalQuestions++;
      if (correct) participant.correctAnswers++;
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Participant not found' });
    }
  } else {
    res.json({ success: false, message: 'Game not found' });
  }
});

app.get('/leaderboard/:gameId', (req, res) => {
  const game = games[req.params.gameId];
  if (game) {
    const leaderboard = game.participants.map(p => ({
      username: p.username,
      score: `${p.correctAnswers}/${p.totalQuestions}`,
      percentage: `${((p.correctAnswers / p.totalQuestions) * 100).toFixed(2)}%`
    }));
    res.json(leaderboard);
  } else {
    res.json({ success: false, message: 'Game not found' });
  }
});