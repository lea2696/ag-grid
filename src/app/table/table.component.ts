import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from '@ag-grid-community/angular';
import {AllCommunityModules} from '@ag-grid-community/all-modules';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent  {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  
  private search:string;
  private gridApi;
  private gridColumnApi;
 

  onGridReady(params) {
    console.log(params)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  searchOnGrid(){
    this.agGrid.api.setQuickFilter(this.search);

  }
   
  handleChange(e){
    let rowData = this.rowData;
    rowData.forEach(element => {
        let total = 0;
        for(let property in element){
            if(property!=="Total"){
              total += Number(element[property])
            }
            element["Total"] = total;
        }
    });
    
    this.agGrid.gridOptions.api.setRowData(this.rowData);
  }

  columnDefs = [
    {headerName: "", field: "", sortable: true, checkboxSelection: true,  headerCheckboxSelection: true},
    {headerName: 'A', field: 'B', editable: true, sortable: true, filter: true},
    {headerName: 'B', field: 'C', editable: true, sortable: true, filter: true},
    {headerName: 'C', field: 'H', editable: true, sortable: true, filter: true},
    {headerName: 'Total', field: 'Total', editable: true, sortable: true, filter: true}
   ];



  rowData: any = [];

  modules = AllCommunityModules;

  constructor(private http: HttpClient) {

  }

  changeColor(e) {
    this.agGrid.gridOptions.rowStyle = {background: e.target.value};
  }

  addMoreColumns() {
      let columnDef = this.agGrid.gridOptions.columnDefs;
      let result = window.prompt("Introduce el nombre de la columna", "");
      if(result===null) return false;
     
      columnDef.push({
        headerName: result,
        field: result,
        editable: true,
         sortable: true,
          filter: true
      });
      this.agGrid.gridOptions.api.setColumnDefs(columnDef);
 

  }


  addMoreRows() {
    let rowData = this.agGrid.gridOptions.rowData;
    this.rowData.push({
      Total: 0
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

  pushData(){
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const data = [];
     selectedNodes.map( node => data.push(node.data) );
     console.log(data);
    let body = {
      name: "Luis",
      grid: data
    }
    this.http.post("https://recetas-node.herokuapp.com/grid", body).subscribe(
      res=> console.log(res),
      err => console.log(err)
    )
  }
  getData(){
    let body = {
      name: "Luis"
    }
    this.http.post("https://recetas-node.herokuapp.com/grid/get", body).subscribe(
      res=> console.log(res),
      err => console.log(err)
    )
  }
}
