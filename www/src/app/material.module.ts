import { NgModule } from '@angular/core';
import { MatRadioModule, MatTabsModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

const modules = [
	MatRadioModule,
	MatSidenavModule,
	MatTabsModule,
	MatToolbarModule
];

@NgModule({
	imports: modules,
	exports: modules
})
export class MyMaterialModule {}