import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private toastController: ToastController) {}

  async errorAlert(msg) {
    const alert = await this.toastController.create({
	  animated: true,
      header: 'Error',
      message: msg,
      duration: 3000
    });
	await alert.present();
  }

  async infoAlert(msg) {
    const alert = await this.toastController.create({
      message: msg,
      duration: 3000
    });
	await alert.present();
  }

  log(msg) {
    console.log(msg);
  }
  
  error(msg) {
	console.error(msg);
	this.errorAlert(msg);
  }

  info(msg) {
	console.info(msg);
	this.infoAlert(msg);
  }

  warn(msg) {
    console.warn(msg);
  }
}
