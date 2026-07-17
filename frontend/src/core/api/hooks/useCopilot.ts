import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { useCopilotContext } from '../../context/CopilotContext';

export function useCopilotChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const copilotContext = useCopilotContext();

  const sendMessage = useCallback(async (query: string) => {
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/v1/copilot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          query,
          context: {
            role: copilotContext.activeRole,
            page: copilotContext.currentPage,
            transactionId: copilotContext.activeTransactionId
          }
        }),
      });

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.replace('data: ', ''));
              if (data.done) {
                setIsTyping(false);
                break;
              }
              if (data.token) {
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content += data.token;
                  return newMsgs;
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Copilot Stream Error:', error);
      setIsTyping(false);
    }
  }, [copilotContext.activeRole, copilotContext.currentPage, copilotContext.activeTransactionId]);

  return { messages, sendMessage, isTyping };
}

export function useCopilotSummary(txId: string) {
  return useQuery({
    queryKey: ['copilot', 'summary', txId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/copilot/summarize/${txId}`);
      return data.data.summary as string;
    },
    enabled: !!txId,
  });
}
