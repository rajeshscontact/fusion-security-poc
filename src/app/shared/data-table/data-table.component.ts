import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() title:string;
  @Input() headers:string[];
  @Input() data;
  rows = [];
  cells = [];
  tableHeaders =[];

  constructor() { }
  ngOnChanges(changes: SimpleChanges){
    if(changes['data']){
      this.data = changes['data']['currentValue'];
      this.updateData();
    }
    if(changes['headers']){
      this.headers = changes['headers']['currentValue'];
    }
  }

  ngOnInit() {
    this.updateTableHeaders();
  }

  updateTableHeaders(){
    this.tableHeaders = [];
    for(var prop in this.headers) {
      if(prop){
        this.tableHeaders.push(prop);
      }
    }
  }

  updateData(){
    if(Array.isArray(this.data)){
      this.rows = [];
      this.data.forEach((object) => {
        this.cells = [];
        for(var prop in this.headers) {
          let propData = getPropertyValue(object, this.headers[prop]);
          if(propData) {
            this.cells.push(propData);
          } else {
            this.cells.push('N/A');
          }
        };
        this.rows.push(this.cells);
      });
    }
  }

}

function getPropertyValue(object, property) {
  var propertyValue = object;
  property.toString().split('.').forEach(function(nestedProp) {
    if(Object.prototype.toString.call(propertyValue) === '[object Object]') {
      propertyValue = propertyValue[nestedProp];
    }
  });
  return propertyValue;
}
