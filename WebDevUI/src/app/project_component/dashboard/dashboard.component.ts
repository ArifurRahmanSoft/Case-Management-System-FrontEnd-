import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Injectable  } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../app.settings';
import { ApiService } from '../../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { UpcommingShipment } from 'src/app/api/upcomming_shipment';
import { CompanyWiseImport } from 'src/app/api/company_wise_import';
import { ProductList } from 'src/app/api/product_list';
import { YearWiseImport } from 'src/app/api/year_wise_import';
import { HttpClient } from '@angular/common/http';
import { single } from '../../pages/charts/charts.data';
import { MatSliderChange } from '@angular/material/slider';
import { DatePipe } from '@angular/common'
import { Options } from 'select2';
import { Select2OptionData } from 'ng-select2';
//import * as $ from 'select2';
//import {DataTablesModule} from 'angular-datatables';



import { NativeDateAdapter } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';

import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
@Injectable()
export class AppDateAdapters extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date.toDateString();
  }
}
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapters},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    DatePipe
  ]
})


export class DashboardComponent implements OnInit {

  public shipment_list: UpcommingShipment[];
  public upcommingShipment  = [];
  public myData : Object;
  public isLoaded: Object = false;

  public productLcOpen : Object;
  public isLoadedProductLC: Object=false;

  public yearlyImportTable : Object;
  public isLoadedYearlyImportTable: Object = false;

  public dtOptions: DataTables.Settings = {};


  public from_year = 
  [
    "From Year",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010"
  ];

  public to_year = 
  [
    {
      "id": "2021",
      "text": "2021",
      "selected": true
      
    },
    {
      "id": "2020",
      "text": "2020"
      
    },
    {
      "id": "2019",
      "text": "2019"
      
    },
    {
      "id": "2018",
      "text": "2018"
      
    },
    {
      "id": "2017",
      "text": "2017"
      
    },
    {
      "id": "2016",
      "text": "2016"
      
    },
    {
      "id": "2015",
      "text": "2015"
      
    },
    {
      "id": "2014",
      "text": "2014"
      
    },
    {
      "id": "2013",
      "text": "2013"
      
    },
    {
      "id": "2012",
      "text": "2012"
      
    },
    {
      "id": "2011",
      "text": "2011"
      
    },
    {
      "id": "2010",
      "text": "2010"
      
      
    }
  ];

  public productList = [];
  public finalProductList : Object;
  public oidList = [];
  public finalOidList = [];
  public options: Options;
  patch_panel_array: Select2OptionData[];


  public modelFromYear;
  public modelToYear;
  public modelItem;


  public company_wise_import : CompanyWiseImport[];


  
  public graphData = []; 

  public barGraphData = []; 
  public data_for_graph = [];
  public data_for_bar_graph = [];

  public showLegend = false;
  public gradient = true;

  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false; 
  @ViewChild('resizedDiv') resizedDiv:ElementRef;
  public previousWidthOfResizedDiv:number = 0; 




  public autoTicks = false;
  public disabled = false;
  public invert = false;
  public max = 2021;
  public min = 2010;
  public showTicks = true;
  public step = 1;
  public thumbLabel = true;
  public value = 2021;
  public vertical = false;

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;



  public p_year = "2021";
  public test;


