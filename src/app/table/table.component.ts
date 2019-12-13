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
  columnName = {
    name: '',
    type: 'other'
  };
  private gridApi;
  private gridColumnApi;
  addColumn:boolean = false;
 
  toogle(){
    this.addColumn = !this.addColumn
  }
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
                if(property.includes("NUMBER")){
                    total += Number(element[property]);
                  
                }
            }
            element["Total"] = total;
        }
    });

    this.agGrid.gridOptions.api.setRowData(this.rowData);
  }

  columnDefs = [
    {headerName: "",
      field: "check",
      rowDrag: true,
      headerCheckboxSelection: true, 
      checkboxSelection: true,
      editable: true,
      sortable: true,
      filter: true,
      pinned: "left",
      width: 80
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



  rowData: any = [];

  modules = AllCommunityModules;

  constructor(private http: HttpClient) {

  }


  addMoreColumns(e) {
    e.preventDefault();
    console.log(this.columnName)
      let columnDef = this.agGrid.gridOptions.columnDefs;
  
      if(this.columnName.name==="") return false;
     
      columnDef.push({
        headerName: this.columnName.name,
        field: `${this.columnName.name}${this.columnName.type === "number" ? "NUMBER" : ""}` ,
        editable: true,
        sortable: true,
        filter: true,
        pinned: "left",
        width: 100,
        cellStyle: function (params) {

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

  // pushData(){
  //   const selectedNodes = this.agGrid.api.getSelectedNodes();
  //   const data = [];
  //    selectedNodes.map( node => data.push(node.data) );
  //    console.log(data);
  //   let body = {
  //     name: "Luis",
  //     grid: data
  //   }
  //   this.http.post("https://recetas-node.herokuapp.com/grid", body).subscribe(
  //     res=> console.log(res),
  //     err => console.log(err)
  //   )
  // }
  // getData(){
  //   let body = {
  //     name: "Luis"
  //   }
  //   this.http.post("https://recetas-node.herokuapp.com/grid/get", body).subscribe(
  //     res=> console.log(res),
  //     err => console.log(err)
  //   )
  // }
}
