import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface GooseOpsCinematicOverlayProps {
    type: 'deploy' | 'success' | 'alert' | 'enterprise' | null;
    message?: string;
    onComplete?: () => void;
}

export function GooseOpsCinematicOverlay({ type, message, onComplete }: GooseOpsCinematicOverlayProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (type) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onComplete?.(), 500);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [type, onComplete]);

    const getOverlayConfig = (overlayType: string) => {
        switch (overlayType) {
            case 'deploy':
                return {
                    color: '#00bfff',
                    title: 'DEPLOYMENT INITIATED',
                    subtitle: 'SYSTEMS GO',
                    effect: 'slideIn'
                };
            case 'success':
                return {
                    color: '#10b981',
                    title: 'OPERATION COMPLETE',
                    subtitle: 'TARGET ACHIEVED',
                    effect: 'zoom'
                };
            case 'alert':
                return {
                    color: '#f59e0b',
                    title: 'SYSTEM ALERT',
                    subtitle: 'ATTENTION REQUIRED',
                    effect: 'pulse'
                };
            case 'enterprise':
                return {
                    color: '#06b6d4',
                    title: 'GOOSEOPS NEURAL EMPIRE',
                    subtitle: 'ENTERPRISE MODE ACTIVATED',
                    effect: 'neural'
                };
            default:
                return {
                    color: '#6b7280',
                    title: '',
                    subtitle: '',
                    effect: 'fade'
                };
        }
    };

    if (!type) return null;

    const config = getOverlayConfig(type);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 pointer-events-none neural-empire-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <motion.div
                            className="neural-empire-modal-content p-8 text-center max-w-md mx-4"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <motion.div
                                className="mb-4"
                                animate={{
                                    textShadow: [
                                        `0 0 20px ${config.color}40`,
                                        `0 0 40px ${config.color}80`,
                                        `0 0 20px ${config.color}40`
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <h1
                                    className="text-3xl font-bold mb-2 neural-empire-font"
                                    style={{ color: config.color }}
                                >
                                    {config.title}
                                </h1>
                                <p className="text-lg opacity-90 neural-empire-font">
                                    {message || config.subtitle}
                                </p>
                            </motion.div>

                            <motion.div
                                className="flex justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                            >
                                <motion.div
                                    className="w-16 h-16 rounded-full border-4 border-transparent"
                                    style={{
                                        borderTopColor: config.color,
                                        borderRightColor: config.color + '40'
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
