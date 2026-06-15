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
  toolTotalLand = 1;
toolMortgageLand = 2;
toolUnRegisterLand = 3;
hovered: number | null = null;


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
    this.getareaWiseList()
    this.getDeedDashbord()
  }

  



  //public _getcAreaWiseLand: string = 'case/getdashbordbyarea';
  public _getcAreaWiseLand: string = 'landdashboard/getdeeddashbordbyarea';
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

      }, error => {
        console.log(error);
      });
  }





  
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
  public KhajnaByFinancialYear:any;
  public _getDeedDash: string = 'landdashboard/getdeeddashbord';
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
        this.totalMortgageLand=this._conversion.convertAjutansha(dashboard.totalLand.mortgageLand); 
        this.unRegisterLand=this._conversion.convertAjutansha(dashboard.totalLand.unRegisterLand); 
        this.totalKhajna=dashboard.totalKhajna;
        this.KhajnaByFinancialYear=dashboard.totalKhajnaByFinancialYear;
        this.totalMutation=dashboard.totalMutation;
        console.log("this is low dashboard", dashboard)
        this.loadLandByProjectChart();
        this.loadLandByCatagoryChart();
        this.loadCasePriorityChart()
        this.loadMutationChart();
        this.khajnaByFinancialYear()

      }, error => {
        console.log(error);
      });
  }



  

  loadLandByProjectChart() {
    debugger
    if (!this.landByProject?.length) return;
    const canvas = document.getElementById('projectChart') as HTMLCanvasElement;
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



 loadLandByCatagoryChart() {
    debugger

    if (!this.landByCatagory?.length) return;

    const canvas = document.getElementById('catagoryChart') as HTMLCanvasElement;

    if (!canvas) return;

   new Chart(canvas, {
  type: 'bar',
  data: {
    labels: this.landByCatagory.map(x => x.name),
    datasets: [
      {
        label: 'জমি',
        data: this.landByCatagory.map(x => {
          const land = this._conversion.convertAjutansha(x.toalLand);
          return land.maxValue;
        }),
        backgroundColor: '#4CAF50'
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

          const project = this.landByCatagory[tooltipItem.index!];
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




  
  loadCasePriorityChart() {

    if (!this.totalKhajna || this.totalKhajna.length === 0) {
      return;
    }

    new Chart('khajnaChart', {
      type: 'doughnut',
      data: {
        labels: this.totalKhajna.map(x => `${x.khajnaStatus =='1'?'পরিশোধিত':'বকেয়া'} `),
        datasets: [
          {
            data: this.totalKhajna.map(x => x.totalCount
),
            backgroundColor: [
              '#4CAF50',
               '#f10808',
              '#03A9F4',
              '#FFC107',
              '#9C27B0',
              '#FF5722'
            ]
          }
        ]
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








  public mutationArData: any;

loadMutationChart() {

  this.mutationArData = [
    {
      name: 'mutation',
      Deed: this.totalMutation.mutationdeed,
      land: this.totalMutation.mutationLand
    },
    {
      name: 'unMutation',
      Deed: this.totalMutation.unMutationDeed,
      land: this.totalMutation.unMutationLand
    }
  ];

  // Convert land data
  const chartData = this.mutationArData.map(x => {
    const landInfo = this._conversion.convertAjutansha(x.land);

    return {
      ...x,
      maxValue: landInfo.maxValue,
      maxUnit: landInfo.maxUnit
    };
  });

  console.log("chartData", chartData);

  if (!chartData || chartData.length === 0) {
    return;
  }

  new Chart('mutationChart', {
    type: 'pie',
    data: {
      labels: chartData.map(x =>
        x.name === 'mutation' ? 'নামজারি হয়েছে' : 'নামজারি হয় নাই'
      ),
      datasets: [
        {
          // Pie chart value
          data: chartData.map(x => x.maxValue),

          backgroundColor: [
            '#4CAF50',
            '#f10808'
          ]
        }
      ]
    },
    options: {
      responsive: true,
      legend: {
        position: 'bottom'
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem: any, data: any) => {

            const item = chartData[tooltipItem.index];

            return [
              `${item.name === 'mutation' ? 'নামজারি হয়েছে' : 'নামজারি হয় নাই'}`,
              `জমি: ${item.maxValue} ${item.maxUnit}`,
              `দলিল: ${item.Deed}`
            ];
          }
        }
      } 
    }
  });
}





  khajnaByFinancialYear() {
    debugger

    if (!this.KhajnaByFinancialYear?.length) return;

    const canvas = document.getElementById('financialYearChart') as HTMLCanvasElement;
    console.log("total candvas sis ",canvas)

    if (!canvas) return;

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.KhajnaByFinancialYear.map(x => x.financialYear),
        datasets: [
          {
            label: 'খাজনা',
            data: this.KhajnaByFinancialYear.map(x => x.totalCount),
            //backgroundColor: '#42A5F5'
             backgroundColor: [
          '#4CAF50', // Green
          '#2196F3', // Blue
          '#FF9800', // Orange
          '#9C27B0', // Purple
          '#F44336', // Red
          '#009688', // Teal
          '#795548', // Brown
          '#607D8B'  // Blue Grey
        ]
          }
        ]
      },
      options: {
        responsive: true,
        legend: { display: false }
      }
    });
  }










}
