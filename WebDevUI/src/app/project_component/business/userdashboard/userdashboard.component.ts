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



export interface LandNode {
  name: string;
  deedQnty: number;
  totalLand: number;
  level: 'district' | 'thana' | 'mouza';
  expanded?: boolean;
  children?: LandNode[];
}


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
  landData: LandNode[] = [];
  landDatas1: LandNode[] = [];


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





  toggle(node: LandNode) {
    node.expanded = !node.expanded;
  }
  ngOnInit(): void {

    this.loadCategoryChart();
    this.loadDocumentProgressChart();
    this.getAllLandCategory();
    this.loadMutationChart();

    this.getareaWiseList()
    this.getDeedDashbord()




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








  public landCategoryId: string = '';
  public landCategoryList: any = [];
  public _getLandCategoryUrl: string = 'dropdown/getalllandcategories';
  getAllLandCategory() {
    debugger;
    const quantityMaps: any = { '1': 200, '2': 500, '3': 300, '4': 400, '5': 100, '6': 800, '7': 20 };
    var list: Array<{ id: string, text: string, quantity?: number }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
    var param = { strId: '' };
    var apiUrl = this._getLandCategoryUrl;
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;

        if (this.res.resdata.listLandCategories != '') {
          var itemList = this.res.resdata.listLandCategories;
          itemList.forEach(item => {
            list.push({ id: item.categoryId.toString(), text: item.categoryName, quantity: quantityMaps[item.categoryId] });
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



  public _getcAreaWiseLand: string = 'case/getdashbordbyarea';
  getareaWiseList() {
    debugger;
    var userId = '';
    var param = { strId: this.userID };
    var apiUrl = this._getcAreaWiseLand
    this._dataservice.getbyid(apiUrl, userId)
      .subscribe(response => {
        this.res = response;
        const caseList = JSON.parse(this.res.resdata.caseList);
        const dashboard = JSON.parse(caseList[0].DASHBOARD_JSON);
        this.landData = this.mapLandHierarchy(dashboard.landHierarchy);;
        console.log("this is low oe", this.landData)

      }, error => {
        console.log(error);
      });
  }












  hovered: any = null;
  private mapLandHierarchy(data: any[], level: string = 'district'): any[] {
    return data.map(item => {
      return {
        name: item.name,
        deedQnty: item.deedQnty,
        //totalLand: item.totalLand,
        totalLand: this._conversion.convertAjutansha(item.totalLand),
        level: level,
        expanded: false,
        children: item.children
          ? this.mapLandHierarchy(this.addLevel(item.children, level), this.nextLevel(level))
          : []
      };
    });
  }

  // optional helper to set intermediate level
  private addLevel(children: any[], parentLevel: string) {
    return children.map(c => ({
      ...c,
      level: this.nextLevel(parentLevel)
    }));
  }

  // define hierarchy levels
  private nextLevel(level: string): string {
    switch (level) {
      case 'district': return 'thana';
      case 'thana': return 'mouza';
      default: return 'mouza';
    }
  }












  public landByCatagory: any;
  public landByProject: any;
  public totalLands: any;
  public totalMortgageLand: any;
  public unRegisterLand: any;
  public totalKhajna: any;
  public totalMutation: any;
  public dashboards:any;
  public _getDeedDash: string = 'case/getdeeddashbord';
  getDeedDashbord() {
    debugger;
    var userId = '';
    var param = { strId: this.userID };
    var apiUrl = this._getDeedDash
    this._dataservice.getbyid(apiUrl, userId)
      .subscribe(response => {
        this.res = response;
        const dashList = JSON.parse(this.res.resdata.deedDashbordList);
        const dashboard = JSON.parse(dashList[0].DASHBOARD_JSON);
        this.dashboards=dashboard;
        this.landByProject=dashboard.landByProject;
        this.landByCatagory=dashboard.landByCatagory;
        this.totalLands=this._conversion.convertAjutansha(dashboard.totalLand.ttlland); 
        console.log("this.totalLands",this.totalLands)
        this.totalMortgageLand=this._conversion.convertAjutansha(dashboard.totalLand.mortgageLand); 
        this.unRegisterLand=dashboard.totalLand.unRegisterLand; 
        this.totalKhajna=dashboard.totalKhajna;
        this.totalMutation=dashboard.totalMutation;
        console.log("this is low dashboard", dashboard)
        this.loadLandByProjectChart();

      }, error => {
        console.log(error);
      });
  }



  // loadLandByProjectChart() {
  //   debugger

  //   if (!this.landByProject?.length) return;

  //   const canvas = document.getElementById('projectChart') as HTMLCanvasElement;
  //   console.log("total candvas sis ",canvas)

  //   if (!canvas) return;

  //   new Chart(canvas, {
  //     type: 'bar',
  //     data: {
  //       labels: this.landByProject.map(x => x.name),
  //       datasets: [
  //         {
  //           label: 'Total Land',
  //           data: this.landByProject.map(x => x.toalLand),
  //           backgroundColor: '#42A5F5'
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       legend: { display: false }
  //     }
  //   });
  // }




  

  loadLandByProjectChart() {
    debugger

    if (!this.landByProject?.length) return;

    const canvas = document.getElementById('projectChart') as HTMLCanvasElement;
    console.log("total candvas sis ",canvas)

    if (!canvas) return;

   new Chart(canvas, {
  type: 'bar',
  data: {
    labels: this.landByProject.map(x => x.name),
    datasets: [
      {
        label: 'জমি',
        data: this.landByProject.map(x => {
          const land = this._conversion.convertAjutansha(x.toalLand);
          return land.maxValue;
        }),
        backgroundColor: '#42A5F5'
      }
    ]
  },
  options: {
    responsive: true,
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {

          const project = this.landByProject[tooltipItem.index!];
          const land = this._conversion.convertAjutansha(project.toalLand);

          return [
            `জমি: ${land.maxValue} ${land.maxUnit}`,
            `দলিল: ${project.totalDeed}`
          ];
        }
      }
    }
  }
});
  }




























}
