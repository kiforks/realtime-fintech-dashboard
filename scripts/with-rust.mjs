import { execFileSync, spawnSync } from 'node:child_process';
import { delimiter, dirname } from 'node:path';
import process from 'node:process';

const isOnPath = command => spawnSync(command, ['--version'], { stdio: 'ignore' }).status === 0;

const findToolchainBin = () => {
	try {
		return dirname(execFileSync('rustup', ['which', 'cargo'], { encoding: 'utf8' }).trim());
	} catch {
		return null;
	}
};

const resolvePath = () => {
	const { PATH = '' } = process.env;

	if (isOnPath('cargo')) {
		return PATH;
	}

	const toolchainBin = findToolchainBin();

	return toolchainBin === null ? null : [toolchainBin, PATH].join(delimiter);
};

const [command, ...commandArgs] = process.argv.slice(2);
const path = resolvePath();

if (path === null) {
	console.error(
		'Cargo is not on PATH and rustup cannot locate it. Install Rust through rustup (https://rustup.rs, or `brew install rustup` on macOS) and run the command again.'
	);
	process.exit(1);
}

const { error, status } = spawnSync(command, commandArgs, { env: { ...process.env, PATH: path }, stdio: 'inherit' });

if (error) {
	console.error(`Failed to start ${command}: ${error.message}`);
	process.exit(1);
}

process.exit(status ?? 1);
