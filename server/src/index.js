import express from 'express';
import http from 'http';
import {  handleClearAllGames,
          handleCreateGame,
          handleGetAllGames,
          handleJoinGame } from './game-core/game-core.js';

const app = express()
const server = http.createServer(app);
const port = process.env.PORT || 8080

server.listen(port);
app.use(express.json());

// BEGIN ENDPOINTS
app.post('/create-room', (req, res) => {
  handleCreateGame(req, res);
})

app.post('/clear-games', (req, res) => {
  handleClearAllGames(req, res);
})

app.get('/get-all-games', (req, res) => {
  handleGetAllGames(req, res)
})

app.post('/join-game', (req, res) => {
  console.log('Request to join game received')
  handleJoinGame(req, res);
})
// END ENDPOINTS