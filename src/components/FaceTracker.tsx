import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displaySize, setDisplaySize] = useState({ width: 640, height: 480 });
  const detectionIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load models and setup video
  useEffect(() => {
    let isMounted = true;

    const setupFaceDetection = async () => {
      try {
        // Load all required models
        console.log("Loading face detection models from /models...");
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        
        if (!isMounted) return;
        console.log("All models loaded successfully");
        
        // Start camera after models are loaded
        startCamera();
      } catch (err) {
        console.error("Failed to load models:", err);
        if (isMounted) {
          setError(`Failed to load face detection models: ${err instanceof Error ? err.message : String(err)}`);
          setIsLoading(false);
        }
      }
    };

    setupFaceDetection();

    // Clean up
    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  // Start camera stream
  const startCamera = async () => {
    if (!videoRef.current) return;
    
    try {
      // Stop any existing stream first
      stopCamera();
      
      // Request camera permission and start stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          frameRate: { max: 60 } // Higher framerate for smoother detection
        }
      });
      
      // Store stream for cleanup
      streamRef.current = stream;
      
      // Set video source
      const video = videoRef.current;
      video.srcObject = stream;
      
      // Handle video playback
      video.onloadedmetadata = () => {
        video.play()
          .then(() => {
            console.log("Video playing successfully");
            
            // Update display size based on actual video dimensions
            if (videoRef.current && canvasRef.current) {
              const newSize = {
                width: videoRef.current.clientWidth,
                height: videoRef.current.clientHeight
              };
              setDisplaySize(newSize);
              
              // Update canvas dimensions
              canvasRef.current.width = newSize.width;
              canvasRef.current.height = newSize.height;
              
              // Match dimensions for face-api
              faceapi.matchDimensions(canvasRef.current, newSize);
            }
            
            setIsLoading(false);
            startFaceDetection();
          })
          .catch(err => {
            console.error("Error playing video:", err);
            setError(`Could not play video: ${err instanceof Error ? err.message : String(err)}`);
            setIsLoading(false);
          });
      };
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Could not access camera: ${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
    }
  };

  // Stop camera and clean up
  const stopCamera = () => {
    // Clear detection interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Reset video element
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject = null;
    }
  };

  // Start face detection loop
  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Start detection interval (using setInterval like in face.js)
    detectionIntervalRef.current = window.setInterval(async () => {
      if (video.paused || video.ended) return;
      
      try {
        // Detect all faces with landmarks and expressions
        // This integrates the functionality from face.js
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        
        // Resize detections to match display size
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Clear canvas and draw detections (similar to face.js)
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw video frame first
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Draw detections (boxes around faces)
          faceapi.draw.drawDetections(canvas, resizedDetections);
          
          // Draw landmarks (dots on face features)
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          
          // Draw expressions with minimum confidence threshold (0.05)
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections, 0.05);
          
          // Add cyberpunk styling enhancements
          resizedDetections.forEach(detection => {
            const { box } = detection.detection;
            
            // Add scanning line animation
            const scanLineY = ((Date.now() / 15) % box.height) + box.y;
            ctx.beginPath();
            ctx.moveTo(box.x, scanLineY);
            ctx.lineTo(box.x + box.width, scanLineY);
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Get dominant expression for cyberpunk display
            if (detection.expressions) {
              let dominantExpression = '';
              let maxScore = 0;
              
              // Find expression with highest confidence
              Object.entries(detection.expressions).forEach(([expression, score]) => {
                if (score > maxScore) {
                  maxScore = score;
                  dominantExpression = expression;
                }
              });
              
              if (dominantExpression && maxScore > 0.5) {
                // Format expression name
                dominantExpression = dominantExpression.charAt(0).toUpperCase() + 
                                    dominantExpression.slice(1);
                
                // Draw futuristic expression label
                const labelY = Math.max(10, box.y - 10);
                
                // Background for text
                ctx.fillStyle = 'rgba(13, 13, 25, 0.7)';
                ctx.fillRect(box.x, labelY - 25, box.width, 20);
                
                // Add tech border
                ctx.strokeStyle = '#22D3EE';
                ctx.lineWidth = 1;
                ctx.strokeRect(box.x, labelY - 25, box.width, 20);
                
                // Text label
                ctx.fillStyle = '#22D3EE';
                ctx.font = '14px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                  `${dominantExpression} (${Math.round(maxScore * 100)}%)`,
                  box.x + box.width / 2, 
                  labelY - 15
                );
              }
            }
          });
        }
      } catch (err) {
        console.error("Error in face detection:", err);
      }
    }, 100); // Run detection every 100ms (same as in face.js)
  };

  // Retry face detection
  const retryDetection = () => {
    setError(null);
    setIsLoading(true);
    startCamera();
  };

  return (
    <div className="relative w-full h-full">
      {/* Video element */}
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        style={{ opacity: 0.5 }} // Semi-visible to see both video and detections
      />
      
      {/* Canvas for drawing face detections */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full object-cover z-10"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-cyan-300 z-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
            <p>Loading face detection models...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-red-300 z-20">
          <div className="text-center max-w-md p-4">
            <p className="text-lg font-bold mb-2">Face Detection Error</p>
            <p>{error}</p>
            <button 
              onClick={retryDetection}
              className="mt-4 px-4 py-2 bg-cyan-800/50 hover:bg-cyan-700/50 text-cyan-300 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceTracker;

