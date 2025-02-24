import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import Webcam from 'react-webcam';
import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Camera,
  Calendar, 
  MapPin, 
  Sun, 
  Cloud, 
  Mic,
  Power,
  MessageSquare,
  Volume2,
  VolumeX,
  Camera as CameraIcon,
  RefreshCcw,
  Users,
  Hand,
  Smile,
  Frown,
  ThumbsUp,
  ThumbsDown,
  Wind,
  Droplets,
  Settings,
  Sliders,
  Timer,
  Newspaper,
  Activity,
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Brain,
  Rocket,
  Trophy,
  Medal,
  Sparkles,
  Code,
  Cpu,
  Gamepad
} from 'lucide-react';
import { collegeConfig } from './config/college-config';
import './styles/cyberpunk.css';
import './styles/theme.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isListening, setIsListening] = useState(false);
  const [weather] = useState({ temp: 28, condition: 'Sunny' });
  const [cameraActive, setCameraActive] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [interactionCount, setInteractionCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    voice: 0
  });
  const [forecast] = useState([
    { day: 'Today', temp: 28, condition: 'Sunny' },
    { day: 'Tomorrow', temp: 25, condition: 'Cloudy' },
    { day: 'Wednesday', temp: 23, condition: 'Rainy' }
  ]);
  const webcamRef = useRef<Webcam>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const lastInteractionRef = useRef<number>(Date.now());
  const recognitionRef = useRef<any>(null);
  const commandRecognitionRef = useRef<any>(null);

  // Background music
  const [play, { stop }] = useSound('/ambient-background.mp3', {
    loop: true,
    volume: 0.3
  });

  const events = [
    { name: 'Robotics Workshop', venue: 'Lab 201', time: '10:00 AM' },
    { name: 'AI Symposium', venue: 'Auditorium', time: '2:00 PM' },
    { name: 'Drone Racing', venue: 'College Ground', time: '4:00 PM' },
    { name: 'Tech Quiz', venue: 'Seminar Hall', time: '11:30 AM' }
  ];

  // Quick commands for common interactions
  const festFeatures = [
    { 
      text: "Live Competitions", 
      icon: Trophy,
      action: () => speak("Currently ongoing: Hackathon in Lab 201, Robotics in Ground Floor")
    },
    { 
      text: "Register Team", 
      icon: Users,
      action: () => speak("Opening team registration portal. Maximum team size is 4 members.")
    },
    { 
      text: "Tech Showcase", 
      icon: Sparkles,
      action: () => speak("Latest projects: AI Chess Bot, Smart Agriculture Drone, and Autonomous Robot")
    },
    { 
      text: "Gaming Arena", 
      icon: Gamepad,
      action: () => speak("Gaming arena is open in Lab 302. Tournaments: FIFA, Valorant, CS:GO")
    }
  ];

  // Reset to default state after inactivity
  const resetToDefault = useCallback(() => {
    setCameraActive(false);
    setLastMessage('');
    setCapturedImage(null);
    setProcessedImage(null);
    setIsListening(false);
    if (!isMuted) play();
  }, [isMuted, play]);

  // Track user interaction
  const handleInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setInteractionCount(prev => prev + 1);
    
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    inactivityTimerRef.current = setTimeout(() => {
      const timeSinceLastInteraction = Date.now() - lastInteractionRef.current;
      if (timeSinceLastInteraction >= 15000) {
        resetToDefault();
      }
    }, 15000);
  }, [resetToDefault]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Start background music if not muted
    if (!isMuted) play();

    return () => {
      clearInterval(timer);
      stop();
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isMuted, play, stop]);

  // Add webcam config
  const webcamConfig = {
    width: 720,
    height: 480,
    facingMode: { exact: "environment" }, // Use back camera
    screenshotFormat: "image/jpeg",
    videoConstraints: {
      facingMode: { exact: "environment" },
      aspectRatio: 0.75
    }
  };

  // Modified capture image function
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCapturedImage(imageSrc);
          handleInteraction();
          speak("Photo captured successfully!");
        } else {
          speak("Failed to capture photo. Please try again.");
        }
      } catch (error) {
        console.error('Error capturing image:', error);
        speak("There was an error capturing the photo.");
      }
    }
  }, [handleInteraction]);

  // Process image with AI
  const processImage = useCallback(async (effect: 'younger' | 'older') => {
    if (!capturedImage) return;
    
    setIsProcessingImage(true);
    try {
      // In a real implementation, you would send the image to an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessedImage(capturedImage); // In reality, this would be the processed image
    } finally {
      setIsProcessingImage(false);
    }
  }, [capturedImage]);

  // Updated chatWithAI function with better prompting
  const chatWithAI = useCallback(async (message: string) => {
    try {
      setIsTyping(true);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are Asthra Bot, a helpful AI assistant for ${collegeConfig.name}'s tech fest.
                       Guidelines:
                       1. Give natural, conversational responses (2-3 sentences)
                       2. Be friendly but professional
                       3. Include specific details about events, venues, and timings
                       4. Use a warm, engaging tone
                       5. For event queries, always mention: name, venue, time, and one key highlight
                       6. If unsure, ask for clarification
                       College Details: ${JSON.stringify(collegeConfig)}`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7, // Balanced between creative and focused
          max_tokens: 150,  // Allow longer responses
          presence_penalty: 0.3, // Moderate penalty for repetition
          frequency_penalty: 0.3 // Moderate penalty for repetitive language
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Groq API');
      }

      const data = await response.json();
      let aiResponse = data.choices[0]?.message?.content || "I couldn't process that request. Could you try asking differently?";
      
      // Ensure response isn't too long but keeps complete sentences
      if (aiResponse.length > 200) {
        const sentences = aiResponse.match(/[^.!?]+[.!?]+/g) || [];
        aiResponse = sentences.slice(0, 3).join(' '); // Keep first 3 sentences
      }

      speak(aiResponse);
    } catch (error) {
      console.error('Error chatting with AI:', error);
      speak("I'm having trouble processing that request. Please try again in a moment.");
    } finally {
      setIsTyping(false);
    }
  }, []);

  // Gesture detection setup
  useEffect(() => {
    if (gesturesEnabled && webcamRef.current) {
      // Simple gesture detection using hand tracking
      const detectGestures = async () => {
        // Implement hand tracking using mediapipe or similar library
        // This is a placeholder for actual implementation
      };
      detectGestures();
    }
  }, [gesturesEnabled]);

  // Simplified createRecognition function
  const createRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      speak("Speech recognition is not supported in this browser.");
      return null;
    }
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    return recognition;
  }, []);

  // Enhanced speak function with typing animation
  const speak = (text: string) => {
    setIsTyping(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > voiceSettings.voice) {
      utterance.voice = voices[voiceSettings.voice];
    }

    // Simulate typing effect
    setTimeout(() => {
      setIsTyping(false);
      window.speechSynthesis.speak(utterance);
      setLastMessage(text);
      // Simple sentiment analysis
      setSentiment(text.includes('sorry') || text.includes('cannot') ? 'negative' : 'positive');
      handleInteraction();
    }, 1000);
  };

  // Modified handleVoiceCommand function
  const handleVoiceCommand = useCallback(() => {
    const recognition = createRecognition();
    if (!recognition) return;

    setIsListening(true);
    stop(); // Stop background music

    recognition.onresult = async (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log('Command received:', command);
      setIsListening(false);
      if (!isMuted) play();
      await chatWithAI(command);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!isMuted) play();
      commandRecognitionRef.current = null;
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (!isMuted) play();
        speak("Sorry, I couldn't understand that.");
      }
      commandRecognitionRef.current = null;
    };

    try {
      commandRecognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
      if (!isMuted) play();
    }
  }, [createRecognition, chatWithAI, isMuted, play, stop]);

  // Single handleVoiceButtonClick implementation
  const handleVoiceButtonClick = useCallback(() => {
    if (isListening) {
      // Stop recognition if it's active
      if (commandRecognitionRef.current) {
        commandRecognitionRef.current.stop();
        commandRecognitionRef.current = null;
      }
      setIsListening(false);
      window.speechSynthesis.cancel();
      if (!isMuted) play();
    } else {
      // Start voice command directly without greeting
      handleVoiceCommand();
    }
  }, [isListening, handleVoiceCommand, isMuted, play]);

  // Update cleanup useEffect
  useEffect(() => {
    return () => {
      if (commandRecognitionRef.current) {
        commandRecognitionRef.current.stop();
      }
    };
  }, []);

  // New state for added features
  const [countdown, setCountdown] = useState<number | null>(null);
  const [news] = useState([
    { title: "New AI Lab Opening", time: "2h ago" },
    { title: "Robotics Team Wins National", time: "4h ago" },
    { title: "Tech Fest Registration Open", time: "5h ago" }
  ]);
  const [systemStatus] = useState({
    cpu: "32%",
    memory: "4.2GB",
    network: "120Mb/s"
  });
  const [currentSong] = useState({
    title: "Ambient Theme",
    artist: "Tech Fest",
    duration: "3:45"
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [registrationMode, setRegistrationMode] = useState(false);
  const [festSchedule, setFestSchedule] = useState<'workshops' | 'events' | 'all'>('all');

  // Add timer function
  const startCountdown = useCallback((minutes: number) => {
    setCountdown(minutes * 60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          speak("Timer completed!");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Handle music controls
  const handleMusicControl = useCallback((action: 'play' | 'pause' | 'next' | 'prev') => {
    switch(action) {
      case 'play':
        setIsPlaying(true);
        play();
        break;
      case 'pause':
        setIsPlaying(false);
        stop();
        break;
      case 'next':
      case 'prev':
        // Implement playlist navigation
        break;
    }
  }, [play, stop]);

  // Add these constants before the renderTechFeatures function
  const activeCompetitions = [
    { name: 'Hackathon', status: 'live', participants: 120 },
    { name: 'Coding Contest', status: 'live', participants: 85 },
    { name: 'Robot Wars', status: 'upcoming', participants: 45 }
  ];

  const gamingTournaments = [
    { game: 'Valorant', prize: '₹10,000', slots: '16 teams remaining' },
    { game: 'FIFA 24', prize: '₹5,000', slots: '8 slots open' },
    { game: 'CS:GO', prize: '₹8,000', slots: '12 teams registered' }
  ];

  // Simplified renderTechFeatures to avoid potential errors
  const renderTechFeatures = () => (
    <div className="space-y-4">
      <div className="cyber-panel">
        <h3 className="text-xl font-bold text-cyber-blue mb-2">Live Updates</h3>
        <div className="space-y-2">
          {activeCompetitions.map((comp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 glass-panel"
            >
              <div className="flex items-center space-x-2">
                {comp.status === 'live' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
                <span>{comp.name}</span>
              </div>
              <span className="text-sm text-cyber-purple">
                {comp.participants} participants
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="cyber-panel">
        <h3 className="text-xl font-bold text-cyber-blue mb-2">Gaming Zone</h3>
        {gamingTournaments.map((tournament, idx) => (
          <div
            key={idx}
            className="glass-panel p-2 mb-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold">{tournament.game}</span>
              <span className="text-cyber-purple">{tournament.prize}</span>
            </div>
            <div className="text-sm text-cyber-blue">{tournament.slots}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const DepartmentEvents = ({ department }: { department: typeof collegeConfig.departments[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-panel space-y-4"
    >
      <h3 className="text-xl font-bold text-cyber-blue">{department.name}</h3>
      <div className="grid gap-4">
        {department.events.map((event, idx) => (
          <motion.div
            key={idx}
            className="glass-panel p-4"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-lg text-cyber-blue">{event.name}</h4>
            <p className="text-sm text-white/80">{event.description}</p>
            <div className="flex justify-between mt-2 text-sm">
              <span>{event.venue}</span>
              <span>{event.time}</span>
            </div>
            <div className="mt-2 text-cyber-blue">Prize: {event.prize}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen grid-background bg-[#050714] text-cyan-50">
      {/* Header */}
      <motion.header 
        className="asthra-card m-4 p-4 rounded-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <Bot className="w-10 h-10 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold neon-text bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {collegeConfig.festDetails.name}
              </h1>
              <p className="text-sm text-cyan-300/70">{collegeConfig.festDetails.theme}</p>
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-6">
            <motion.div 
              className="asthra-card px-4 py-2 rounded-lg flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300">{interactionCount}</span>
            </motion.div>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="asthra-button p-2 rounded-lg"
            >
              {isMuted ? 
                <VolumeX className="w-5 h-5 text-red-400" /> : 
                <Volume2 className="w-5 h-5 text-green-400" />
              }
            </button>
            
            <div className="text-xl font-mono text-cyan-300">
              {format(currentTime, 'HH:mm:ss')}
            </div>
          </div>
        </div>
      </motion.header>

      <main className="grid grid-cols-12 gap-6 p-4">
        {/* Left Column - Camera and Controls */}
        <div className="col-span-5 space-y-6">
          <motion.div 
            className="asthra-card rounded-xl p-1 hologram-effect"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {cameraActive ? (
              <div className="relative rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <motion.button
                  className="absolute bottom-4 right-4 asthra-button p-3 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={captureImage}
                >
                  <CameraIcon className="w-6 h-6 text-cyan-400" />
                </motion.button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setCameraActive(true)}
                  className="cyber-button flex items-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Activate Camera</span>
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Voice Controls */}
          <motion.div 
            className="asthra-card rounded-xl p-6 relative overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={handleVoiceButtonClick}
          >
            <div className={`w-full h-full flex flex-col items-center justify-center space-y-3
              ${isListening ? 'animate-pulse' : ''}`}
            >
              <div className={`p-4 rounded-full ${
                isListening ? 'bg-red-500/20' : 'asthra-button'
              }`}>
                <Mic className="w-8 h-8 text-cyan-400" />
              </div>
              <span className="text-sm text-cyan-300">
                {isListening ? 'Listening...' : 'Click to Speak'}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-purple-500/10"></div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-3">
              {festFeatures.map((feature, index) => (
                <motion.button
                  key={index}
                  className="asthra-button rounded-xl p-3 flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={feature.action}
                >
                  <feature.icon className="w-6 h-6 text-cyan-400 mb-2" />
                  <span className="text-xs text-cyan-300">{feature.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Events and Activities */}
        <div className="col-span-4 cyber-panel-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Live Events</h2>
            <div className="flex space-x-2">
              {['all', 'workshops', 'events'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFestSchedule(type as any)}
                  className={`cyber-button px-2 py-1 text-xs ${
                    festSchedule === type ? 'bg-cyber-blue/30' : ''
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 cyber-scroll overflow-y-auto pr-2 space-y-2">
            {collegeConfig.departments.map((dept, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-3"
              >
                <h3 className="text-sm font-bold mb-2">{dept.name}</h3>
                <div className="space-y-1">
                  {dept.events.map((event, eventIdx) => (
                    <motion.div
                      key={eventIdx}
                      whileHover={{ x: 5 }}
                      className="text-xs bg-black/20 p-2 rounded"
                    >
                      <div className="flex justify-between">
                        <span>{event.name}</span>
                        <span className="text-cyber-purple">{event.time}</span>
                      </div>
                      <div className="text-cyber-blue/70 mt-1">
                        {event.venue}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column - Info and Stats */}
        <div className="col-span-3 space-y-4">
          {/* Weather and Location */}
          <motion.div 
            className="cyber-panel p-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-bold">{weather.temp}°C</div>
                <div className="text-xs text-cyber-purple">{collegeConfig.location}</div>
              </div>
              {weather.condition === 'Sunny' ? (
                <Sun className="w-8 h-8 text-cyber-yellow" />
              ) : (
                <Cloud className="w-8 h-8 text-cyber-blue" />
              )}
            </div>
          </motion.div>

          {/* Live Stats */}
          <motion.div 
            className="cyber-panel p-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-bold mb-2">Live Statistics</h3>
            <div className="space-y-2">
              {activeCompetitions.map((comp, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    {comp.status === 'live' && (
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    )}
                    <span>{comp.name}</span>
                  </div>
                  <span className="text-cyber-purple">{comp.participants}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contacts */}
          <motion.div 
            className="cyber-panel p-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-bold mb-2">Quick Contacts</h3>
            <div className="space-y-2">
              {collegeConfig.contacts.slice(0, 3).map((contact, idx) => (
                <div key={idx} className="text-xs glass-panel p-2">
                  <div className="font-bold">{contact.name}</div>
                  <div className="text-cyber-purple">{contact.role}</div>
                  <div className="text-cyber-blue/70">{contact.phone}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Last Message */}
          {lastMessage && (
            <motion.div 
              className="cyber-panel p-3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <MessageSquare className="w-4 h-4" />
                <h3 className="text-sm font-bold">Last Response</h3>
              </div>
              <p className="text-xs text-cyber-blue/80">{lastMessage}</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;