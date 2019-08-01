  
function p_fromIdAsync(id) {
	return new Promise((resolve, reject) => {
		Windows.Devices.Bluetooth.BluetoothDevice.fromIdAsync(id).done(resolve, reject);
	});
}

function p_getRfcommServicesAsync(device) {
	return new Promise((resolve, reject) => {
		device.getRfcommServicesAsync().done(resolve, reject);
	});
}

function p_connectAsync(socket, hostName, serviceName) {
	return new Promise((resolve, reject) => {
		socket.connectAsync(hostName, serviceName).done(resolve, reject);
	});
}

function p_flushAsync(writer) {
	return new Promise((resolve, reject) => {
		writer.flushAsync().done(resolve, reject);
	});
}

function p_storeAsync(writer) {
	return new Promise((resolve, reject) => {
		writer.storeAsync().done(resolve, reject);
	});
}



class BtSerialWin {

	constructor() {
		this.connected = false;
		this.devices = {};
		this.delimiter = "\n";
		this.subscriptionFunction = (dat) => {};
		this.socket = null;
	}

	isConnected(success, failure) {
		if (this.socket) {
			success(true);
		} else {
			failure(false)
		}
	}

	/**
	 * Lists paired devices, whether they are connected or visible or not
	 * @param {function<list<deviceInformation>>} success function to call async in case of success.  Returns list
	 * of device information
	 * @param {function<string>} failure called async in case of failure.  Send error message
	 */
	list(success, failure) {
		// namespace shortcuts
		const ENS = Windows.Devices.Enumeration;
		const BNS = Windows.Devices.Bluetooth;
		const selector1 = 
			"System.Devices.Aep.ProtocolId:=\"{e0cbf06c-cd8b-4647-bb8a-263b43f0f974}\"";
		const selector = BNS.BluetoothDevice.getDeviceSelectorFromPairingState(true);
		this.devices = {};
    	const complete = (devices) => {
        	for (let i = 0, len = devices.length; i < len; i++) {
				const di = devices.getAt(i);
				this.devices[di.name] = di;
			}
			success(devices);
   	 	};

		const error = (e) => {
			failure(e);
			console.error(e);
		};
		ENS.DeviceInformation.findAllAsync(selector, null).done(complete, error);
	}

	startReading(socket) {
		const dataReader = new Windows.Storage.Streams.DataReader(socket.inputStream);
		dataReader.UnicodeEncoding = Windows.Storage.Streams.UnicodeEncoding.Utf8;
		const delim = this.delimiter;
		let inbuf = "";
		const readFunc = () => {
			for (let keepGoing = true; keepGoing; ) {
				const success = () => {
					try {
						const ch = dataReader.readString(1);
						if (ch === delim) {
							this.subscriptionFunction(inbuf);
							inbuf = "";
						} else {
							inbuf += ch;
						}
					} catch(e) {
						
					}
				}
				const failure = () => {
					// error stuff
					keepGoing = false;
				}
				dataReader.loadAsync(1).done(success, failure);
			}
		}
		this.readInterval = setInterval(readFunc, 20);
	}

	async connect(nameOrAddress, success, failure) {
		if (this.socket) { //TODO:  test socket
			success(true);
			return;
		}
		// namespace shortcuts
		const BNS = Windows.Devices.Bluetooth;
		const RNS = BNS.Rfcomm;
		const SNS = Windows.Networking.Sockets;
		
		const di = this.devices[nameOrAddress];
		if (!di) {
			failure(`device '${nameOrAddress}' not found`)
			return;
		}

		const device = await p_fromIdAsync(di.id);
		if (!device) {
			failure(`cannot get device for '${di.id}' `);
			return;
		}

		const rfcommServices = await p_getRfcommServicesAsync(device);
		if (rfcommServices.services.length === 0) {
			failure(`no rfComm service found on device '${nameOrAddress}' `);
			return;
		}
		const rfcommService = rfcommServices.services[0];
		const hostName = rfcommService.connectionHostName;
		const serviceName = rfcommService.connectionServiceName

		const socket = new SNS.StreamSocket();
		try {
			await p_connectAsync(socket, hostName, serviceName);
			this.socket = socket;
			this.startReading(socket);
			success(`connected to '${nameOrAddress}' `);
		} catch(e) {
			failure(`failed connecting to '${nameOrAddress}' : ${e} `);
		}
	}

	/**
	 * Disconnect our stream socket
	 * @param {function<string>} success function to call in case of success
	 * @param {function<string>} failure function to call in case of failure 
	 */
	async disconnect(success, failure) {
		clearInterval(this.readInterval);
		if (!this.socket) {
			success(true);
			return;
		}
		try {
			await this.socket.disconnect();
			this.socket = null;
			success("disconnected");
		} catch(e) {
			failure(e);
		}
	}

	subscribe(delimiter, callback, failure) {
		this.delimiter = delimiter;
		this.subscriptionFunction = callback;
	}

	unsubscribe(success, failure) {
		this.subscriptionFunction = (dat) => {};
		success(true);
	}

	async write(msg, success, failure) {
		if (!this.socket) {
			failure("write: not connected");
			return;
		}
		const SNS = Windows.Storage.Streams; // namespace shortcut
		try {
			const dataWriter = new SNS.DataWriter(this.socket.outputStream);
			dataWriter.UnicodeEncoding = SNS.UnicodeEncoding.Utf8;
			dataWriter.writeString(msg);
			await p_storeAsync(dataWriter);
			await p_flushAsync(dataWriter);
			dataWriter.detachStream();
			success(true);
		} catch (e) {
			failure("write: " + e);
		}

	}

}

const isWindows = typeof Windows !== "undefined" && typeof Windows.Devices !== "undefined";
export const bluetoothSerial = isWindows ?
	new BtSerialWin() : window.bluetoothSerial;