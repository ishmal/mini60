import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  config: object;

  constructor(private configService: ConfigService) {
    this.config = configService.config;
  }

  ngOnInit() {}

}
