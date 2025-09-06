
import React, { useEffect, useRef } from 'react'

function useSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null)
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    if (socketRef.current) {
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        setLoading(false);
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
      };
    }

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  return { socket: socketRef, loading };
}



export default useSocket
