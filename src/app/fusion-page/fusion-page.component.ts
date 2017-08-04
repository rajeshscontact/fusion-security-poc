import { Component, OnInit, AfterViewInit, ViewContainerRef } from '@angular/core';

import { CfIconComponent } from 'cedrus-fusion';
import { IconModel } from 'cedrus-fusion';
import { IconStylingModel } from 'cedrus-fusion';

import { FusionPageService } from './fusion-page.service';
import { DatatableModel } from 'cedrus-fusion';

import { DataTableComponent } from '../shared/data-table/data-table.component';

@Component({
  selector: 'app-fusion-page',
  templateUrl: './fusion-page.component.html',
  styleUrls: ['./fusion-page.component.css'],
  providers: [FusionPageService]
})
export class FusionPageComponent implements OnInit, AfterViewInit {
  roles: String[];
  isVisible: boolean = false;
  accountSummary;
  myDatatable = new DatatableModel({});
  myCustomDataTable = {
    'headers':{
      'Customer Id':'customerId',
      'Opportunity':'inboundOpportunity',
      'Overview': 'overview'
    },
    'data':{},
    'title':'Tesing Data Table'
  };


  myCustomDataTable2 = {
    'headers':{
      'Account Number':'accountNumber',
      'Account Type':'accountType',
      'City': 'address.city',
      'State': 'address.state',
      'Net Worth':'netWorth'
    },
    'data':{},
    'title':'Tesing Data Table'
  };


  constructor(private service: FusionPageService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.service.getAccountSummary().subscribe((response) => {
      this.myDatatable.rows = response;
      this.accountSummary = response;
      this.myCustomDataTable.data = response;
    });
  }

  ngAfterViewInit() {
    this.roles = this.service.getRoles();
    /*if(this.roles.indexOf("manager") >= 0){
      this.isVisible = true;
    }*/
  }

  onClick(){
    console.log('111111111111111111', this.viewContainerRef);
  }

  rowsData = [
		{
			"name":"Joe G Bell",
			"city":"Palm Bay",
			"details": {
				"email":"joebell@gmail.com",
				"address":"1240 Bard Ln NE, Palm Bay, FL, 32905",
				"phoneNumber":"(321) 727-0914"
			}
		},
		{
			"name":"Billie J Smith",
			"city":"Mc Kees Rocks",
			"details": {
				"email":"billiesmith@gmail.com",
				"address":"112 Fawnvue Dr, Mc Kees Rocks, PA, 15136",
				"phoneNumber":"(412) 489-5444"
			}
		},
		{
			"name":"Allan Smith",
			"city":"Hurricane",
			"details": {
				"email":"alansmith@gmail.com",
				"address":"426 Brook Cir, Hurricane, WV, 25526",
				"phoneNumber":"(304) 562-5680"
			}
		},
		{
			"name": "Dillon Hebert",
			"city":"Welch",
			"details": {
				"email": "dillonhebert@gmail.com",
				"address":"135 Hastings Street, Welch, Marshall Islands, 7911",
				"phoneNumber":"(692) 239-4310"
			}
		},
		{
			"name":"Adriana Burris",
			"city":"Sisquoc",
			"details": {
				"email":"adrianaburris@gmail.com",
				"address":"308 Lloyd Court, Sisquoc, Indiana, 1140",
				"phoneNumber":"(866) 585-9482"
			}
		}
	];

	myDatatable2 = new DatatableModel({
		rows: this.rowsData,
		expandable: true
	});

}
