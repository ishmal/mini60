import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private alertController: AlertController) {}

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Alert',
      //subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK']
    });

	await alert.present();
	setTimeout(() => alert.dismiss(), 3000);
  }

  log(msg) {
    console.log(msg);
  }
  
  error(msg) {
	console.error(msg);
	this.presentAlert(msg);
  }

  info(msg) {
    console.info(msg);
  }

  warn(msg) {
    console.warn(msg);
  }
}
