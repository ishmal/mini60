import { Injectable } from '@angular/core';
import { BtService } from './bt.service';
import { LogService } from './log.service';
import { ConfigService } from './config.service';


const NR_STEPS = 30;
const isBrowser = false;

@Injectable({
	providedIn: 'root'
})
export class Mini60Service {

	connected: boolean;
	timer: any;
	graph: any;
	par: any;
	nrSteps: number;

	constructor(private btService: BtService,
		private log: LogService,
		private configService: ConfigService) {
		this.par = parent;
		this.connected = false;
		this.nrSteps = NR_STEPS;
	}

	async connect(device, parent) {
			
		try {
			this.log.infoAlert(`connecting to '${device.name}' `);
			await this.btService.connect(device.address);
			await this.btService.subscribe((dat) => this.receive(dat, parent));
		} catch(e) {
			this.log.error("connect failure with '" + device.name + "' : " + e);
		}
	}

	async disconnect() {
		if (!this.connected) {
			return;
		}
		try {
			await this.btService.unsubscribe();
			await this.btService.disconnect();
		} catch(e) {
			this.log.error("unsubscribe: " + e);
		}
	}

	receive(data, parent) {
		data = data || "";
		data = data.trim();
		if (data.startsWith("Start")) {
			parent.startScan();
		} else if (data.startsWith("End")) {
			parent.endScan();
		} else {
			let arr = data.split(",");
			if (arr.length === 4) {
				let dp = {
					swr: parseFloat(arr[0]),
					r: parseFloat(arr[1]),
					x: parseFloat(arr[2]),
					z: parseFloat(arr[3])
				};
				parent.update(dp);
			}
		}
	}


	async send(msg) {
		if (!msg) {
			return;
		}
		try {
			await this.btService.write(msg + "\r\n");
		} catch(e) {
			this.log.error("send: " + e);
		}
	}

	findDevice(devices) {
		const deviceName = this.configService.config.deviceName.toLowerCase();
		this.log.info("finding device");
		const dev = devices.find(d => {
			const name = d.name.toLowerCase();
			return name.startsWith(deviceName);
		});
		if (!dev) {
			this.log.error("Paired device '" + deviceName + "' not found");
		}
		return dev;
	}

	async findDeviceAndConnect(parent) {
		try {
			const devices = await this.btService.list();
			let dev = this.findDevice(devices);
			this.log.info(`connecting to '${dev.name}' `)
			await this.connect(dev, parent);
		} catch(e) {
			this.log.error("findDeviceAndConnect: cannot list paired devices: " + e);

		}
	}

	dummyScan(parent) {
		this.receive("Start", parent);
		const r = this.configService.range;
		const start = r.start * 1000;
		const end = r.end * 1000;
		const step = (end - start) / NR_STEPS;
		let freq = start;
		let xp = 0;
		const xinc = Math.PI / NR_STEPS;
		const runme = () => {
			let swr = 5 - Math.sin(xp * 1.8) * 1.5;
			xp += xinc;
			let r = 4 - Math.sin(xp * 3) * 1.5;
			let x = 3;
			let z = 2;
			let data = `${swr},${r},${x},${z}`;
			this.receive(data, parent);
			freq += step;
			if (freq < end) {
				setTimeout(runme, 50);
			} else {
				this.receive("End", parent);
			}
		}
		runme();
	}

	scan() {
		this.log.info("start scan");
		let r = this.configService.range;
		let start = r.start * 1000;
		let end = r.end * 1000;
		let step = ((end - start) / NR_STEPS) | 0;
		let cmd = "scan " + start + " " + end + " " + step;
		this.log.info("cmd: " + cmd);
		return this.send(cmd);
	}

	async checkConnectAndScan(parent) {
		if (isBrowser) {
			this.dummyScan(parent);
			return;
		}
		if (this.connected) {
			this.scan();
		}
		try {
			await this.findDeviceAndConnect(parent);
			this.scan();
		} catch(e) {
			this.log.error("checkConnectAndScan: " + e);
		}
	}

	async heartbeat() {
		if (isBrowser) {
			return;
		}
		//success = yes, failure = no
		try {
			await this.btService.isConnected();
			this.connected = true;
			this.graph.redraw();	
		} catch (e) {
			this.connected = false;
			this.graph.redraw();	
		}
	}

	startHeartbeat() {
		this.timer = setInterval(() => this.heartbeat(), 4000);
	}

	stopHeartbeat() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}


}
