import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() {}

  log(msg) {
    console.log(msg);
  }
  
  error(msg) {
    console.error(msg);
  }

  info(msg) {
    console.info(msg);
  }

  warn(msg) {
    console.warn(msg);
  }
}
