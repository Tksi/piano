import { nanoid } from 'nanoid';
import { get, writable } from 'svelte/store';
import {
	adjectives,
	animals,
	colors,
	uniqueNamesGenerator
} from 'unique-names-generator';
import type { GameId, GameState, ReqMessage, ResMessage, UserId } from '$types';
import { browser } from '$app/environment';
import { PUBLIC_WS } from '$env/static/public';
import { replacer, reviver } from '$lib/jsonMap';

type StatePublic = { [key: string]: unknown };

export type StateUser = {
	note: string;
	velocity: number;
	color: string;
};

export const myUserId = writable<UserId>();

export const gameStateW = writable<GameState<StatePublic, StateUser>>({});

export const gameStateR = writable<GameState<StatePublic, StateUser>>({});

let ws: WebSocket;
let gameId: GameId;
gameStateW.subscribe((state) => {
	gameStateR.set(get(gameStateW));

	if (ws && state.publicState.turnUserId !== null) {
		ws.send(
			JSON.stringify(
				{
					type: 'SEND',
					gameId,
					gameState: state
				},
				replacer
			)
		);
	}
});

export const setGameId = () =>
	(location.href = `${location.origin}?${new URLSearchParams([
		['gameId', `PIANO-${nanoid()}`]
	]).toString()}`);

if (browser) {
	ws = new WebSocket(PUBLIC_WS ?? 'ws://localhost:4567');

	gameId = new URL(location.href).searchParams.get('gameId') as GameId;

	if (gameId === null) {
		setGameId();
	}

	const userName = uniqueNamesGenerator({
		dictionaries: [colors, animals],
		separator: '-'
	});

	ws.addEventListener('open', () => {
		const joinMessage: ReqMessage<StatePublic, StateUser> = {
			type: 'JOIN',
			gameId,
			userName
		};
		ws.send(JSON.stringify(joinMessage));
	});

	ws.addEventListener('message', ({ data: JSONmessage }: { data: string }) => {
		try {
			const message = JSON.parse(JSONmessage, reviver) as ResMessage<
				StatePublic,
				StateUser
			>;
			console.debug(message);

			switch (message.type) {
				case 'USERID': {
					myUserId.set(message.body);

					break;
				}

				case 'GAMESTATE': {
					gameStateR.set(message.body);

					break;
				}
			}
		} catch (err) {
			console.error(err);
		}
	});

	ws.addEventListener('close', () => {
		location.reload();
	});
}
