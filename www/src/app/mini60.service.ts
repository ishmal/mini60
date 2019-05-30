import { Injectable } from '@angular/core';
import { BtService } from './bt.service';

declare global {
    interface Window { bluetoothSerial: any; }
}

const bt = window.bluetoothSerial;

@Injectable({
  providedIn: 'root'
})
export class Mini60Service {

  constructor(private btService: BtService) {}

  connect(device) {
		
	return this.btService.connect(device.address)
	.then(() => {
		return this.btService.subscribe((dat) => this.receive(dat));
	})
	.catch((e) => {
		error("connect failure with '" + device.name + "' : " + e);
	});

}

disconnect() {
	if (!this.connected) {
		return;
	}
	return this.btService.unsubscribe()
	.then(() => {
		return this.btService.disconnect();
	})
	.catch((e) => {
		error("unsubscribe: " + e);
	});
}

receive(data) {
	data = data || "";
	data = data.trim();
	if (data.startsWith("Start")) {
		this.graph.startScan();
	} else if (data.startsWith("End")) {
		this.graph.endScan();
	} else {
		let arr = data.split(",");
		if (arr.length === 4) {
			let dp = {
				swr: parseFloat(arr[0]),
				r: parseFloat(arr[1]),
				x: parseFloat(arr[2]),
				z: parseFloat(arr[3])
			};
			this.graph.update(dp);
		}
	}
}


send(msg) {
	if (!msg) {
		return;
	}
	return this.btService.write(msg + "\r\n")
	.then(() => {
		//trace("sent!");
	})
	.catch(e => {
		error("send: " + e);
	});
}

findDevice(devices) {
	let deviceName = this.config.config.deviceName;
	deviceName = deviceName.toLowerCase();
	let dev = devices.find(d => {
		let name = d.name.toLowerCase();
		return name.startsWith(deviceName);
	});
	if (!dev) {
		error("Paired device '" + deviceName + "' not found");
	}
	return dev;
}

findDeviceAndConnect() {
	return this.btService.list()
	.then((devices) => {
		let dev = this.findDevice(devices);
		return this.connect(dev);
	})
	.catch((e) => {
		error("findDeviceAndConnect: cannot list paired devices: " + e);
	});
}

dummyScan() {
	let that = this;
	this.receive("Start");
	let r = this.range;
	let start = r.start * 1000;
	let end = r.end * 1000;
	let step = ((end - start) / this.nrSteps) | 0;
	let freq = start;
	let xp = 0;
	let xinc = Math.PI / this.nrSteps;
	function runme() {
		let swr = 5 - Math.sin(xp);
		xp += xinc;
		let r = 4 - Math.sin(xp * 2);
		let x = 3;
		let z = 2;
		let data = `${swr},${r},${x},${z}`;
		that.receive(data);
		freq += step;
		if (freq < end) {
			setTimeout(runme, 50);
		} else {
			that.receive("End");
		}
	}
	runme();
}

scan() {
	let r = this.range;
	let start = r.start * 1000;
	let end = r.end * 1000;
	let step = ((end - start) / this.nrSteps) | 0;
	let cmd = "scan " + start + " " + end + " " + step;
	trace("cmd: " + cmd);
	return this.send(cmd);
}

checkConnectAndScan() {
	if (isBrowser) {
		this.dummyScan();
		return;
	}
	if (this.connected) {
		return this.scan();
	}
	return this.findDeviceAndConnect()
	.then(() => {
		return this.scan();
	})
	.catch((e) => {
		error("checkConnectAndScan: " + e);
	});
}

heartbeat() {
	if (isBrowser) {
		return;
	}
	//success = yes, failure = no
	return this.btService.isConnected()
	.then(() => {
		this.connected = true;
		this.graph.redraw();
	})
	.catch(() => {
		this.connected = false;   
		this.graph.redraw();
	});
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
