import io, { Socket } from 'socket.io-client';

let socket: Socket;

const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost');
    console.log('Created socket');
  }
  return socket;
};

const WebSocketService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenToDatabaseStatuses: (callback: (data: any) => void) => {
    const currentSocket = getSocket();
    currentSocket.on('connect', () => {
      console.log('connected to gateway');
    });

    currentSocket.emit('listenToDatabaseStatuses');
    currentSocket.on('updateStatus', (data) => {
      callback(data);
      if (data.results.length == 0) {
        currentSocket.off('updateStatus');
      }
    });
  },
};

export default WebSocketService;
