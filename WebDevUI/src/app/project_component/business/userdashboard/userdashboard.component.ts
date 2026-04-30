import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
import { Options } from 'select2';
import { Subscription, interval } from 'rxjs';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.scss'],
  providers: [Conversion]
})
export class UserDashboardComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
  //npm install chart.js@2.9.4 ng2-charts@2.4.2 --save


  public settings: Settings;
  private userID = sessionStorage.getItem("userID");
  public cmnEntity: any = {};
  public resmessage: string;
  public IsShow: boolean = true;
  public res: any;
  public pageSize: number = 10;
  public today: string = '';
  public entryMenuList: any = [];
  public entryMenuId: string = 'T_LAND_DEED';
  public entryOperatorList: any = [];
  public entryOperatorId: string = '';
  public options: Options;
  private updateSubscription: Subscription;
  //public displayStart = 0;
  public isLoaded: Object = true;
  constructor(
    public appSettings: AppSettings,
    private _conversion: Conversion,
    private _dataservice: DataService,
    private _pathValidation: pathValidation,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: any) {
    this.settings = this.appSettings.settings;
    this._pathValidation.validate(this.document.location);
    this.cmnEntity = this._pathValidation.rowEntities();

    this.options = this._pathValidation.ngSelect2Option();

    this.today = _conversion.Today();
  }

  ngOnInit(): void {

// this.calculateTotalLand();
//  this.prepareChartData();


    this.loadCategoryChart();
    this.loadDocumentProgressChart();
    this.getAllLandCategory();
    this.loadMutationChart();











    debugger;
    //this.getAllDashboardMain();
    this.getEntryMenu();
    this.getOperatorById(this.entryMenuId);
    this.getAllUserActivity();

    this.updateSubscription = interval(300000).subscribe((val) => {
      this.getAllUserActivity()
    });
  }

  public listBgColor: any = ['indigo', 'green', 'amber', 'red'];

  getEntryMenu() {
    var list: Array<{ id, text }> = [{ id: null, text: "অনুগ্রহ করে নির্বাচন করুন" }];
    list.push({ id: 'T_LAND_DEED', text: 'দলিল দস্তাবেজ' });
    list.push({ id: 'T_SELLERS', text: 'দলিল দাতা' });
    list.push({ id: 'T_LAND_MUTATION', text: 'নামজারি তথ্য' });
    list.push({ id: 'T_KHAJNA_MUTATION_WISE', text: 'খাজনা প্রদা' });

    this.entryMenuList = list;
  }

  public _getEntryOperatorUrl: string = 'userDashboard/getallentryuserbytable';
  getOperatorById(tableid) {
    debugger;
    this.entryOperatorList = [];
    this.entryOperatorId = '';
    var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
    var param = { strId: tableid };
    var apiUrl = this._getEntryOperatorUrl;
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        debugger;
        this.res = response;
        if (this.res.resdata.listEntryUser != '') {
          var itemList = JSON.parse(this.res.resdata.listEntryUser);
          itemList.forEach(item => {
            list.push({ id: item.entryUserId, text: item.entryBy });
          });

          this.entryOperatorList = list;
        }
      }, error => {
        console.log(error);
      });
  }


  public allEntryCount: number = 0;
  public todaysEntryCount: number = 0;
  public allDocUpCount: number = 0;
  public todaysDocUpCount: number = 0;
  public ttlBgColor: string = '';

  public itTodayEntry: number = 0;
  public itTotalEntry: number = 0;
  public itTodayDocUp: number = 0;
  public itTotalDocUp: number = 0;
  public itBgColor: string = '';

  public landTodayEntry: number = 0;
  public landTotalEntry: number = 0;
  public landTodayDocUp: number = 0;
  public landTotalDocUp: number = 0;
  public landBgColor: string = '';

  public listUserActivity: any = [];
  public _getActivityUrl: string = 'userDashboard/getallentryuseractivity';
  getAllUserActivity() {
    debugger;
    this.listUserActivity = [];
    this.allEntryCount = 0;
    this.todaysEntryCount = 0;
    this.allDocUpCount = 0;
    this.todaysDocUpCount = 0;

    this.itTodayEntry = 0;
    this.itTotalEntry = 0;
    this.itTodayDocUp = 0;
    this.itTotalDocUp = 0;
    this.itBgColor = '';

    this.landTodayEntry = 0;
    this.landTotalEntry = 0;
    this.landTodayDocUp = 0;
    this.landTotalDocUp = 0;
    this.landBgColor = '';

    var param = { strId: this.entryMenuId == undefined || this.entryMenuId == null ? 'T_LAND_DEED' : this.entryMenuId, strId2: this.entryOperatorId == undefined || this.entryOperatorId == '' ? null : this.entryOperatorId, strId3: this.today == '' ? null : this.today };
    var apiUrl = this._getActivityUrl;
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        var count = 0;

        this.listUserActivity = [];
        this.allEntryCount = 0;
        this.todaysEntryCount = 0;
        this.allDocUpCount = 0;
        this.todaysDocUpCount = 0;

        this.itTodayEntry = 0;
        this.itTotalEntry = 0;
        this.itTodayDocUp = 0;
        this.itTotalDocUp = 0;
        this.itBgColor = '';

        this.landTodayEntry = 0;
        this.landTotalEntry = 0;
        this.landTodayDocUp = 0;
        this.landTotalDocUp = 0;
        this.landBgColor = '';

        if (this.res.resdata.listUserActivity != '') {
          var itemList = JSON.parse(this.res.resdata.listUserActivity);
          var itemLists = itemList.filter(x => x.entryUserId != '08776' && x.entryUserId != '06182');

          itemList.forEach(item => {
            debugger;
            if (item.isLand) {
              this.landTodayEntry += item.todaysEntry;
              this.landTotalEntry += item.totalEntry;

              this.landTodayDocUp += item.todaysDocUp;
              this.landTotalDocUp += item.totalDocUp;
            } else {
              this.itTodayEntry += item.todaysEntry;
              this.itTotalEntry += item.totalEntry;

              this.itTodayDocUp += item.todaysDocUp;
              this.itTotalDocUp += item.totalDocUp;
            }
          });

          itemLists.forEach(item => {
            debugger;
            if (count == 4) { count = 0 };
            item.bgColor = this.listBgColor[count];
            count++;
          });

          if (count == 4) { count = 0 };
          this.itBgColor = this.listBgColor[count];
          if (count == 4) { count = 0 };
          count = count + 1;
          if (count == 4) { count = 0 };
          this.landBgColor = this.listBgColor[count];
          if (count == 4) { count = 0 };
          count = count + 1;
          if (count == 4) { count = 0 };
          this.ttlBgColor = this.listBgColor[count];

          this.listUserActivity = itemLists;
          this.allEntryCount = this.listUserActivity[0].allEntryCount;
          this.todaysEntryCount = this.listUserActivity[0].todaysEntryCount;

          this.allDocUpCount = this.listUserActivity[0].allDocUpCount;
          this.todaysDocUpCount = this.listUserActivity[0].todaysDocUpCount;
        }
      }, error => {
        console.log(error);
      });
  }




  ////========================>>>>>>>>>>>===============START HERE ================================================
