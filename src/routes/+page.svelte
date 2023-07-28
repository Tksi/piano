<script lang="ts">
	import * as Tone from 'tone';
	import { WebMidi } from 'webmidi';
	import Octave from './Octave.svelte';

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

	const noteStart = (note: string, velocity: number, color: string = 'red') => {
		document.getElementById(note)?.style.setProperty('background', color);

		sampler.triggerAttack(note, undefined, velocity);
	};

	const noteStop = (note: string) => {
		document
			.getElementById(note)
			?.style.setProperty('background', note.includes('#') ? 'black' : 'white');

		sampler.triggerRelease(note);
	};

	WebMidi.enable()
		.then(onEnabled)
		.catch((err) => alert(err));
</script>

<svelte:head>
	<title>Piano</title>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

<input type="range" min="-20" max="0" bind:value={sampler.volume.value} />
<div class="piano">
	{#each [...Array(8).keys()] as octave}
		<Octave {octave} {noteStart} {noteStop} />
	{/each}
</div>

<style>
	.piano {
		display: flex;
	}
</style>
