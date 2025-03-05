import { useCallback, useRef, useState } from "react";

interface GameStateProps {
  groundY: number;
  jumpForce: number;
  gravity: number;
}

interface Cactus {
  x: number;
  passed: boolean;
}

export function useGameState({ groundY, jumpForce, gravity }: GameStateProps) {
  const [dinoY, setDinoY] = useState(groundY - 40);
  const [dinoVelocity, setDinoVelocity] = useState(0);
  const [cacti, setCacti] = useState<Cactus[]>([{ x: 600, passed: false }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const speedRef = useRef(5);
  const nextCactusRef = useRef(Math.random() * 50 + 50);

  const jump = useCallback(() => {
    if (dinoY === groundY - 40) {
      setDinoVelocity(jumpForce);
    }
  }, [dinoY, groundY, jumpForce]);

  const reset = useCallback(() => {
    setDinoY(groundY - 40);
    setDinoVelocity(0);
    setCacti([{ x: 600, passed: false }]);
    setScore(0);
    setGameOver(false);
    speedRef.current = 5;
    nextCactusRef.current = Math.random() * 50 + 50;
  }, [groundY]);

  const updateGameState = useCallback((deltaTime: number) => {
    if (gameOver) return;

    // Update dino position
    if (dinoY < groundY - 40 || dinoVelocity < 0) {
      setDinoY(y => Math.min(y + dinoVelocity * deltaTime, groundY - 40));
      setDinoVelocity(v => v + gravity * deltaTime);
    }

    // Update cacti
    setCacti(currentCacti => {
      const newCacti = currentCacti
        .map(cactus => ({
          ...cactus,
          x: cactus.x - speedRef.current * deltaTime
        }))
        .filter(cactus => cactus.x > -20);

      // Add score for passed cacti
      currentCacti.forEach(cactus => {
        if (!cactus.passed && cactus.x < 40) {
          setScore(s => s + 1);
          cactus.passed = true;
          speedRef.current += 0.1;
        }
      });

      // Add new cactus
      if (currentCacti[currentCacti.length - 1].x < nextCactusRef.current) {
        newCacti.push({ x: 600, passed: false });
        nextCactusRef.current = Math.random() * 100 + 100;
      }

      return newCacti;
    });

    // Check collisions
    cacti.forEach(cactus => {
      if (
        cactus.x < 90 &&
        cactus.x + 20 > 50 &&
        dinoY + 40 > groundY - 40
      ) {
        setGameOver(true);
      }
    });
  }, [gameOver, dinoY, dinoVelocity, cacti, gravity, groundY]);

  return {
    dinoY,
    dinoVelocity,
    cacti,
    score,
    gameOver,
    jump,
    reset,
    updateGameState
  };
}
