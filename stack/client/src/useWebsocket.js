import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

function useWebsocket() {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl] = useState('ws://localhost:9001/app');
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handlePing = useCallback(
    () => sendMessage(JSON.stringify({ channel: 'main', event: 'ping' })),
    []
  );

  //   const connectionStatus = {
  //     [ReadyState.CONNECTING]: 'Connecting',
  //     [ReadyState.OPEN]: 'Open',
  //     [ReadyState.CLOSING]: 'Closing',
  //     [ReadyState.CLOSED]: 'Closed',
  //     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  //   }[readyState];

  return {
    onPing: handlePing,
  };
}

export default useWebsocket;