//   totalTax=50;
//   pendingTax=20;
//   typeBaseLandQnty=[
//     {type:'type1',qntaty:100},
//     {type:'type2',qntaty:500},
//     {type:'type3',qntaty:800},
//     {type:'type4',qntaty:10},
//     {type:'type5',qntaty:80},
//     {type:'type6',qntaty:300},
//     {type:'type7',qntaty:5000},
//   ]
//   landList=[
//     {landId:1,quantity:10},
//     {landId:2,quantity:20},
//     {landId:3,quantity:10},
//     {landId:4,quantity:110},

//   ]
//   public totalLandQuntaty:number=0;

// calculateTotalLand(){
//   this.totalLandQuntaty=this.landList.reduce((sum,item)=>sum+item.quantity,0);
//   console.log("this.totalLandQuntaty",this.typeBaseLandQnty)
// }




//   landData = [
//     { type: 'Agriculture', quantity: 50 },
//     { type: 'Residential', quantity: 20 },
//     { type: 'Commercial', quantity: 12 },
//     { type: 'business', quantity: 18 }
//   ];


//   public pieChartLabels: string[] = [];
//   public pieChartData: number[] = [];
//   public pieChartType = 'pie';
//   public pieChartOptions = {
//     responsive: true
//   };


//   prepareChartData(): void {
//     debugger
//     this.pieChartLabels = this.landData.map(item => item.type);
//     this.pieChartData = this.landData.map(item => item.quantity);
//   }



    public landCategoryId: string = '';
    public landCategoryList: any = [];
    public _getLandCategoryUrl: string = 'dropdown/getalllandcategories';
    getAllLandCategory() {
        debugger;
         const quantityMaps:any={'1':200,'2':500,'3':300,'4':400,'5':100,'6':800,'7':20};
        var list: Array<{ id:string, text:string,quantity?:number }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getLandCategoryUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
               
                if (this.res.resdata.listLandCategories != '') {
                    var itemList = this.res.resdata.listLandCategories;
                    itemList.forEach(item => {
                        list.push({ id: item.categoryId.toString(), text: item.categoryName,quantity:quantityMaps[item.categoryId] });
                    });

                    this.landCategoryList = list;
                     console.log(" this.landCategoryList", this.landCategoryList)
                     this.loadCategoryChart();
                }
            }, error => {
                console.log(error);
            });
    }

 totalLand = 5000; // acre

 loadCategoryChart() {

  const filteredList = this.landCategoryList.filter(x => x.id !== '');

  const labels = filteredList.map(item => item.text);
  const data = filteredList.map(item => item.quantity || 0);

  const backgroundColors = this.generateColors(filteredList.length);

  new Chart('categoryChart', {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

generateColors(count: number): string[] {
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    colors.push(
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );
  }

  return colors;
}


  // loadCategoryChart() {
  //   new Chart('categoryChart', {
  //     type: 'pie',
  //     data: {
  //       labels: ['Agriculture', 'Economic Zone', 'Residential', 'Others'],
  //       datasets: [{
  //         data: [500, 300, 200, 100],
  //         backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0']
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       legend: {
  //         position: 'bottom'
  //       }
  //     }
  //   });
  // }

  loadDocumentProgressChart() {
    new Chart('documentChart', {
      type: 'doughnut',
      data: {
        labels: [
          'Agriculture (20%)',
          'Economic Zone (10%)',
          'Other (20%)',
          'No Document (40%)'
        ],
        datasets: [{
          data: [20, 10, 20, 40],
          backgroundColor: [
            '#4CAF50',
            '#03A9F4',
            '#FFC107',
            '#f10808'
          ]
        }]
      },
      options: {
        responsive: true,
        cutoutPercentage: 60,
        legend: {
          position: 'bottom'
        }
      }
    });
  }


  mutationData = [
    { type: 'Agriculture', quantity: 200 },
    { type: 'Economic Zone', quantity: 100 },
    { type: 'Residential', quantity: 150 },
    { type: 'Industrial', quantity: 90 },
    { type: 'Commercial', quantity: 120 },
    { type: 'Forest', quantity: 80 },
    { type: 'Water Body', quantity: 60 }
  ];

    loadMutationChart() {
    new Chart('mutationChart', {
      type: 'bar',
      data: {
        labels: this.mutationData.map(m => m.type),
        datasets: [{
          label: 'Land (Acre)',
          data: this.mutationData.map(m => m.quantity),
          backgroundColor: '#42A5F5'
        }]
      },
      options: {
        responsive: true,
        legend: { display: false },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Acre'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Mutation Type'
            }
          }]
        }
      }
    });
  }


  //========================>>>>>>>>>>>===============END HERE ================================================
























}
