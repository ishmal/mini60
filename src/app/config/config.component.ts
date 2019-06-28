import { Component, OnInit } from '@angular/core';
import { Config, Range, ConfigService } from '../config.service';
import { LogService } from '../log.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  config: Config;
  configFormGroup: FormGroup;

  constructor(
	private logService: LogService,
	private configService: ConfigService,
	private formBuilder: FormBuilder
	) {
	this.config = this.configService.config;
	this.initForm();
}

  ngOnInit() {
  }

  initForm() {
	const fb = this.formBuilder;
	this.config = this.configService.config;
	const deviceName = this.config.deviceName;
	const ranges = this.config.ranges.slice(0);
	const rangesGroups = ranges.map(r => {
		const end = r.end;
		return fb.group({
			name: [ r.name, Validators.pattern("[A-Za-z0-9._\-]+")],
			start: [ r.start, [Validators.min(0), Validators.max(54200)] ],
			end: [ r.end, [Validators.min(end + 1), Validators.max(54200)] ]
		});
	});
	this.configFormGroup = fb.group({
		deviceName: [ deviceName, Validators.pattern("[a-z0-9._\-]+") ],
		ranges: fb.array(rangesGroups)
	});
  }

  save() {
	const val = this.configFormGroup.value;
	this.config.deviceName = val.deviceName;
	this.config.ranges = val.ranges.slice(0);
	this.configService.save();
	this.logService.infoAlert("Config saved");

  }

  restoreDefaults() {
	this.configService.reset();
	this.initForm();
	this.logService.infoAlert("Config reset");
  }

}
