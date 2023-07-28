<script lang="ts">
	export let octave: number;
	export let noteStart: (note: string, velocity: number) => void;
	export let noteStop: (note: string) => void;
</script>

<div class="octave">
	<div
		class="white"
		id={`C${octave}`}
		role="button"
		tabindex={octave * 12 + 0}
		on:mousedown={() => noteStart(`C${octave}`, 1)}
		on:mouseup={() => noteStop(`C${octave}`)}
	/>
	<div class="black-container">
		<div
			class="black"
			id={`C#${octave}`}
			role="button"
			tabindex={octave * 12 + 1}
			on:mousedown={() => noteStart(`C#${octave}`, 1)}
			on:mouseup={() => noteStop(`C#${octave}`)}
		/>
	</div>
	<div
		class="white"
		id={`D${octave}`}
		role="button"
		tabindex={octave * 12 + 2}
		on:mousedown={() => noteStart(`D${octave}`, 1)}
		on:mouseup={() => noteStop(`D${octave}`)}
	/>
	<div class="black-container">
		<div
			class="black"
			id={`D#${octave}`}
			role="button"
			tabindex={octave * 12 + 3}
			on:mousedown={() => noteStart(`D#${octave}`, 1)}
			on:mouseup={() => noteStop(`D#${octave}`)}
		/>
	</div>
	<div
		class="white"
		id={`E${octave}`}
		role="button"
		tabindex={octave * 12 + 4}
		on:mousedown={() => noteStart(`E${octave}`, 1)}
		on:mouseup={() => noteStop(`E${octave}`)}
	/>
	<div
		class="white"
		id={`F${octave}`}
		role="button"
		tabindex={octave * 12 + 5}
		on:mousedown={() => noteStart(`F${octave}`, 1)}
		on:mouseup={() => noteStop(`F${octave}`)}
	/>
	<div class="black-container">
		<div
			class="black"
			id={`F#${octave}`}
			role="button"
			tabindex={octave * 12 + 6}
			on:mousedown={() => noteStart(`F#${octave}`, 1)}
			on:mouseup={() => noteStop(`F#${octave}`)}
		/>
	</div>
	<div
		class="white"
		id={`G${octave}`}
		role="button"
		tabindex={octave * 12 + 7}
		on:mousedown={() => noteStart(`G${octave}`, 1)}
		on:mouseup={() => noteStop(`G${octave}`)}
	/>
	<div class="black-container">
		<div
			class="black"
			id={`G#${octave}`}
			role="button"
			tabindex={octave * 12 + 8}
			on:mousedown={() => noteStart(`G#${octave}`, 1)}
			on:mouseup={() => noteStop(`G#${octave}`)}
		/>
	</div>
	<div
		class="white"
		id={`A${octave}`}
		role="button"
		tabindex={octave * 12 + 9}
		on:mousedown={() => noteStart(`A${octave}`, 1)}
		on:mouseup={() => noteStop(`A${octave}`)}
	/>
	<div class="black-container">
		<div
			class="black"
			id={`A#${octave}`}
			role="button"
			tabindex={octave * 12 + 10}
			on:mousedown={() => noteStart(`A#${octave}`, 1)}
			on:mouseup={() => noteStop(`A#${octave}`)}
		/>
	</div>
	<div
		class="white"
		id={`B${octave}`}
		role="button"
		tabindex={octave * 12 + 11}
		on:mousedown={() => noteStart(`B${octave}`, 1)}
		on:mouseup={() => noteStop(`B${octave}`)}
	/>
</div>

<style>
	.octave {
		display: inline-flex;
	}

	.white {
		display: inline-block;
		width: 25px;
		height: 100px;
		background: white;
		border: 1px solid black;
	}

	.black {
		position: absolute;
		display: inline-block;
		left: -7.5px;
		width: 15px;
		height: 60px;
		background: black;
		border: 1px solid black;
	}

	.black-container {
		position: relative;
	}
</style>
