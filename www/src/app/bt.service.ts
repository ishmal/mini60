import {
	Injectable
  } from '@angular/core';
  
  declare global {
	  interface Window { bluetoothSerial: any; }
  }
  
  const bt = window.bluetoothSerial;
  
  @Injectable({
	providedIn: 'root'
  })
  export class BtService {
  
	constructor() {}
  
	checkConnectAndScan() {
  
	}
  
	//#######################################################
	//# Promisify bt functions
	//#######################################################
  
	connected() {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btIsConnected: bt not found");
		} else {
		  bt.isConnected(resolve, reject);
		}
	  });
	}
  
	list() {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btList: bt not found");
		} else {
		  bt.list(resolve, reject);
		}
	  });
	}
  
	connect(address) {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btConnect: bt not found");
		} else {
		  bt.connect(address, resolve, reject);
		}
	  });
	}
  
	disconnect() {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btDisconnect: bt not found");
		} else {
		  bt.disconnect(resolve, reject);
		}
	  });
	}
  
  
	subscribe(receiveCb) {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btSubscribe: bt not found");
		} else {
		  let failMsg = null;
		  bt.subscribe("\n", receiveCb, (err) => {
			failMsg = err;
		  });
		  setTimeout(() => {
			if (failMsg) {
			  reject(failMsg);
			} else {
			  resolve(true);
			}
		  }, 500);
		}
	  });
	}
  
	unsubscribe() {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btUnsubscribe: bt not found");
		} else {
		  bt.unsubscribe(resolve, reject);
		}
	  });
	}
  
	write(msg) {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btWrite: bt not found");
		} else {
		  bt.write(msg + "\r\n", resolve, reject);
		}
	  });
	}
  
  
  }
  