import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { useEffect, useState } from 'react';

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['ops_audit'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ops/audit');
      return data.data.logs;
    },
  });
};

export const useSecurityEvents = () => {
  return useQuery({
    queryKey: ['ops_security'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ops/security');
      return data.data;
    },
  });
};

export const useMLOpsRegistry = () => {
  return useQuery({
    queryKey: ['ops_mlops'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ops/mlops');
      return data.data;
    },
  });
};

// Custom Hook for Server-Sent Events (SSE)
export const useEventSource = (url: string) => {
  const [lastEvent, setLastEvent] = useState<any>(null);

  useEffect(() => {
    // In production, we'd pass auth tokens via cookies or URL params for the EventSource
    const eventSource = new EventSource(apiClient.defaults.baseURL + url);
    
    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setLastEvent(parsedData);
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    eventSource.onerror = (error) => {
      console.warn("SSE Connection Error. Attempting to reconnect...", error);
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return lastEvent;
};
