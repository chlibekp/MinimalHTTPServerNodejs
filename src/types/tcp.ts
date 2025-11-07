import type net from 'net';

type TCPServerEvents = {
	connection: (socket: net.Socket) => void;
	listening: (port: number) => void;
	error: (err: Error) => void;
}

export type { TCPServerEvents };
