import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { AgGridModule } from '@ag-grid-community/angular';
import { FormsModule } from '@angular/forms';
import { TableRouting } from './table-routing.module';

@NgModule({
    declarations: [
        TableComponent
    ],
    imports: [
        CommonModule,
        AgGridModule.withComponents([]),
        FormsModule,
        TableRouting

    ]
})
export class TableModule{}