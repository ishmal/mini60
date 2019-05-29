import { NgModule } from '@angular/core';
import { MatTabsModule, MatToolbarModule } from '@angular/material';

const modules = [
	MatTabsModule,
	MatToolbarModule
];

@NgModule({
	imports: modules,
	exports: modules
})
export class MyMaterialModule {}