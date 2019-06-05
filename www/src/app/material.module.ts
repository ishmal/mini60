import { NgModule } from '@angular/core';
import { MatButtonModule, MatRadioModule, MatTabsModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

const modules = [
	MatButtonModule,
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