import io from 'socket.io-client';

const socket = io('http://localhost');

const WebSocketService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenToDatabaseStatuses: (callback: (data: any) => void) => {
    socket.on('connect', () => {
      console.log('socket connected');
      console.log(socket);
    });

    socket.on('updateStatus', (data) => {
      console.log(data);
      callback(data);
    });
  },
};

export default WebSocketService;
