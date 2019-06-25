import {
	Injectable
} from '@angular/core';

export interface Range {
	name: string,
		start: number,
		end: number
}

export interface Config {
	deviceName: string,
		rangeIndex: number,
		ranges: Range[]
}

/**
 * Configuration file.  Modify at will!!  Enjoy
 */
const defaultConfig: Config = {
	deviceName: "mini",
	rangeIndex: 0,
	ranges: [{
			name: "160 m",
			start: 1750,
			end: 2050
		},
		{
			name: "80/75 m",
			start: 3400,
			end: 4100
		},
		{
			name: "60 m",
			start: 5250,
			end: 5450
		},
		{
			name: "40 m",
			start: 6900,
			end: 7400
		},
		{
			name: "30 m",
			start: 10050,
			end: 10300
		},
		{
			name: "20 m",
			start: 13800,
			end: 14700
		},
		{
			name: "17 m",
			start: 18000,
			end: 18250
		},
		{
			name: "15 m",
			start: 20800,
			end: 21700
		},
		{
			name: "12 m",
			start: 24700,
			end: 25100
		},
		{
			name: "10 m",
			start: 27900,
			end: 30000
		},
		{
			name: "6 m",
			start: 49800,
			end: 54200
		},
		{
			name: "custom 1",
			start: 1500,
			end: 30000
		},
		{
			name: "custom 2",
			start: 1500,
			end: 30000
		}
	]
};

const dataName = "mini60";

@Injectable({
	providedIn: 'root'
})
export class ConfigService {

	config: Config;

	constructor() {
		this.load();
	}

	get range(): Range {
		return this.config.ranges[this.config.rangeIndex];
	}

	save() {
		let json = JSON.stringify(this.config);
		window.localStorage.setItem(dataName, json);
	}

	load() {
		try {
			const item = window.localStorage.getItem(dataName);
			if (item) {
				this.config = JSON.parse(item);
			} else {
				this.reset();
			}
		} catch (e) {
			console.log("load: " + e);
			this.reset();
		}

	}

	reset() {
		const str = JSON.stringify(defaultConfig);
		const c: Config = JSON.parse(str);
		this.config = c;
		this.save();
	}

	select(idx) {
		const c = this.config;
		c.rangeIndex = idx;
		return this.range;
	}

	next(): Range {
		const c = this.config;
		c.rangeIndex = (c.rangeIndex + 1) % c.ranges.length;
		return this.range;
	}

	prev(): Range {
		const c = this.config;
		c.rangeIndex = (c.rangeIndex - 1 + c.ranges.length) % c.ranges.length;
		return this.range;
	}

}