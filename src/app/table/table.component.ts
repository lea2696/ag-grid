import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from '@ag-grid-community/angular';
import {AllCommunityModules, ColDef, ColDefUtil} from '@ag-grid-community/all-modules';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent  {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  
  constructor(private http: HttpClient) {
  }
  
  private search:string;
  columnName = {
    name: '',
    type: 'other'
  };
  private gridApi;
  private gridColumnApi;
  private addColumn:boolean = false;
  private rowData: any = [];
  private modules = AllCommunityModules;
  
  toogle(){
    this.addColumn = !this.addColumn
  }
  onGridReady(params) {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  searchOnGrid(){
    this.agGrid.api.setQuickFilter(this.search);

  }
   
  handleChange(e){
    let rowData = this.rowData;
    let colValues = this.columnDefs.filter(col => col.value === "number").map(data=> data.field);
    rowData.forEach(element => {
      let total = 0;
        for(let property in element){
            if(colValues.includes(property)){
                    total += Number(element[property]);     
            }
            element["Total"] = total;
        }
    });

    this.agGrid.gridOptions.api.setRowData(this.rowData);
  }

  columnDefs:any =  [
    {headerName: "",
      field: "check",
      rowDrag: true,
      headerCheckboxSelection: true, 
      checkboxSelection: true,
      editable: true,
      sortable: true,
      filter: true,
      pinned: "left",
      width: 80,
      value: "string"
    },
    {headerName: "Total",
    field: "Total",
    sortable: true,
    filter: true,
    pinned: "rigth",
    value: "total",
    cellStyle: function (params) {
      const value = Number(params.value)
      if(value === 100){
        return {
          background: "#48F151"
        };
      } else if(value < 100) {
        return {
          color: "white",
          background: "#F92B0F"
        }
      }
      return {
        background: "#88DEF8"
      }
    },
    width: 130
  },

   ];
  addMoreColumns(e) {
    e.preventDefault();
      let columnDef = this.columnDefs;
  
      if(this.columnName.name==="") return false;
     
      columnDef.push({
        headerName: this.columnName.name,
        field: `${this.columnName.name}` ,
        editable: true,
        sortable: true,
        filter: true,
        pinned: "left",
        width: 100,
        value: this.columnName.type === "number" ? "number" : "string",
       
        cellStyle: function (params) {
            if(params.colDef.value === "number"){
              return {
                background: "#F7E19F"
              }
        }
      }
    });
      this.agGrid.gridOptions.api.setColumnDefs(columnDef);
      this.columnName = {
        name: "",
        type: "other"
      };
      this.addColumn = false;

  }


  addMoreRows() {
    let rowData = this.agGrid.gridOptions.rowData;
    this.rowData.push({
      Total: 0,
    });
    this.agGrid.gridOptions.api.setRowData(rowData);
  }

  addLessRows() {
    let rowData = this.agGrid.gridOptions.rowData;
      rowData.pop();
    this.agGrid.gridOptions.api.setRowData(rowData);


  }
  addLessColumns() {
    let columnDef = this.agGrid.gridOptions.columnDefs;
    columnDef.pop()
    this.agGrid.gridOptions.api.setColumnDefs(columnDef);
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
     const data = [];
      selectedNodes.map( node => data.push(node.data) );
      console.log(data);
  }

}
