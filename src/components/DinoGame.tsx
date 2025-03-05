import { useEffect, useRef, useState } from "react";
import { useGameLoop } from "./hooks/useGameLoop";
import { useGameState } from "./hooks/useGameState";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const GROUND_HEIGHT = 20;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 40;
const JUMP_FORCE = -12;
const GRAVITY = 0.6;

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("dinoHighScore") || "0");
  });

  const {
    dinoY,
    dinoVelocity,
    obstacles,
    score,
    gameOver,
    jump,
    reset,
    updateGameState
  } = useGameState({
    groundY: CANVAS_HEIGHT - GROUND_HEIGHT,
    jumpForce: JUMP_FORCE,
    gravity: GRAVITY
  });

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("dinoHighScore", score.toString());
    }
  }, [score, highScore]);

  useGameLoop((deltaTime) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1C2445"; // Dark blue background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = "#0E4455"; // Teal ground
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);

    // Draw dino
    ctx.fillStyle = "#22D3EE"; // Cyan dino
    ctx.fillRect(50, dinoY, DINO_WIDTH, DINO_HEIGHT);

    // Draw obstacles
    ctx.fillStyle = "#0E4455"; // Teal obstacles
    obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw score
    ctx.font = "20px monospace";
    ctx.fillStyle = "#22D3EE"; // Cyan text
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${score}`, CANVAS_WIDTH - 20, 30);
    ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH - 20, 60);

    if (gameOver) {
      ctx.fillStyle = "#22D3EE"; // Cyan text
      ctx.textAlign = "center";
      ctx.font = "30px monospace";
      ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = "20px monospace";
      ctx.fillText("Press SPACE to restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }

    updateGameState(deltaTime);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameOver) {
          reset();
        } else {
          jump();
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (gameOver) {
        reset();
      } else {
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [jump, reset, gameOver]);

  const handleClick = () => {
    if (gameOver) {
      reset();
    } else {
      jump();
    }
  };

  return (
    <div className="p-4 w-fit mx-auto bg-[#1C2445] border-[#0E4455]">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleClick}
        className="border-2 border-[#0E4455] cursor-pointer rounded-lg"
        style={{ imageRendering: "pixelated" }}
      />
      <p className="text-sm text-center mt-2 text-[#22D3EE]">
        Press SPACE or click to jump
      </p>
    </div>
  );
}