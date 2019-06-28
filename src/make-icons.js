const path = require("path");
const fs = require("fs");
const promisify = require("util").promisify;
const mkdirp = require("mkdirp");
const sharp = require('sharp');

const p_stat = promisify(fs.stat);
const p_mkdirp = promisify(mkdirp);


function trace(msg) {
	console.log(msg);
}

function err(msg) {
	console.error(msg);
}

const Platforms = {
	android: {
		iconPath: "android/icons",
		icons: [

		],
		splashPath: "android/splash",
		splash: {

		}
	},
	windows: {
		iconPath: "windows",
		icons: [
			{
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
		],
		splashPath: "windows",
		splash: [
			{
				name: "splashscreen.png",
				width: 620,
				height: 300
			}
		]
	}
}




class MakeIcons {
	constructor() {
		this.resourceDir = path.resolve(__dirname, "..", "resources");
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


	async checkOutputDir(dir) {
		const f = path.join(this.resourceDir, dir);
		try {
			await p_stat(f);
			trace(`resource directory '${f}' exists`);
		} catch (e) {
			try {
				await (p_mkdirp(f));
				trace(`resource directory '${f}' created`);
				return true;
			} catch (e) {
				trace(`resource directory '${f}' not created: ${e}`);
				return false;
			}
		}
		return true;
	}

	async makeIcons(inFile, outputs, outputDir) {
		const ok = await this.checkOutputDir(outputDir);
		if (!ok) {
			return false
		}
		for (let icon of outputs) {
			const srcPath = inFile;
			const dstPath = path.join(this.resourceWinDir, icon.name);
			try {
				await sharp(srcPath).resize(icon.width, icon.height).toFile(dstPath);
				trace(`created '${dstPath}'`)
			} catch (e) {
				err(`creation of '${dstPath}' failed: ${e}`);
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
		for (let k of Object.keys(Platforms)) {
			const platform = Platforms[k];
			const iconsMade = await this.makeIcons(this.iconFile, platform.icons, platform.iconPath);
			if (!iconsMade) {
				return false;
			}
			const splashMade = await this.makeIcons(this.splashFile, platform.splash, platform.splashPath);
			if (!splashMade) {
				return false;
			}
	
		}
		return true;
	}
}

async function runme() {
	const wi = new MakeIcons();
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