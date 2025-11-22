import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface VoiceCommand {
  command: string;
  action: string;
  category: 'navigation' | 'communication' | 'work' | 'system';
  confidence: number;
}

interface VoiceNavigationProps {
  isActive?: boolean;
  onCommandRecognized?: (command: VoiceCommand) => void;
}

export const VoiceNavigation: React.FC<VoiceNavigationProps> = ({
  isActive = false,
  onCommandRecognized
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [confidence, setConfidence] = useState(0);
  const [availableCommands, setAvailableCommands] = useState<VoiceCommand[]>([
    // Navigation commands
    { command: 'navigate to next job', action: 'Open navigation to next work order location', category: 'navigation', confidence: 95 },
    { command: 'directions to customer', action: 'Get directions to customer location', category: 'navigation', confidence: 92 },
    { command: 'find nearest parts store', action: 'Locate nearest equipment parts supplier', category: 'navigation', confidence: 88 },

    // Communication commands
    { command: 'call customer', action: 'Initiate phone call to customer', category: 'communication', confidence: 98 },
    { command: 'text customer update', action: 'Send status update via text message', category: 'communication', confidence: 90 },
    { command: 'report delay', action: 'Send delay notification to dispatch', category: 'communication', confidence: 85 },

    // Work commands
    { command: 'start job', action: 'Mark current work order as in progress', category: 'work', confidence: 96 },
    { command: 'complete job', action: 'Mark current work order as completed', category: 'work', confidence: 97 },
    { command: 'parts needed', action: 'Request additional parts for current job', category: 'work', confidence: 89 },
    { command: 'schedule follow up', action: 'Schedule follow-up service call', category: 'work', confidence: 87 },

    // System commands
    { command: 'status report', action: 'Generate and send status report', category: 'system', confidence: 91 },
    { command: 'emergency help', action: 'Request immediate assistance', category: 'system', confidence: 99 },
    { command: 'end shift', action: 'Complete shift and log out', category: 'system', confidence: 93 }
  ]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const confidence = event.results[0][0].confidence;

        setLastCommand(transcript);
        setConfidence(Math.round(confidence * 100));

        // Find matching command
        const matchedCommand = availableCommands.find(cmd =>
          transcript.includes(cmd.command.split(' ')[0]) ||
          cmd.command.split(' ').some(word => transcript.includes(word))
        );

        if (matchedCommand && onCommandRecognized) {
          onCommandRecognized(matchedCommand);
          speakResponse(`Executing: ${matchedCommand.action}`);
        } else {
          speakResponse("Command not recognized. Say 'help' for available commands.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speakResponse("Voice recognition error. Please try again.");
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [availableCommands, onCommandRecognized]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
      speakResponse("Listening for commands");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current && isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      synthRef.current.speak(utterance);
    }
  };

  const toggleVoiceOutput = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking) {
      speakResponse("Voice output enabled");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <Navigation className="h-4 w-4" />;
      case 'communication': return <Phone className="h-4 w-4" />;
      case 'work': return <CheckCircle className="h-4 w-4" />;
      case 'system': return <AlertTriangle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'bg-blue-500';
      case 'communication': return 'bg-green-500';
      case 'work': return 'bg-orange-500';
      case 'system': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Voice Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isListening ? <Mic className="h-5 w-5 text-red-500" /> : <MicOff className="h-5 w-5" />}
              Voice Navigation
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoiceOutput}
                className={isSpeaking ? 'border-green-500' : ''}
              >
                {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={isListening ? "destructive" : "secondary"}>
              {isListening ? "Listening..." : "Ready"}
            </Badge>
          </div>

          {/* Last Command */}
          {lastCommand && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Last Command</span>
                <Badge variant="outline">{confidence}% confidence</Badge>
              </div>
              <p className="text-sm">{lastCommand}</p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={startListening}
              disabled={isListening}
              className="flex-1"
              variant={isListening ? "destructive" : "default"}
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Listening
            </Button>
            <Button
              onClick={stopListening}
              disabled={!isListening}
              variant="outline"
              className="flex-1"
            >
              <MicOff className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-h-64 overflow-y-auto">
            {availableCommands.map((cmd, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded border">
                <div className={`p-1 rounded ${getCategoryColor(cmd.category)}`}>
                  {getCategoryIcon(cmd.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">&quot;{cmd.command}&quot;</p>
                  <p className="text-xs text-muted-foreground">{cmd.action}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {cmd.confidence}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Voice Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-left justify-start"
              onClick={() => speakResponse("Say 'navigate to next job' to get directions")}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-left justify-start"
              onClick={() => speakResponse("Say 'call customer' to initiate contact")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Customer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-left justify-start"
              onClick={() => speakResponse("Say 'start job' to begin work")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Start Job
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-left justify-start"
              onClick={() => speakResponse("Say 'emergency help' for immediate assistance")}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
