import { Injectable } from '@angular/core';
import { bluetoothSerial as bt } from './bt-serial';

  
@Injectable({
	providedIn: 'root'
})
export class BtService {
  
	constructor() {}
  
	//#######################################################
	//# Promisify bt functions
	//#######################################################
  
	isConnected() {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btIsisConnected: bluetooth not found");
		} else {
		  bt.isConnected(resolve, reject);
		}
	  });
	}

	listPaired() {
		return new Promise((resolve, reject) => {
			if (!bt) {
			  reject("btListPaired: bluetooth not found");
			} else {
			  bt.listPaired(resolve, reject);
			}
		  });	
	}
  
	list() {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btList: bluetooth not found");
		} else {
		  bt.list(resolve, reject);
		}
	  });
	}
  
	connect(address) {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btConnect: bluetooth not found");
		} else {
		  bt.connect(address, resolve, reject);
		}
	  });
	}
  
	disconnect() {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btDisconnect: bluetooth not found");
		} else {
		  bt.disconnect(resolve, reject);
		}
	  });
	}
  
  
	subscribe(receiveCb) {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btSubscribe: bluetooth not found");
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
		  reject("btUnsubscribe: bluetooth not found");
		} else {
		  bt.unsubscribe(resolve, reject);
		}
	  });
	}
  
	write(msg) {
	  return new Promise((resolve, reject) => {
		if (!bt) {
		  reject("btWrite: bluetooth not found");
		} else {
		  bt.write(msg + "\r\n", resolve, reject);
		}
	  });
	}
  
  
  }
  