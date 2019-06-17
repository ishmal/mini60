const path = require("path");
const fs = require("fs");
const promisify = require("util").promisify;
const im = require('imagemagick');

const p_stat = promisify(fs.stat);
const p_mkdir = promisify(fs.mkdir);
const p_resize = promisify(im.resize);


function trace(msg) {
	console.log(msg);
}

function err(msg) {
	console.error(msg);
}

const iconOutputs = [{
		name: "storelogo.png",
		width: 50,
		height: 50
	},
	{
		name: "smalllogo.png",
		width: 30,
		height: 30
	},
	{
		name: "Square44x44Logo.png",
		width: 44,
		height: 44
	},
	{
		name: "Square70x70Logo.png",
		width: 70,
		height: 70
	},
	{
		name: "Square71x71Logo.png",
		width: 71,
		height: 71
	},
	{
		name: "Square150x150Logo.png",
		width: 150,
		height: 150
	},
	{
		name: "Square310x310Logo.png",
		width: 310,
		height: 310
	},
	{
		name: "Wide310x150Logo.png",
		width: 310,
		height: 150
	}
];

const splashOutputs = [{
	name: "splashscreen.png",
	width: 620,
	height: 300
}, ];

class WindowsIcons {
	constructor() {
		this.resourceDir = path.resolve(__dirname, "..", "resources");
		this.resourceWinDir = path.join(this.resourceDir, "windows");
		this.iconFile = path.join(this.resourceDir, "icon.png");
		this.splashFile = path.join(this.resourceDir, "splash.png");
	}

	async checkIconFile() {
		const f = this.iconFile;
		const stat = await p_stat(f);
		if (stat.isFile()) {
			trace(`icon file '${f}' exists`);
			return true;
		} else {
			err(`icon file ${f} does not exist`);
			return false;
		}
	}

	async checkSplashFile() {
		const f = this.splashFile;
		const stat = await p_stat(f);
		if (stat.isFile()) {
			trace(`splash file '${f}' exists`);
			return true;
		} else {
			err(`splash file ${f} does not exist`);
			return false;
		}
	}

	async checkWinDir() {
		const f = this.resourceWinDir;
		try {
			const stat = await p_stat(f);
			trace(`windows resource directory '${f}' exists`);
		} catch (e) {
			try {
				await (p_mkdir(f));
				trace(`windows resource directory '${f}' created`);
				return true;
			} catch (e) {
				trace(`windows resource directory '${f}' not created: ${e}`);
				return false;
			}
		}
		return true;
	}

	async makeIcons() {
		for (let icon of iconOutputs) {
			const srcPath = this.iconFile;
			const dstPath = path.join(this.resourceWinDir, icon.name);
			const opts = {
				srcPath,
				dstPath,
				quality: 1,
				format: 'png',
				width: icon.width,
				height: icon.height
			};
			try {
				await p_resize(opts);
				trace(`created '${dstPath}'`)
			} catch (e) {
				err(`creation of '${dstPath}' failed`);
				return false;
			}
		}
		return true;
	}

	async makeSplash() {
		for (let icon of splashOutputs) {
			const srcPath = this.splashFile;
			const dstPath = path.join(this.resourceWinDir, icon.name);
			const opts = {
				srcPath,
				dstPath,
				quality: 1,
				format: 'png',
				width: icon.width,
				height: icon.height
			};
			try {
				await p_resize(opts);
				trace(`created '${dstPath}'`)
			} catch (e) {
				err(`creation of '${dstPath}' failed`);
				return false;
			}
		}
		return true;
	}

	async execute() {
		const hasIcon = await this.checkIconFile();
		if (!hasIcon) {
			return false;
		}
		const hasSplash = await this.checkSplashFile();
		if (!hasSplash) {
			return false;
		}
		const hasOutput = await this.checkWinDir();
		if (!hasOutput) {
			return false;
		}
		const iconsMade = await this.makeIcons();
		if (!iconsMade) {
			return false;
		}
		const splashMade = await this.makeSplash();
		if (!splashMade) {
			return false;
		}
		return true;
	}
}

async function runme() {
	const wi = new WindowsIcons();
	const res = await wi.execute();
	if (res) {
		console.log("Success");
		process.exit(0);
	} else {
		console.error("Failure");
		process.exit(-1);
	}
}

runme();