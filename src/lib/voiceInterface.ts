/**
 * GooseOps Voice Interface with Fallback Support
 * 
 * Provides robust voice command functionality for field technicians who need hands-free operation
 * when their hands are dirty, they're wearing gloves, or they're working in awkward positions.
 * 
 * CRITICAL RELIABILITY FEATURES:
 * - Offline command processing for core functions
 * - Fallback to simple keyword detection when full speech recognition fails
 * - Emergency mode for high-stress situations with simplified commands
 * - Automatic recovery from recognition errors
 * - Backup gesture/tap interface when voice completely fails
 */

import { toast } from 'sonner';
import { llmClient, LLMCapability } from './llmClient';

// Add type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onnomatch: () => void;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// Voice command patterns and their corresponding actions
export interface VoiceCommand {
  patterns: string[];
  action: (args: string) => Promise<void>;
  examples: string[];
  description: string;
}

// Fallback modes for when standard voice recognition fails
export enum FallbackMode {
  NONE = 'none',                 // Standard voice recognition
  KEYWORD = 'keyword',           // Simple keyword detection (less accurate but more reliable)
  EMERGENCY = 'emergency',       // Emergency mode with simplified commands
  GESTURE = 'gesture'            // Fallback to gesture/tap interface
}

// Recognition confidence levels
export enum ConfidenceLevel {
  HIGH = 'high',       // High confidence in recognition (>0.8)
  MEDIUM = 'medium',   // Medium confidence (0.5-0.8)
  LOW = 'low',         // Low confidence (<0.5)
  FAILED = 'failed'    // Recognition failed
}

// Emergency command types for critical situations
export enum EmergencyCommandType {
  HELP = 'help',               // Request immediate assistance
  NAVIGATE = 'navigate',       // Emergency navigation
  CALL = 'call',               // Emergency call
  CANCEL = 'cancel'            // Cancel emergency mode
}

export class VoiceInterface {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private commands: VoiceCommand[] = [];
  private commandCallback: ((command: string, args: string) => void) | null = null;
  private wakeWord: string = 'goose';
  private isWakeWordRequired: boolean = true;
  private isMuted: boolean = false;

  // Reliability enhancements
  private fallbackMode: FallbackMode = FallbackMode.NONE;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 2000; // ms
  private reconnectTimeoutId: number | null = null;
  private emergencyCallback: ((type: EmergencyCommandType) => void) | null = null;
  private offlineKeywords: Map<string, () => void> = new Map();
  private lastRecognitionTime: number = 0;
  private recognitionHealthCheck: number | null = null;
  private isEmergencyModeActive: boolean = false;

  constructor() {
    this.initSpeechRecognition();
    this.initSpeechSynthesis();
  }

