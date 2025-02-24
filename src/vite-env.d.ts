/// <reference types="vite/client" />

interface Window {
  webkitSpeechRecognition: any;
}

declare module 'use-sound' {
  const useSound: any;
  export default useSound;
}

declare module 'react-webcam' {
  const Webcam: any;
  export default Webcam;
}