import "./App.css";
import { useState } from "react";
import { GameMode } from "./types";

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  return (
    <>
      <header className="main-header">
        <h1 className="display-text-1">Auto Playtest System</h1>
      </header>
      <main className="main">
        {gameMode ? (
          <PlayGame gameMode={gameMode}></PlayGame>
        ) : (
          <PickGameMode setGameMode={setGameMode}></PickGameMode>
        )}
      </main>
      <footer></footer>
    </>
  );
}

interface PickGameModeProps {
  setGameMode: (gameMode: GameMode) => void;
}
function PickGameMode(props: PickGameModeProps) {
  return (
    <article className="card">
      <header>
        <h1 className="">Pick a game mode</h1>
      </header>
      <section className="button-group-vertical">
        <button
          className="button"
          onClick={() => props.setGameMode(GameMode.PvP)}
        >
          Player vs Player
        </button>
        <button
          className="button"
          onClick={() => props.setGameMode(GameMode.PvC)}
        >
          Player vs Computer
        </button>
        <button
          className="button"
          onClick={() => props.setGameMode(GameMode.CvC)}
        >
          Computer vs Computer
        </button>
      </section>
    </article>
  );
}

interface PlayGameProps {
  gameMode: GameMode;
}
function PlayGame(props: PlayGameProps) {
  return (
    <article className="fluid-card">
      <header>
        <h1 className="">TicTacToe</h1>
        <p className="display-text-3">{props.gameMode}</p>
      </header>
      <section className="screen"></section>
    </article>
  );
}