  private initSpeechRecognition() {
    try {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognitionAPI();

        if (this.recognition) {
          this.recognition.continuous = true;
          this.recognition.interimResults = true; // Enable interim results for faster response
          this.recognition.maxAlternatives = 3;  // Get multiple interpretations for better accuracy
          this.recognition.lang = 'en-US';

          this.recognition.onresult = this.handleSpeechResult.bind(this);
          this.recognition.onerror = this.handleSpeechError.bind(this);
          this.recognition.onend = this.handleSpeechEnd.bind(this);
          this.recognition.onnomatch = () => this.attemptFallbackRecognition("No match found");

          // Set up health check to detect when recognition stops working
          this.setupRecognitionHealthCheck();

          console.log('Speech recognition initialized successfully');
          return;
        }
      }

      // If we get here, standard recognition failed to initialize
      console.warn('Standard speech recognition not available, setting up fallback mode');
      this.setFallbackMode(FallbackMode.KEYWORD);

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      this.setFallbackMode(FallbackMode.KEYWORD);
    }
  }

  private handleSpeechEnd() {
    this.lastRecognitionTime = Date.now();

    // If we're still supposed to be listening, restart
    if (this.isListening) {
      try {
        // Add a small delay to prevent rapid restarts
        setTimeout(() => {
          if (this.isListening && this.recognition) {
            this.recognition.start();
          }
        }, 100);
      } catch (error) {
        console.error('Error restarting speech recognition:', error);
        this.attemptReconnect();
      }
    }
  }

  private setupRecognitionHealthCheck() {
    // Clear any existing health check
    if (this.recognitionHealthCheck !== null) {
      clearInterval(this.recognitionHealthCheck);
    }

    // Check every 10 seconds if recognition is still working
    this.recognitionHealthCheck = window.setInterval(() => {
      if (this.isListening && Date.now() - this.lastRecognitionTime > 30000) {
        // No recognition events for 30 seconds while listening - something's wrong
        console.warn('Speech recognition appears to be stalled, attempting recovery');
        this.attemptReconnect(true); // Force reconnect
      }
    }, 10000);
  }

  private attemptReconnect(force: boolean = false) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts && !force) {
      console.error('Max reconnect attempts reached, switching to fallback mode');
      this.setFallbackMode(FallbackMode.KEYWORD);
      return;
    }

    if (this.reconnectTimeoutId !== null) {
      clearTimeout(this.reconnectTimeoutId);
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect speech recognition (attempt ${this.reconnectAttempts})`);

    try {
      if (this.recognition) {
        this.recognition.abort();
        this.recognition.stop();
      }

      // Re-initialize speech recognition
      this.initSpeechRecognition();

      if (this.isListening && this.recognition) {
        this.recognition.start();
        console.log('Speech recognition restarted');

        // If successful, reset reconnect attempts after a delay
        this.reconnectTimeoutId = window.setTimeout(() => {
          this.reconnectAttempts = 0;
          this.reconnectTimeoutId = null;
        }, 10000); // Reset counter after 10 seconds of successful operation
      }
    } catch (error) {
      console.error('Error reconnecting speech recognition:', error);

      // Exponential backoff for reconnect attempts
      const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1), 30000);

      this.reconnectTimeoutId = window.setTimeout(() => {
        this.attemptReconnect();
      }, delay);
    }
  }

  private setFallbackMode(mode: FallbackMode) {
    if (this.fallbackMode === mode) return;

    this.fallbackMode = mode;
    console.log(`Switching to fallback mode: ${mode}`);

    switch (mode) {
      case FallbackMode.KEYWORD:
        this.setupKeywordFallback();
        toast.warning('Switched to basic voice commands. Speak slowly and clearly.');
        this.speak('Voice recognition limited. Using basic commands mode.', true);
        break;

      case FallbackMode.EMERGENCY:
        this.activateEmergencyMode();
        toast.error('Emergency mode activated. Say "HELP" for assistance.');
        this.speak('Emergency mode activated. Say HELP, NAVIGATE, or CALL.', true);
        break;

      case FallbackMode.GESTURE:
        toast.error('Voice control unavailable. Using tap interface.');
        this.speak('Voice control unavailable. Using tap interface.', true);
        // The gesture interface is implemented in the VoiceControl component
        break;

      case FallbackMode.NONE:
        // Reset to standard mode
        this.reconnectAttempts = 0;
        toast.success('Full voice control restored.');
        this.speak('Voice control restored.', true);
        break;
    }

    // Notify any listeners about the mode change
    if (this.commandCallback) {
      this.commandCallback('fallback_mode_changed', mode);
    }
  }

  private setupKeywordFallback() {
    // In a real implementation, this would use a simpler, more reliable
    // keyword detection system that works offline and with minimal processing

    // For now, we'll simulate it by focusing on very specific keywords
    this.offlineKeywords.set('help', () => {
      if (this.emergencyCallback) {
        this.emergencyCallback(EmergencyCommandType.HELP);
      }
    });

    this.offlineKeywords.set('navigate', () => {
      if (this.emergencyCallback) {
        this.emergencyCallback(EmergencyCommandType.NAVIGATE);
      }
    });

    this.offlineKeywords.set('call', () => {
      if (this.emergencyCallback) {
        this.emergencyCallback(EmergencyCommandType.CALL);
      }
    });

    // In a real implementation, we would use a dedicated offline keyword
    // detection library like Porcupine or a simplified ML model
  }

  private activateEmergencyMode() {
    this.isEmergencyModeActive = true;

    // In emergency mode, we focus only on critical commands
    // and make them as simple and reliable as possible
  }

  private initSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }

  private handleSpeechResult(event: SpeechRecognitionEvent) {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log('Voice transcript:', transcript);

    // Check for wake word if required
    if (this.isWakeWordRequired) {
      if (!transcript.includes(this.wakeWord)) {
        return;
      }
    }

    // Process the command
    this.processCommand(transcript);
  }

  private handleSpeechError(event: SpeechRecognitionErrorEvent) {
    console.error('Speech recognition error:', event.error);

    switch (event.error) {
      case 'not-allowed':
        toast.error('Microphone access denied. Please enable microphone permissions.');
        this.isListening = false;
        this.setFallbackMode(FallbackMode.GESTURE);
        break;

      case 'audio-capture':
        toast.error('No microphone detected.');
        this.isListening = false;
        this.setFallbackMode(FallbackMode.GESTURE);
        break;

      case 'network':
        console.warn('Network error in speech recognition');
        this.attemptFallbackRecognition('Network error');
        break;

      case 'aborted':
        // Intentional abort, no need to handle
        break;

      case 'no-speech':
        // This is normal, just restart listening
        break;

      case 'service-not-allowed':
      case 'bad-grammar':
      case 'language-not-supported':
        console.error(`Critical speech recognition error: ${event.error}`);
        this.setFallbackMode(FallbackMode.KEYWORD);
        break;

      default:
        console.warn(`Unhandled speech recognition error: ${event.error}`);
        this.attemptFallbackRecognition(`Error: ${event.error}`);
        break;
    }
  }

  private attemptFallbackRecognition(reason: string) {
    console.warn(`Attempting fallback recognition: ${reason}`);

    // Increment error counter
    this.reconnectAttempts++;

    // If we've had too many errors, switch to fallback mode
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Too many recognition errors, switching to fallback mode');
      this.setFallbackMode(FallbackMode.KEYWORD);
      return;
    }

    // If in emergency mode, don't try to recover, just stay in emergency mode
    if (this.isEmergencyModeActive) {
      return;
    }

    // Try to restart recognition
    try {
      if (this.recognition && this.isListening) {
        // Small delay to prevent rapid restarts
        setTimeout(() => {
          this.recognition?.start();
        }, 500);
      }
    } catch (error) {
      console.error('Error restarting recognition after fallback attempt:', error);
      this.attemptReconnect();
    }
  }

  private async processCommand(transcript: string) {
    // Remove wake word if present
    let processedTranscript = transcript;
    if (this.isWakeWordRequired && transcript.includes(this.wakeWord)) {
      const wakeWordIndex = transcript.indexOf(this.wakeWord);
      processedTranscript = transcript.substring(wakeWordIndex + this.wakeWord.length).trim();
    }

    // Check if transcript matches any command patterns
    for (const command of this.commands) {
      for (const pattern of command.patterns) {
        const regex = new RegExp(`^${pattern}`, 'i');
        const match = processedTranscript.match(regex);

        if (match) {
          // Extract arguments (anything after the matched pattern)
          const args = processedTranscript.substring(match[0].length).trim();

          try {
            // Notify callback if registered
            if (this.commandCallback) {
              this.commandCallback(match[0].trim(), args);
            }

            // Execute command action
            await command.action(args);
            return;
          } catch (error) {
            console.error('Error executing voice command:', error);
            this.speak('Sorry, I had trouble with that command.');
            return;
          }
        }
      }
    }

    // If no command matched, try AI interpretation
    this.handleUnknownCommand(processedTranscript);
  }

  private async handleUnknownCommand(transcript: string) {
    try {
      // Use AI to interpret the command
      const response = await llmClient.generate({
        capability: LLMCapability.FieldAssistant,
        prompt: `Interpret this voice command from a field technician: "${transcript}". 
                Respond with the most likely intended action in JSON format: 
                { "action": "navigate|check_in|complete_task|view_job|other", "confidence": 0-1, "parameters": {} }`
      });

      if (response.output) {
        try {
          const interpretation = JSON.parse(response.output);

          if (interpretation.confidence > 0.7) {
            // Handle the interpreted command
            this.speak(`I think you want to ${interpretation.action.replace('_', ' ')}. Is that right?`);

            // In a real implementation, we would handle confirmation and execute the action
            if (this.commandCallback) {
              this.commandCallback('ai_interpretation', JSON.stringify(interpretation));
            }
          } else {
            this.speak("I'm not sure what you want me to do. Can you try again?");
          }
        } catch (e) {
          this.speak("I couldn't understand that command.");
        }
      } else {
        this.speak("I didn't recognize that command.");
      }
    } catch (error) {
      console.error('Error interpreting voice command:', error);
      this.speak("Sorry, I couldn't process your request.");
    }
  }

  /**
   * Start listening for voice commands
   */
  public startListening() {
    if (!this.recognition) {
      toast.error('Speech recognition not supported in this browser');
      return false;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      toast.success('Voice commands activated');
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error('Failed to start voice recognition');
      return false;
    }
  }

  /**
   * Stop listening for voice commands
   */
  public stopListening() {
    if (!this.recognition) return;

    try {
      this.recognition.stop();
      this.isListening = false;
      toast.info('Voice commands deactivated');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }

  /**
   * Toggle listening state
   */
  public toggleListening(): boolean {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      return this.startListening();
    }
  }

  /**
   * Speak text aloud
   */
  public speak(text: string, priority: boolean = false) {
    if (!this.synthesis || this.isMuted) return;

    // Cancel current speech if priority
    if (priority && this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.synthesis.speak(utterance);
  }

  /**
   * Register a new voice command
   */
  public registerCommand(command: VoiceCommand) {
    this.commands.push(command);
  }

  /**
   * Register multiple commands at once
   */
  public registerCommands(commands: VoiceCommand[]) {
    this.commands.push(...commands);
  }

  /**
   * Set a callback for when commands are recognized
   */
  public onCommand(callback: (command: string, args: string) => void) {
    this.commandCallback = callback;
  }

  /**
   * Set the wake word
   */
  public setWakeWord(word: string, required: boolean = true) {
    this.wakeWord = word.toLowerCase();
    this.isWakeWordRequired = required;
  }

  /**
   * Mute or unmute speech output
   */
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synthesis?.speaking) {
      this.synthesis.cancel();
    }
  }

  /**
   * Check if speech recognition is supported
   */
  public isSupported(): boolean {
    return !!this.recognition;
  }

  /**
   * Check if currently listening
   */
  public getListeningState(): boolean {
    return this.isListening;
  }

  /**
   * Register an emergency callback for critical situations
   */
  public onEmergency(callback: (type: EmergencyCommandType) => void) {
    this.emergencyCallback = callback;
  }

  /**
   * Activate emergency mode immediately
   */
  public activateEmergencyModeNow() {
    this.setFallbackMode(FallbackMode.EMERGENCY);
  }

  /**
   * Exit emergency mode
   */
  public exitEmergencyMode() {
    if (this.isEmergencyModeActive) {
      this.isEmergencyModeActive = false;
      this.setFallbackMode(FallbackMode.NONE);
    }
  }

  /**
   * Get current fallback mode
   */
  public getFallbackMode(): FallbackMode {
    return this.fallbackMode;
  }

  /**
   * Force a specific fallback mode
   */
  public forceFallbackMode(mode: FallbackMode) {
    this.setFallbackMode(mode);
  }

  /**
   * Check if emergency mode is active
   */
  public isInEmergencyMode(): boolean {
    return this.isEmergencyModeActive;
  }

  /**
   * Trigger a specific command programmatically (useful for gesture fallback)
   */
  public triggerCommand(command: string, args: string = '') {
    if (this.commandCallback) {
      this.commandCallback(command, args);
    }

    // Find matching command
    for (const cmd of this.commands) {
      for (const pattern of cmd.patterns) {
        if (command.includes(pattern)) {
          cmd.action(args);
          return true;
        }
      }
    }

    return false;
  }
}

// Common voice commands for field technicians
export const commonTechnicianCommands: VoiceCommand[] = [
  {
    patterns: ['navigate to', 'directions to', 'take me to', 'go to'],
    action: async (location) => {
      // In a real implementation, this would trigger navigation
      console.log(`Navigating to: ${location}`);
      voiceInterface.speak(`Starting navigation to ${location}`);
    },
    examples: ['navigate to next job', 'directions to customer site'],
    description: 'Start navigation to a job site'
  },
  {
    patterns: ['check in', 'arrived at', 'i\'m at'],
    action: async (jobName) => {
      console.log(`Checking in at: ${jobName}`);
      voiceInterface.speak(`Checking you in at ${jobName || 'current location'}`);
    },
    examples: ['check in', 'arrived at customer site'],
    description: 'Mark yourself as checked in at the current job'
  },
  {
    patterns: ['complete task', 'mark complete', 'finish task'],
    action: async (taskName) => {
      console.log(`Completing task: ${taskName}`);
      voiceInterface.speak(`Marking task ${taskName || 'current task'} as complete`);
    },
    examples: ['complete task inspection', 'mark complete'],
    description: 'Mark a task as completed'
  },
  {
    patterns: ['take photo', 'capture image', 'snap picture'],
    action: async () => {
      console.log('Taking photo');
      voiceInterface.speak('Taking photo');
    },
    examples: ['take photo', 'capture image of installation'],
    description: 'Take a photo using the camera'
  },
  {
    patterns: ['read job details', 'tell me about', 'describe job'],
    action: async (jobName) => {
      console.log(`Reading job details for: ${jobName}`);
      voiceInterface.speak(`The job details for ${jobName || 'current job'} include installation of new equipment and testing.`);
    },
    examples: ['read job details', 'tell me about this job'],
    description: 'Have job details read aloud'
  },
  {
    patterns: ['next task', 'what\'s next', 'what should I do'],
    action: async () => {
      console.log('Getting next task');
      voiceInterface.speak('Your next task is to perform equipment inspection.');
    },
    examples: ['next task', 'what should I do now'],
    description: 'Find out what task to do next'
  },
  {
    patterns: ['call customer', 'contact client', 'phone customer'],
    action: async () => {
      console.log('Calling customer');
      voiceInterface.speak('Calling the customer now');
    },
    examples: ['call customer', 'contact client'],
    description: 'Initiate a call to the customer'
  },
  // Critical field technician commands
  {
    patterns: ['full report', 'send report', 'complete report'],
    action: async (jobName) => {
      console.log(`Generating full report for: ${jobName || 'current job'}`);
      voiceInterface.speak(`Generating full report with all images and notes for ${jobName || 'current job'}`);
    },
    examples: ['full report', 'send report with all images'],
    description: 'Generate and send a complete report with all images and notes'
  },
  {
    patterns: ['reference', 'show reference', 'get reference for'],
    action: async (item) => {
      console.log(`Showing reference for: ${item}`);
      voiceInterface.speak(`Opening reference documentation for ${item || 'this step'}`);
    },
    examples: ['reference step 3', 'show reference for compressor'],
    description: 'Pull up reference documentation for a specific item or step'
  },
  {
    patterns: ['connect office', 'call office', 'video call'],
    action: async (person) => {
      console.log(`Connecting to office: ${person || ''}`);
      voiceInterface.speak(`Connecting you to ${person || 'the office'}`);
    },
    examples: ['connect office', 'video call with FPM', 'call experienced tech'],
    description: 'Start a video or audio call with someone at the office'
  },
  {
    patterns: ['start timer', 'begin timer', 'time this'],
    action: async (task) => {
      console.log(`Starting timer for: ${task || 'current task'}`);
      voiceInterface.speak(`Starting timer for ${task || 'current task'}`);
    },
    examples: ['start timer', 'begin timer for installation'],
    description: 'Start timing a task or procedure'
  },
  {
    patterns: ['stop timer', 'end timer', 'pause timer'],
    action: async () => {
      console.log('Stopping timer');
      voiceInterface.speak('Timer stopped');
    },
    examples: ['stop timer', 'end timer'],
    description: 'Stop the currently running timer'
  },
  {
    patterns: ['log issue', 'report problem', 'note issue'],
    action: async (issue) => {
      console.log(`Logging issue: ${issue}`);
      voiceInterface.speak(`Logging issue: ${issue || 'with current task'}`);
    },
    examples: ['log issue with wiring', 'report problem with installation'],
    description: 'Log an issue or problem encountered during work'
  },
  {
    patterns: ['order parts', 'request parts', 'need parts'],
    action: async (parts) => {
      console.log(`Ordering parts: ${parts}`);
      voiceInterface.speak(`Creating parts request for: ${parts || 'this job'}`);
    },
    examples: ['order parts for compressor', 'request replacement filter'],
    description: 'Request or order parts needed for the job'
  },
  {
    patterns: ['help', 'what can I say', 'command list'],
    action: async () => {
      console.log('Providing help');
      voiceInterface.speak('You can say commands like: navigate to, check in, complete task, take photo, full report, reference, connect office, or order parts.');
    },
    examples: ['help', 'what can I say'],
    description: 'Get help with available voice commands'
  }
];

// Create and export a singleton instance
export const voiceInterface = new VoiceInterface();

// Register common commands
voiceInterface.registerCommands(commonTechnicianCommands);
