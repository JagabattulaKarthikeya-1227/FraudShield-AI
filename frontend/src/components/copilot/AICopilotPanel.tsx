import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Mic, FileText, BarChart2, Zap, ArrowRight, Expand, Minimize2 } from 'lucide-react';
import { useCopilotChat } from '../../core/api/hooks/useCopilot';
import { useCopilotContext } from '../../core/context/CopilotContext';
import { AIParticles } from '../motion/AIParticles';
import ReactMarkdown from 'react-markdown';

export const AICopilotPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isTyping } = useCopilotChat();
  const { activeRole, activeTransactionId, currentPage } = useCopilotContext();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isTyping) return;
    sendMessage(prompt);
  };

  const getQuickPrompts = () => {
    if (activeRole === 'Customer') return ['Explain my trust score', 'Is my account secure?', 'Summarize recent activity'];
    if (activeRole === 'Analyst') return ['Explain SHAP values', 'Generate investigation report', 'Summarize local LIME', 'What is the risk threshold?'];
    return ['System health check', 'Generate audit summary', 'Show model drift', 'Database latency'];
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all z-50 flex items-center justify-center group border border-primary/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </motion.button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className={`fixed bottom-6 right-6 ${isExpanded ? 'w-[800px] h-[80vh]' : 'w-[420px] h-[650px]'} bg-background/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[60]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">FraudShield Copilot</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{activeRole} Context Active</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Smart Context Bar */}
            <div className="px-4 py-2 bg-secondary/50 border-b border-border/30 flex items-center gap-4 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 shrink-0">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-muted-foreground">Context:</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 bg-background rounded border border-border/50 shrink-0">Page: {currentPage.split('/').pop() || 'home'}</span>
              {activeTransactionId && (
                <span className="text-[10px] font-mono px-2 py-1 bg-background rounded border border-border/50 shrink-0 text-primary">TX: {activeTransactionId}</span>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.2 }}
                  className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">How can I help you today?</h2>
                  <p className="text-sm text-muted-foreground mb-8">
                    I can explain SHAP values, generate PDF reports, or summarize anomalies for this dashboard.
                  </p>
                  
                  <div className="w-full space-y-2">
                    {getQuickPrompts().map((prompt, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="w-full p-3 text-sm text-left bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl flex items-center justify-between group transition-colors"
                      >
                        {prompt}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm ${
                      msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm' : 
                      'bg-secondary/50 border border-border/50 text-foreground rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.role === 'user' ? (
                        msg.content
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background prose-pre:border prose-pre:border-border/50">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          
                          {/* Simulated Action Buttons based on content keywords */}
                          {msg.content.toLowerCase().includes('generate report') && (
                            <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                              <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                                <FileText className="w-3 h-3" /> Export PDF
                              </button>
                            </div>
                          )}
                          {msg.content.toLowerCase().includes('shap') && (
                            <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                              <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border text-foreground rounded-lg text-xs font-medium hover:bg-secondary transition-colors">
                                <BarChart2 className="w-3 h-3" /> View Force Plot
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex justify-start max-w-[85%]"
                >
                  <div className="bg-secondary/50 border border-border/50 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm">
                    <AIParticles />
                  </div>
                </motion.div>
              )}
              <div ref={endOfMessagesRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t border-border/50">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Copilot..."
                  disabled={isTyping}
                  className="w-full pl-4 pr-24 py-3.5 bg-secondary/50 border border-border/50 focus:bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl text-sm transition-all disabled:opacity-50"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    disabled={isTyping}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
                    title="Voice dictation (Coming soon)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-muted-foreground">AI responses can be inaccurate. Always verify transaction decisions.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
