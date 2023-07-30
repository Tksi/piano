export const generateRandomHexColor = () => {
	const r = (Math.trunc(Math.random() * 128) + 128)
		.toString(16)
		.padStart(2, '0');

	const g = (Math.trunc(Math.random() * 128) + 128)
		.toString(16)
		.padStart(2, '0');

	const b = (Math.trunc(Math.random() * 128) + 128)
		.toString(16)
		.padStart(2, '0');

	return `#${r}${g}${b}`;
};