  public single: any[];
  public multi: any[];
  public showXAxis = true;
  public showYAxis = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Product Name';
  public showYAxisLabel = true;
  public yAxisLabel = 'Quantity (MT)';
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  };  


  public fromDate = new Date("01/31/2020"); // mm/dd/yyyy
  public toDate = new Date(); // mm/dd/yyyy

  public us_fromDate = new Date(); // mm/dd/yyyy
  public us_toDate = new Date(); // mm/dd/yyyy




  constructor(public appSettings:AppSettings,  public router:Router, public _apiService : ApiService, 
    private toastr: ToastrService, private http: HttpClient, public datepipe: DatePipe, private cdr: ChangeDetectorRef) {

    Object.assign(this, {single}); 

    let d = new Date();
    d.setDate(d.getDate()-30);

    let e = new Date();
    e.setDate(e.getDate()+30);

    this.fromDate = d;
    this.us_toDate = e;



    this.options = {
      allowClear: true,
      theme: 'classic',
      closeOnSelect: true,
      templateSelection: (object: any) => {
        return object && object.text ;
      },
      templateResult: (object: any) => {
        return object && object.text ;
      }
    };
  

    

   }

  ngOnInit(): void {

    this.loadUpcommingShipment();
    this.getCompanyWiseImport();
    this.getYearWiseImport("2021");
    this.loadAllProduct();
    this.item_search("2021", "2021", null)
    this.loadProductLcOpen();


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu : [10, 25, 50, 100],
      processing: true,
      ordering: null
    };

   

  }




  public loadUpcommingShipment() {

    let f = new Date(this.us_fromDate);
    let fDate =this.datepipe.transform(f, 'dd-MM-yyyy');
    let t = new Date(this.us_toDate);
    let tDate =this.datepipe.transform(t, 'dd-MM-yyyy');

    //http.get('http://192.168.61.210:8090/api/Dashboard/GetUpcomingShipmentJSON/' + fDate + '/' + tDate)
    this._apiService.getUpcommingShipment(fDate, tDate)
      .subscribe((data: Response) => {
        this.myData = data;
        
        this.isLoaded = true;
      });
  }





  public getCompanyWiseImport(){

    let promise = new Promise((resolve, reject) => {
     // let apiURL = 'http://192.168.61.210:8090/api/Dashboard/GetCountryWiseImport';
      this._apiService.getCountryWiseImport()
        .toPromise()
        .then(
          data => {
            let test = data as CompanyWiseImport[];
            for (let i = 0; i < Object.keys(data).length; i++) {
              
              this.data_for_graph[i] = 
                {
                  "name": test[i].SCUNTRY_NAME,
                  "value": test[i].LTRND_QNTY
                }
              
              
            }

            this.graphData = this.data_for_graph;
            
            
          }
        ).then(function(){
          
        })
    });

    return promise;

  }




  public getYearWiseImport(year){

    let promise = new Promise((resolve, reject) => {
     // let apiURL = 'http://192.168.61.210:8090/api/Dashboard/GetYearWiseImport/' + year;
      this._apiService.getYearWiseImport(year)
        .toPromise()
        .then(
          data => {
            let test = data as YearWiseImport[];
            for (let i = 0; i < Object.keys(data).length; i++) {
            
              this.data_for_bar_graph[i] = 
                {
                  "name": test[i].LITEM_NAME,
                  "value": test[i].LTRND_QNTY
                }
              
              
            }

            this.barGraphData = this.data_for_bar_graph;
            
            
          }
        ).then(function(){
          
        })
    });

    return promise;

  }



  public loadAllProduct() {

   
      let promise = new Promise((resolve, reject) => {
      //  let apiURL = 'http://192.168.61.210:8090/api/Dashboard/GetLCItem';
        this._apiService.getLoadAllProduct()
          .toPromise()
          .then(
            data => {
              let test = data as ProductList[];
              for (let i = 0; i < Object.keys(data).length; i++) {
               this.productList[i] = 
                {
                  "id": test[i].ITEMOID,
                  "text": test[i].LITEM_NAME
                }
                
                
              }
  
              this.finalProductList = this.productList;
              this.finalOidList = this.oidList;
              
              
              
            }
          ).then(function(){
            
          })
      });
  
      return promise;



  }


  public loadProductLcOpen() {

    // let f = new Date();
    // f.setDate(f.getDate()-30);
    // let t = new Date();

    let f = new Date(this.fromDate);
    let fDate =this.datepipe.transform(f, 'dd-MM-yyyy');
    let t = new Date(this.toDate);
    let tDate =this.datepipe.transform(t, 'dd-MM-yyyy');
    //http.get('http://192.168.61.210:8090/api/Dashboard/ProductLCOpen/' + fDate + '/' + tDate)
    this._apiService.getProductLcOpen(fDate, tDate)
      .subscribe((data: Response) => {
        this.productLcOpen = data;
        this.isLoadedProductLC = true;
      });
  }


  public onSelect(event) {
    console.log("ONE SELECT");
    console.log(event);
  }



  onInputChange(event: MatSliderChange) {
    this.p_year = event.value.toString();
    this.barGraphData = [];
    this.data_for_bar_graph = [];

  //  let apiURL = 'http://192.168.61.210:8090/api/Dashboard/GetYearWiseImport/' + event.value.toString();
    this._apiService.getYearWiseImport(event.value.toString())
      .toPromise()
      .then(
        data => {
          let test = data as YearWiseImport[];
          for (let i = 0; i < Object.keys(data).length; i++) {
          
            this.data_for_bar_graph[i] = 
              {
                "name": test[i].LITEM_NAME,
                "value": test[i].LTRND_QNTY
              }
            
            
          }

         
          this.barGraphData = this.data_for_bar_graph;
          
          
        }
      )




    
  }

  
  public search(fromDate, toDate){
    this.productLcOpen = [];
    this.isLoadedProductLC = false;
    let f = new Date(fromDate);
    let fDate =this.datepipe.transform(f, 'dd-MM-yyyy');
    let t = new Date(toDate);
    let tDate =this.datepipe.transform(t, 'dd-MM-yyyy');

    //this.http.get('http://192.168.61.210:8090/api/Dashboard/ProductLCOpen/' + fDate + '/' + tDate)
    this._apiService.getProductLcOpen(fDate, tDate)
      .subscribe((data: Response) => {
        this.productLcOpen = data;
        this.isLoadedProductLC = true;
      });
    

  }


  public us_search(fromDate, toDate){
    this.myData = [];
    this.isLoaded = false;
    let f = new Date(fromDate);
    let fDate =this.datepipe.transform(f, 'dd-MM-yyyy');
    let t = new Date(toDate);
    let tDate =this.datepipe.transform(t, 'dd-MM-yyyy');

    //this.http.get('http://192.168.61.210:8090/api/Dashboard/GetUpcomingShipmentJSON/' + fDate + '/' + tDate)
    this._apiService.getUpcommingShipment(fDate, tDate)
      .subscribe((data: Response) => {
        this.myData = data;
        this.isLoaded = true;
      });


   
    

  } 


  

  public item_search(fromYear, toYear, itemOID){
    
   if(this.checkValidity(fromYear, toYear)){
    let oid;
    if(itemOID == null){

       oid = 'null';

    }else {

       oid = itemOID;
    }

    this.yearlyImportTable = [];
    this.isLoadedYearlyImportTable = false;
    //this.http.get('http://192.168.61.210:8090/api/Dashboard/GetYearlyImport/' + fromYear + '/' + toYear + '/' + oid)
    this._apiService.getYearlyImport(fromYear, toYear, oid)
      .subscribe((data: Response) => {
        this.yearlyImportTable = data;
        this.isLoadedYearlyImportTable = true;
      });

   }

  }


  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public checkValidity(fromYear, toYear){

    if(fromYear == null){

      this.toastr.error('Please select from year', 'ERROR!');
      return false;

    }else if(toYear == null){
      this.toastr.error('Please select to year', 'ERROR!');
      return false;

    }else {

      return true;
    }

  }

}
