  



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

	list(success, failure) {
		const DevInfo = Windows.Devices.Enumeration.DeviceInformation;
		const BtDevice = Windows.Devices.Bluetooth.BluetoothDevice;
		const selector1 = 
			"System.Devices.Aep.ProtocolId:=\"{e0cbf06c-cd8b-4647-bb8a-263b43f0f974}\"";
		const selector2 = BtDevice.getDeviceSelectorFromPairingState(true);
		this.devices = {};
    	const complete = (devices) => {
        	for (let i = 0, len = devices.length; i < len; i++) {
				let device = devices.getAt(i);
				const name = device.name;
				console.log(name);
				this.devices[name] = device;
			}
			success(devices);
   	 	}

		const error = (e) => {
			failure(e);
			console.error(e);
		}
		DevInfo.findAllAsync(selector2, null).done(complete, error);
	}

	connect(nameOrAddress, success, failure) {
		// namespace shortcuts
		const BNS = Windows.Devices.Bluetooth;
		const RNS = BNS.Rfcomm;
		const SNS = Windows.Networking.Sockets;
		
		const device = this.devices[nameOrAddress];
		if (!device) {
			failure(`device '${nameOrAddress}' not found`)
			return;
		}

		const rfcommServices = await device.GetRfcommServicesAsync(BNS.BluetoothCacheMode.Uncached);
		if (rfcommServices.length === 0) {
			failure(`no rfComm service found on device '${nameOrAddress}' `);
			return;
		}
		const rfCommService = rfCommServices[0];

		const sdpServiceNameAttributeId = 0x100;
		const attributes = await rfCommService.GetSdpRawAttributesAsync();
        if (!attributes.ContainsKey(sdpServiceNameAttributeId)) {
            failure("rfComm service is not advertising the Service Name attribute (attribute id=0x100)");
            return;
		}

		const socket = new SNS.StreamSocket();
		try {
			await socket.ConnectAsync(rfCommService.ConnectionHostName, rfCommService.ConnectionServiceName);
			this.socket = socket;
			success(`connected to '${nameOrAddress}' `);
		} catch(e) {
			failure(`failed connecting to '${nameOrAddress}' `);
		}
	}

	disconnect(success, failure) {
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
		this.subscriptionFunction = success;
	}

	unsubscribe(success, failure) {
		this.subscriptionFunction = (dat) => {};
		success(true);
	}

	write(msg, success, failure) {
		if (!this.socket) {
			failure("write: not connected");
			return;
		}
	}

}

const isWindows = Windows && Windows.Devices;
export const bluetoothSerial = isWindows ?
	new BtSerialWin() : window.bluetoothSerial;