import {get, post} from './requestCore.js';

export async function createGameRoom(gameType){
    const data = {type : gameType}
    console.log("sending: ", data)
    const body = await post('create-room', data);
    console.log(body)
}

export async function joinGameRoom(){
    console.log("Joining Game")
    const gameCode = getJoinGameCode();
    if(!gameCode || gameCode === ''){
        console.log('please enter gamecode')
        return false;
    }
    const body = await post('join-game', {joinCode: gameCode})
    console.log(body)
}

export async function clearGames(){
    const body = await post('clear-games');
    console.log(body)
}

export async function getAllGames(){
    const body = await get('get-all-games');
    console.log(body);
}

export function getJoinGameCode(){
    return document.getElementById('joinGameCode').value.toUpperCase();
    
}

export function setLocalStorageItem(key, value) {
    window.localStorage.setItem(key, value);
}

export function getLocalStorageItem(key) {
    return window.localStorage.getItem(key);
}