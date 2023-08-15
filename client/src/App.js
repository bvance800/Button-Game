import logo from './logo.svg';
import './App.css';
import { 
  createGameRoom,
  clearGames,
  getAllGames,
  joinGameRoom
 } from './gameUtil';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => createGameRoom('name-game')}>Create Name Game</button>
        <button onClick={() => clearGames()}>Clear Games</button>
        <button onClick={() => getAllGames()}>Get All Games</button>
        <button onClick={() => joinGameRoom()}>Join Game</button>
        <input type="text" id="joinGameCode" placeholder="Enter 5 Digit Game Code"></input>
      </header>
    </div>
  );
}

export default App;
