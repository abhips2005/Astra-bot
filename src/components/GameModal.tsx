import React from 'react';
import { motion } from 'framer-motion';
import {DinoGame} from './DinoGame';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-[#0d0d19] p-6 rounded-lg shadow-lg w-full h-full max-w-90vw max-h-90vh relative flex flex-col items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button 
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <DinoGame />
        <button className="asthra-button mt-4" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default GameModal;
