import { Server } from "socket.io";
import express from 'express';
import http from 'http';

const app = express()
const server = http.createServer(app);
const port = process.env.PORT || 8080
const io = new Server(server);

app.use(express.json());
server.listen(port);

const alphaCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const otherCharacters = '0123456789!@#&';

let currentGames = [];
const registeredGames = {
  'swap-name':{
      minPlayers: 2
  }
}

function clearGames(){
  currentGames = [];
}

function createGame(gameType){
  const id = createUniqueGameId();
  let game = {
    id: id,
    type: gameType,
    state: 'not-ready-to-start',
    requiredNumberOfPlayers: 2,
    players: []
  }
  return game;
}

function getRegisteredGame(gameType){
  console.log(gameType);
  console.log(registeredGames)
  if(!registeredGames.hasOwnProperty(gameType)){
    console.log("sorry no game type:", gameType)
    return null;
  }
  return registeredGames[gameType];
}

function createId(length = 5, characters = alphaCharacters){
  let result           = '';
  let charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function createUniqueGameId(){
  let id = createId();
  if(!idIsUnique(id, currentGames)){
    return createUniqueGameId()
  }
  return id;
}

function idIsUnique(id, objectsWithIds){
  let isUnique = true;
  objectsWithIds.forEach(function(obj){
    if(obj.id === id){
      isUnique = false;
    }
  })
  return isUnique;
}

function createUniquePlayerId(gameData){
  let id = createId(10, alphaCharacters + otherCharacters);
  if(!idIsUnique(id, gameData.players)){
    console.log('is not unique player id:', id)
    return createUniquePlayerId(gameData)
  }
  return id;
}


function getGameByCode(gameCode){
  let currentGame = null
  currentGames.forEach(function(game){
    if(game.id === gameCode){
      currentGame = game;
    }
  })
  return currentGame;
}

function joinGame(gameCode){
  console.log('Joining game with code: ', gameCode)
  const gameToJoin = getGameByCode(gameCode);

  if(!gameToJoin){
    return null;
  }

  const playerID = createUniquePlayerId(gameToJoin);
  gameToJoin.players.push(playerID);
  const returnData = {
    game: gameToJoin,
    playerId: playerID
  }
  return returnData
}

function sendResponse(res, success, data, message = 'No message'){
  let payload = {
    success: success,
    data: data,
    message: message 
  }
  res.json(payload)
}

function handleJoinGame(req, res){
  let success = true;
  let gameData = null;
  let message = '';

  const joinCode = req.body.joinCode;
  if(!joinCode){
    success = false;
    message = "No gamecode provided";
    sendResponse(res, success, gameData, message)
    return;
  }

  gameData = joinGame(joinCode)
  if(!gameData){
    success = false;
    message = "Invalid Game Code";
    sendResponse(res, success, gameData, message)
    return;
  }

  sendResponse(res, true, gameData)
}

function handleCreateGame(req, res){
  let success = true;
  let data = {};
  let message = "";
  const gameType = req.body.type;
  const registeredGame = getRegisteredGame(gameType)

  if(!registeredGame){
    message = "Game type does not exist";
    success = false;
    sendResponse(res, success, data, message);
    return;
  }

  const newGame = createGame(gameType);
  currentGames.push(newGame);
  data.game = newGame;
  sendResponse(res, success, data)
}

function handleClearAllGames(req, res){
  const data = null;
  const message = "Cleared all games from server";
  
  clearGames();
  sendResponse(res, true, data, message);
}

function handleGetAllGames(req, res){
  const success = true;
  const data = {
    games: currentGames
  }
  sendResponse(res, success, data);
}

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

io.on("connection", (socket) => {
  // send a message to the client
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

  // receive a message from the client
  socket.on("hello from client", (...args) => {
    // ...
  });
});
// END ENDPOINTS