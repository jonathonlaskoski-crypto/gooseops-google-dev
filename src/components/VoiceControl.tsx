import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { 
  voiceInterface, 
  commonTechnicianCommands, 
  FallbackMode,
  EmergencyCommandType
} from '@/lib/voiceInterface';
import { 
  Microphone, 
  MicrophoneSlash, 
  SpeakerHigh, 
  SpeakerSlash, 
  Question,
  Warning,
  NavigationArrow,
  Phone,
  Camera,
  CheckCircle,
  Info,
  X,
  FileText,
  BookOpen,
  VideoCamera,
  WarningCircle,
  Timer,
  StopCircle,
  Package
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface VoiceControlProps {
  onNavigate?: (location: string) => void;
  onCheckIn?: () => void;
  onCompleteTask?: (taskId: string) => void;
  onTakePhoto?: () => void;
}

export function VoiceControl({
  onNavigate,
  onCheckIn,
  onCompleteTask,
  onTakePhoto
}: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [fallbackMode, setFallbackMode] = useState<FallbackMode>(FallbackMode.NONE);
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [showGesturePanel, setShowGesturePanel] = useState(false);

  // Register callbacks for voice commands and handle fallback modes
  useEffect(() => {
    if (!voiceInterface.isSupported()) {
      setIsSupported(false);
      setShowGesturePanel(true); // Always show gesture panel if voice is not supported
      return;
    }

    setIsSupported(true);

    // Register command handler
    voiceInterface.onCommand((command, args) => {
      setLastCommand(`${command} ${args}`.trim());
      
      // Special handling for fallback mode changes
      if (command === 'fallback_mode_changed') {
        const newMode = args as FallbackMode;
        setFallbackMode(newMode);
        
        // Show appropriate panels based on fallback mode
        if (newMode === FallbackMode.EMERGENCY) {
          setShowEmergencyPanel(true);
          setShowGesturePanel(false);
        } else if (newMode === FallbackMode.GESTURE) {
          setShowGesturePanel(true);
          setShowEmergencyPanel(false);
        } else if (newMode === FallbackMode.KEYWORD) {
          setShowGesturePanel(false);
          setShowEmergencyPanel(false);
        } else {
          setShowGesturePanel(false);
          setShowEmergencyPanel(false);
        }
        
        return;
      }
      
      // Handle specific commands with callbacks
      if (command.includes('navigate') && onNavigate) {
        onNavigate(args);
      } else if (command.includes('check in') && onCheckIn) {
        onCheckIn();
      } else if (command.includes('complete task') && onCompleteTask) {
        onCompleteTask(args);
      } else if (command.includes('take photo') && onTakePhoto) {
        onTakePhoto();
      }
    });

    // Register emergency callback
    voiceInterface.onEmergency((type) => {
      switch (type) {
        case EmergencyCommandType.HELP:
          toast.error('Emergency help requested. Contacting supervisor...');
          // In a real app, this would trigger an emergency protocol
          break;
        case EmergencyCommandType.NAVIGATE:
          toast.warning('Emergency navigation activated. Routing to nearest exit...');
          if (onNavigate) onNavigate('emergency exit');
          break;
        case EmergencyCommandType.CALL:
          toast.warning('Emergency call initiated...');
          // In a real app, this would initiate an emergency call
          break;
        case EmergencyCommandType.CANCEL:
          toast.success('Emergency mode deactivated');
          voiceInterface.exitEmergencyMode();
          setShowEmergencyPanel(false);
          break;
      }
    });

    // Sync listening state
    setIsListening(voiceInterface.getListeningState());
    
    // Sync fallback mode
    setFallbackMode(voiceInterface.getFallbackMode());
    
    // Show appropriate panels based on current fallback mode
    if (voiceInterface.isInEmergencyMode()) {
      setShowEmergencyPanel(true);
    } else if (voiceInterface.getFallbackMode() === FallbackMode.GESTURE) {
      setShowGesturePanel(true);
    }

    return () => {
      // Clean up if needed
      if (isListening) {
        voiceInterface.stopListening();
      }
    };
  }, [onNavigate, onCheckIn, onCompleteTask, onTakePhoto]);

  const toggleListening = () => {
    const newState = voiceInterface.toggleListening();
    setIsListening(newState);
    
    if (newState) {
      toast.success('Voice commands activated. Say "Goose, help" for available commands.');
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    voiceInterface.setMuted(newMuteState);
    
    toast.info(newMuteState ? 'Voice responses muted' : 'Voice responses unmuted');
  };

  if (!isSupported) {
    return null; // Don't render if voice control is not supported
  }

  // Handle emergency button press
  const handleEmergencyHelp = () => {
    voiceInterface.triggerCommand('help');
  };
  
  // Handle emergency navigation
  const handleEmergencyNavigate = () => {
    voiceInterface.triggerCommand('navigate', 'emergency exit');
  };
  
  // Handle emergency call
  const handleEmergencyCall = () => {
    voiceInterface.triggerCommand('call', 'supervisor');
  };
  
  // Exit emergency mode
  const handleExitEmergency = () => {
    voiceInterface.exitEmergencyMode();
    setShowEmergencyPanel(false);
  };
  
  // Handle gesture-based commands (fallback for when voice fails)
  const handleGestureCommand = (command: string, args: string = '') => {
    voiceInterface.triggerCommand(command, args);
    
    // Show visual feedback
    toast.success(`Command executed: ${command} ${args}`.trim());
  };
  
  // Force emergency mode
  const activateEmergencyMode = () => {
    voiceInterface.activateEmergencyModeNow();
    setShowEmergencyPanel(true);
  };

  return (
    <>
      {/* Voice Control Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full shadow-lg ${
                  isListening 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background text-foreground"
                }`}
                onClick={toggleListening}
              >
                {isListening ? <Microphone size={24} weight="fill" /> : <MicrophoneSlash size={24} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isListening ? 'Voice commands active' : 'Enable voice commands'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isListening && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-md"
                    onClick={toggleMute}
                  >
                    {isMuted ? <SpeakerSlash size={20} /> : <SpeakerHigh size={20} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{isMuted ? 'Unmute voice responses' : 'Mute voice responses'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog open={showHelp} onOpenChange={setShowHelp}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-md"
                      >
                        <Question size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Available Voice Commands</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Start commands with &quot;Goose&quot; to activate voice control.
                          </p>
                          
                          {commonTechnicianCommands.map((cmd, index) => (
                            <div key={index} className="space-y-1">
                              <h3 className="font-medium">{cmd.description}</h3>
                              <div className="flex flex-wrap gap-2">
                                {cmd.examples.map((example, i) => (
                                  <Badge key={i} variant="secondary">
                                    &quot;Goose, {example}&quot;
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <DialogFooter>
                        <Button onClick={() => setShowHelp(false)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Voice command help</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Emergency Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-md"
                    onClick={activateEmergencyMode}
                  >
                    <Warning size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Emergency Mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>

      {/* Last Heard Command */}
      {isListening && lastCommand && (
        <div className="fixed bottom-20 left-4 max-w-[60%]">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm px-3 py-1 text-xs">
            Heard: &quot;{lastCommand}&quot;
          </Badge>
        </div>
      )}
      
      {/* Emergency Mode Panel - Simplified and human-centered */}
      {showEmergencyPanel && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-destructive/95 text-destructive-foreground backdrop-blur-md">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold flex items-center">
                <Warning className="mr-2" size={24} />
                Need Help?
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExitEmergency}
                className="bg-destructive-foreground text-destructive"
              >
                <X className="mr-1" size={16} />
                I&apos;m OK
              </Button>
            </div>
            
            <p className="text-sm mb-4">Tap what you need right now</p>
            
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={handleEmergencyHelp}
                size="lg" 
                variant="outline"
                className="h-20 bg-destructive-foreground/20 border-destructive-foreground/30 text-lg"
              >
                <Warning className="mr-2" size={28} />
                Get Immediate Help
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleEmergencyNavigate}
                  size="lg" 
                  variant="outline"
                  className="h-16 bg-destructive-foreground/20 border-destructive-foreground/30"
                >
                  <NavigationArrow className="mr-2" size={24} />
                  Exit Directions
                </Button>
                
                <Button 
                  onClick={handleEmergencyCall}
                  size="lg" 
                  variant="outline"
                  className="h-16 bg-destructive-foreground/20 border-destructive-foreground/30"
                >
                  <Phone className="mr-2" size={24} />
                  Call Supervisor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Gesture Fallback Panel */}
      {showGesturePanel && !showEmergencyPanel && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">I need to...</h2>
            </div>
            
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {/* Job Tasks - Simple, action-oriented language */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleGestureCommand('navigate')}
                    size="lg" 
                    variant="default"
                    className="h-16 text-base"
                  >
                    <NavigationArrow className="mr-2" size={24} />
                    Get Directions
                  </Button>
                  
                  <Button 
                    onClick={() => handleGestureCommand('check in')}
                    size="lg" 
                    variant="default"
                    className="h-16 text-base"
                  >
                    <Info className="mr-2" size={24} />
                    Check In
                  </Button>
                  
                  <Button 
                    onClick={() => handleGestureCommand('complete task')}
                    size="lg" 
                    variant="default"
                    className="h-16 text-base"
                  >
                    <CheckCircle className="mr-2" size={24} />
                    Mark Complete
                  </Button>
                  
                  <Button 
                    onClick={() => handleGestureCommand('take photo')}
                    size="lg" 
                    variant="default"
                    className="h-16 text-base"
                  >
                    <Camera className="mr-2" size={24} />
                    Take Photo
                  </Button>
                  
                  <Button 
                    onClick={() => handleGestureCommand('reference')}
                    size="lg" 
                    variant="default"
                    className="h-16 text-base"
                  >
                    <BookOpen className="mr-2" size={24} />
                    See Manual
                  </Button>
                  
                  <Button 
                    onClick={() => handleGestureCommand('connect office')}
                    size="lg" 
                    variant="default"
                    className="h-16 text-base"
                  >
                    <VideoCamera className="mr-2" size={24} />
                    Get Help
                  </Button>
                  
                  <Button 
                    onClick={() => handleGestureCommand('full report')}
                    size="lg" 
                    variant="default"
                    className="h-16 text-base"
                  >
                    <FileText className="mr-2" size={24} />
                    Send Report
                  </Button>
                  
                  <Button 
                    onClick={() => handleGestureCommand('order parts')}
                    size="lg" 
                    variant="default"
                    className="h-16 text-base"
                  >
                    <Package className="mr-2" size={24} />
                    Order Parts
                  </Button>
                </div>
              </div>
            </ScrollArea>
            
            <div className="mt-4">
              <Button 
                onClick={activateEmergencyMode}
                size="lg" 
                variant="destructive"
                className="w-full h-12"
              >
                <Warning className="mr-2" size={20} />
                Emergency Mode
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
