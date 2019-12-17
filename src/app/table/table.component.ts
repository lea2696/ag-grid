import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AllModules} from '@ag-grid-enterprise/all-modules';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent  {
  @ViewChild('agGrid', {static: false}) agGrid;
  
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
  private modules = AllModules;
  private numberCol: Array<any> = [];
  
  toogle(){
    this.addColumn = !this.addColumn
  }
  onGridReady(params) {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.agGrid.gridOptions.copyHeadersToClipboard = true;
  }

  searchOnGrid(){
    this.agGrid.api.setQuickFilter(this.search);

  }
  getContextMenuItems(params){
    console.log(params);
    let  result = [
      {
        name: "Alerta",
        action: () => { window.alert("Hola")},

      },
      "copy", 
  
    ];
    return result;
  }
   
  handleChange(e){
    let rowData = this.rowData;
    rowData.forEach(element => {
      let total = 0;
        for(let property in element){
            if(this.numberCol.includes(property)){
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
    },
    {headerName: "Total",
    field: "Total",
    sortable: true,
    filter: true,
    pinned: "rigth",
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
    
    let columnDef = this.agGrid.gridOptions.columnDefs;
  
      if(this.columnName.name==="") return false;
      if(this.columnName.type === "number"){
        this.numberCol.push(this.columnName.name);
      }
     
      columnDef.push({
        headerName: this.columnName.name,
        field: `${this.columnName.name}` ,
        editable: true,
        sortable: true,
        filter: true,
        pinned: "left",
        width: 100,
       
        cellStyle: (params) => {
            if(this.numberCol.includes(params.colDef.field)){
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
