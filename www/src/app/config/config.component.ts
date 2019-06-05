import { Component, OnInit } from '@angular/core';
import { Config, ConfigService } from '../config.service';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  config: Config;

  constructor(private configService: ConfigService) {
    this.config = this.configService.config;
  }

  ngOnInit() {}

}
