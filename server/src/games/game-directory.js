import { info as nameGame } from './name-game/index.js';

const directory = [
  nameGame
]

function getRegisteredGame(gameId){
  let foundGameIndex = -1;
  foundGameIndex = directory.findIndex((gameInfo) => {
    return gameInfo.id === gameId
  })
  if(foundGameIndex < 0){
    console.log("sorry no game type:", gameId)
    return null;
  }
  return directory[foundGameIndex];
}

export { directory, getRegisteredGame }
