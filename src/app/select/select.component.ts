import {
	Component,
	OnInit
} from '@angular/core';
import { Config, Range, ConfigService } from '../config.service';


@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {

	constructor(private configService: ConfigService) {}

	ngOnInit() {}

	getRanges(): Range[] {
		return this.configService.config.ranges;
	}

	selectRange(idx: number) {
		this.configService.select(idx);
	}

	isSelected(idx: number): boolean {
		return idx === this.configService.config.rangeIndex;
	}

}