import { useCallback, useRef, useState } from "react";

interface GameStateProps {
  groundY: number;
  jumpForce: number;
  gravity: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

export function useGameState({ groundY, jumpForce, gravity }: GameStateProps) {
  const [dinoY, setDinoY] = useState(groundY - 40);
  const [dinoVelocity, setDinoVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([{ x: 600, y: groundY - 40, width: 20, height: 40, passed: false }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const speedRef = useRef(10);
  const nextObstacleRef = useRef(Math.random() * 50 + 50);

  const jump = useCallback(() => {
    if (dinoY === groundY - 40) {
      setDinoVelocity(jumpForce);
    }
  }, [dinoY, groundY, jumpForce]);

  const reset = useCallback(() => {
    setDinoY(groundY - 40);
    setDinoVelocity(0);
    setObstacles([{ x: 600, y: groundY - 40, width: 20, height: 40, passed: false }]);
    setScore(0);
    setGameOver(false);
    speedRef.current = 10;
    nextObstacleRef.current = Math.random() * 50 + 50;
  }, [groundY]);

  const updateGameState = useCallback((deltaTime: number) => {
    if (gameOver) return;

    // Update dino position
    if (dinoY < groundY - 40 || dinoVelocity < 0) {
      setDinoY(y => Math.min(y + dinoVelocity * deltaTime, groundY - 40));
      setDinoVelocity(v => v + gravity * deltaTime);
    }

    // Update obstacles
    setObstacles(currentObstacles => {
      const newObstacles = currentObstacles
        .map(obstacle => ({
          ...obstacle,
          x: obstacle.x - speedRef.current * deltaTime
        }))
        .filter(obstacle => obstacle.x > -obstacle.width);

      // Add score for passed obstacles
      currentObstacles.forEach(obstacle => {
        if (!obstacle.passed && obstacle.x < 40) {
          setScore(s => s + 1);
          obstacle.passed = true;
          speedRef.current += 0.5;
        }
      });

      // Add new obstacle
      if (currentObstacles[currentObstacles.length - 1].x < nextObstacleRef.current) {
        const width = Math.random() * 20 + 20; // Random width between 20 and 40
        const height = Math.random() * 20 + 40; // Random height between 40 and 60
        const y = Math.random() > 0.5 ? groundY - height : groundY - height - 60; // Randomly place obstacle on ground or flying
        newObstacles.push({ x: 600, y, width, height, passed: false });
        nextObstacleRef.current = Math.random() * 100 + 100;
      }

      return newObstacles;
    });

    // Check collisions
    obstacles.forEach(obstacle => {
      if (
        obstacle.x < 90 &&
        obstacle.x + obstacle.width > 50 &&
        dinoY + 40 > obstacle.y &&
        dinoY < obstacle.y + obstacle.height
      ) {
        setGameOver(true);
      }
    });
  }, [gameOver, dinoY, dinoVelocity, obstacles, gravity, groundY]);

  return {
    dinoY,
    dinoVelocity,
    obstacles,
    score,
    gameOver,
    jump,
    reset,
    updateGameState
  };
}
