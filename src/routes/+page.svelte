<script lang="ts">
	import * as Tone from 'tone';
	import { WebMidi } from 'webmidi';
	import Octave from './Octave.svelte';
	import { generateRandomHexColor } from '$lib/generateRandomHexColor';
	import { gameStateR, gameStateW, myUserId } from '$store';
	import type { UserId } from '$types';

	$: myUserState = $gameStateR.userStates?.get($myUserId)!;
	let muteUserIds: UserId[] = [];

	const sampler = new Tone.Sampler({
		urls: {
			A0: 'A0.mp3',
			C1: 'C1.mp3',
			'D#1': 'Ds1.mp3',
			'F#1': 'Fs1.mp3',
			A1: 'A1.mp3',
			C2: 'C2.mp3',
			'D#2': 'Ds2.mp3',
			'F#2': 'Fs2.mp3',
			A2: 'A2.mp3',
			C3: 'C3.mp3',
			'D#3': 'Ds3.mp3',
			'F#3': 'Fs3.mp3',
			A3: 'A3.mp3',
			C4: 'C4.mp3',
			'D#4': 'Ds4.mp3',
			'F#4': 'Fs4.mp3',
			A4: 'A4.mp3',
			C5: 'C5.mp3',
			'D#5': 'Ds5.mp3',
			'F#5': 'Fs5.mp3',
			A5: 'A5.mp3',
			C6: 'C6.mp3',
			'D#6': 'Ds6.mp3',
			'F#6': 'Fs6.mp3',
			A6: 'A6.mp3',
			C7: 'C7.mp3',
			'D#7': 'Ds7.mp3',
			'F#7': 'Fs7.mp3',
			A7: 'A7.mp3',
			C8: 'C8.mp3'
		},
		release: 1,
		baseUrl: 'https://tonejs.github.io/audio/salamander/'
	}).toDestination();

	sampler.volume.value = -10;

	const onEnabled = () => {
		for (const input of WebMidi.inputs) {
			input.addListener('noteon', (e) => {
				noteStart(
					`${e.note.name}${e.note.accidental ?? ''}${e.note.octave}`,
					//@ts-ignore
					e.velocity
				);
			});

			input.addListener('noteoff', (e) => {
				const note = `${e.note.name}${e.note.accidental ?? ''}${e.note.octave}`;
				noteStop(note);
			});
		}
	};

	const myColor = generateRandomHexColor();
	const noteStart = (
		note: string,
		velocity: number,
		color: string = myColor,
		userId: UserId = $myUserId
	) => {
		soundStart(note, velocity, color, userId);

		myUserState.note = note;
		myUserState.velocity = velocity;
		myUserState.color = myColor;
		$gameStateW = $gameStateR;
	};

	const soundStart = (
		note: string,
		velocity: number,
		color: string,
		userId: UserId
	) => {
		console.log();
		document.getElementById(note)?.style.setProperty('background', color);
		sampler.triggerAttack(
			note,
			undefined,
			muteUserIds.includes(userId) ? 0 : velocity
		);
	};

	const noteStop = (note: string) => {
		soundStop(note);

		myUserState.note = note;
		myUserState.velocity = 0;
		$gameStateW = $gameStateR;
	};

	const soundStop = (note: string) => {
		document
			.getElementById(note)
			?.style.setProperty('background', note.includes('#') ? 'black' : 'white');
		sampler.triggerRelease(note);
	};

	$: {
		if ($gameStateR.userStates) {
			for (const [userId, userState] of $gameStateR.userStates) {
				if (userId === $myUserId) continue;

				if (userState.velocity > 0) {
					soundStart(
						userState.note,
						userState.velocity,
						userState.color,
						userId
					);
				} else {
					soundStop(userState.note);
				}
			}
		}
	}

	WebMidi.enable()
		.then(onEnabled)
		.catch((err) => alert(err));
</script>

<svelte:head>
	<title>Piano</title>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

{#if $gameStateR.publicState?.turnUserId}
	<span>volume</span>
	<input type="range" min="-20" max="0" bind:value={sampler.volume.value} />
	<br />
	<br />
	<div class="piano">
		{#each [...Array(8).keys()] as octave}
			<Octave {octave} {noteStart} {noteStop} />
		{/each}
	</div>
{:else}
	<h1>waiting participants... (Share URL)</h1>
{/if}

<br />
{#each $gameStateR.userStates ?? [] as [userId, userState]}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		style="--bgColor={userState?.color}; "
		on:click={() => {
			let tmp = new Set(muteUserIds);
			if (tmp.has(userId)) {
				tmp.delete(userId);
			} else {
				tmp.add(userId);
			}
			muteUserIds = [...tmp];
		}}
	>
		<div class="color-box" style:--bgColor={userState?.color} />
		<span
			style="user-select:none; text-decoration: {muteUserIds.includes(userId)
				? 'line-through'
				: 'none'};"
		>
			{`${userState.userName}${userId === $myUserId ? ' (you)' : ''}`}
		</span>
	</div>
{/each}

<br />
{#if $gameStateR.publicState?.turnUserId === null}
	<input
		type="button"
		value="start"
		style="margin-left: 50px; width: 75px; height: 30px; font-size: 20px;"
		on:click={() => {
			$gameStateR.publicState.turnUserId = $myUserId;
			$gameStateW = $gameStateR;
		}}
	/>
{:else}
	<p>Click user name to mute</p>
{/if}

<style>
	.piano {
		display: flex;
	}

	.color-box {
		display: inline-block;
		width: 10px;
		height: 10px;
		background-color: var(--bgColor);
		display: inline-block;
	}
</style>
