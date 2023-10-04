import * as GameDirectory from "../games/game-directory.js";
const alphaCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const otherCharacters = '0123456789!@#&';

let currentGames = [];

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
  const gameId = req.body.type;
  const registeredGame = GameDirectory.getRegisteredGame(gameId)

  if(!registeredGame){
    message = "Game type does not exist";
    success = false;
    sendResponse(res, success, data, message);
    return;
  }

  const newGame = createGame(gameId);
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

export {
  handleCreateGame,
  handleClearAllGames,
  handleGetAllGames,
  handleJoinGame
};