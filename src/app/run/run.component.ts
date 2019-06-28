import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Chart from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import Hammer from "hammerjs";
import { ConfigService, Range } from '../config.service';
import { LogService } from '../log.service';
import { Mini60Service } from '../mini60.service';


interface Data {
	options: any,
		plugins: any,
		type: string,
		data: any
}

declare global {
	interface Window {
		width: number,
			height: number
	}
};

const TITLE_STYLE = {
	color: "black",
	style: "bold",
	size: 18
};

const AXIS_STYLE = {
	color: "black",
	style: "bold",
	size: 14
};


@Component({
	selector: 'app-run',
	templateUrl: './run.component.html',
	styleUrls: ['./run.component.scss']
})
export class RunComponent implements AfterViewInit {

	minSwr: number;
	minSwrFreq: number;
	minR: number;
	minRFreq: number;
	chart: any;
	canvas: any;
	data: Data;


	@ViewChild('chartCanvas') chartCanvas: ElementRef;

	constructor(private mini60Service: Mini60Service,
		private configService: ConfigService,
		private log: LogService) {
	}


	ngAfterViewInit() {
		this.canvas = this.chartCanvas.nativeElement;
		this.canvas.width = window.width;
		this.canvas.height = window.height;
		const ctx = this.canvas.getContext("2d");
		this.initData();
		this.chart = new Chart(ctx, this.data);
		Chart.pluginService.register(annotationPlugin);
		this.configService.rangeObservable.subscribe(r => {
			this.adjustData();
			this.redraw();
		});
		this.setupEvents();
	}


	initData() {

		const range = this.configService.range;

		this.data = {
			plugins: [
				annotationPlugin
			],
			type: "line",
			data: {
				datasets: [{
					label: "vswr",
					data: [],
					xAxisID: "X",
					yAxisID: "A",
					fill: false,
					borderWidth: 4,
					borderColor: "rgba(0,255,0,0.7)",
					backgroundColor: "rgba(75,255,0,0.6)",
					pointRadius: 1
				}, {
					label: "impedance",
					data: [],
					xAxisID: "X",
					yAxisID: "B",
					fill: false,
					borderWidth: 4,
					borderColor: "rgba(255,0,0,0.7)",
					backgroundColor: "rgba(255,75,0,0.6)",
					pointRadius: 1
				}]
			},
			options: {
				animation: false,
				title: {
					display: true,
					text: range.name,
					fontSize: TITLE_STYLE.size,
					fontStyle: TITLE_STYLE.style,
					fontColor: TITLE_STYLE.color
				},
				legend: {
					position: "top",
					labels: {
						fontSize: TITLE_STYLE.size,
						fontStyle: TITLE_STYLE.style,
						fontColor: TITLE_STYLE.color	
					}
				},
				scales: {
					yAxes: [{
						id: "A",
						type: "logarithmic",
						position: "left",
						scaleLabel: {
						},
						ticks: {
							min: 1,
							max: 10,
							fontSize: AXIS_STYLE.size,
							fontStyle: AXIS_STYLE.style,
							fontColor: AXIS_STYLE.color,
							callback: (value, index, values) => Math.floor(value).toString()
						}
					}, {
						id: "B",
						type: "logarithmic",
						position: "right",
						scaleLabel: {
						},
						ticks: {
							min: 1,
							max: 10000,
							fontSize: AXIS_STYLE.size,
							fontStyle: AXIS_STYLE.style,
							fontColor: AXIS_STYLE.color,
							callback: (value, index, values) => {
								let s = Math.floor(value).toString();
								if (s.startsWith("1") || s.startsWith("5")) {
									return s;
								}
							}
						}
					}],
					xAxes: [{
						id: "X",
						type: "linear",
						position: "bottom",
						scaleLabel: {
						},
						ticks: {
							fontSize: AXIS_STYLE.size,
							fontStyle: AXIS_STYLE.style,
							fontColor: AXIS_STYLE.color,
							min: 13600,
							max: 14700
						}
					}]
				},
				annotation: {
					drawTime: "afterDraw",
					annotations: []
				}
			}
		};

	}


	adjustData() {
		const range = this.configService.range;
		let opts = this.data.options;
		let ticks = opts.scales.xAxes[0].ticks;
		ticks.min = range.start;
		ticks.max = range.end;
		opts.title.text = range.name;
	}

	startScan() {
		this.log.info("startScan");
		//this 'ticks' code duplicated below intentionally
		this.adjustData();
		const range = this.configService.range;
		let ds = this.chart.data.datasets;
		ds[0].data = [];
		ds[1].data = [];
		this.data.options.annotation.annotations = [];
		this.minSwr = 999;
		this.minSwrFreq = range.start;
		this.minR = Number.MAX_VALUE;
		this.minRFreq = range.start;
		this.redraw();
	}

	endScan() {
		const txt = this.minSwrFreq.toFixed(0) + "   :   " + this.minSwr.toFixed(1);
		const annot = {
			type: "line",
			mode: "vertical",
			scaleID: "X",
			value: this.minSwrFreq,
			borderColor: "red",
			borderWidth: 3,
			label: {
				enabled: true,
				fontSize: 14,
				content: txt
			}
		};
		const annots = this.data.options.annotation.annotations;
		annots.push(annot);
		this.redraw();
	}

	update(datapoint) {
		const range = this.configService.range;
		const nrSteps = this.mini60Service.nrSteps;
		const ds = this.chart.data.datasets;
		const len = ds[0].data.length;
		const freq = range.start + (range.end - range.start) * len / nrSteps;
		const swr = datapoint.swr;
		if (swr < this.minSwr) {
			this.minSwr = swr;
			this.minSwrFreq = freq;
		}
		ds[0].data.push({
			x: freq,
			y: swr
		});
		ds[1].data.push({
			x: freq,
			y: datapoint.r
		});
		this.redraw();
	}

	redraw() {
		window.requestAnimationFrame(() => {
			try {
				this.chart.update(0);
			} catch (e) {
				console.log("redraw: " + e);
			}
		});
	}

	setupEvents() {
		const hammer = new Hammer(this.canvas);
		hammer.on("doubletap", () => {
			this.log.info("tap-tap");
			this.mini60Service.checkConnectAndScan(this);
		});
		hammer.on("swipeleft", () => {
			this.log.info("left");
			this.configService.next();
			this.adjustData();
			this.redraw();
		});
		hammer.on("swiperight", () => {
			this.log.info("right");
			this.configService.prev();
			this.adjustData();
			this.redraw();
		});
	}




}