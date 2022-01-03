export namespace constants {
	export const DATA_FOLDER =
		process.env.APPDATA ||
		(process.platform == 'darwin'
			? process.env.HOME + '/Library/Preferences'
			: process.env.HOME + '/.local/share');
	export const IN_MEMORY_STORAGE = ':memory:';
}
