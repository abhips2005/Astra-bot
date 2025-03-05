import React from 'react';

interface GameOverPopoverProps {
  score: number;
  onRestart: () => void;
  onExit: () => void;
}

const GameOverPopover: React.FC<GameOverPopoverProps> = ({ score, onRestart, onExit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#0d0d19] p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <p className="text-lg mb-4">Your score: {score}</p>
        <button className="asthra-button mb-4" onClick={onRestart}>
          Restart
        </button>
        <button className="asthra-button" onClick={onExit}>
          Exit
        </button>
      </div>
    </div>
  );
};

export default GameOverPopover;
