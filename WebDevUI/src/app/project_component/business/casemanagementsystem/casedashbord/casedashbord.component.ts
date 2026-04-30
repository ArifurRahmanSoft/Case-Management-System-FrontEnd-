import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../../api/api.conversion.service';
//import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../../api/api.pathvlidation.service';
import { CommonService } from '../../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../../theme/components/commonpager/commonpager';
import { Options } from 'select2';
import { Subscription, interval } from 'rxjs';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { Chart } from 'chart.js';
import { DataService } from '../../../../api/api.dataservice.service';


@Component({
  selector: 'app-casedashbord',
  templateUrl: './casedashbord.component.html',
  styleUrls: ['./casedashbord.component.scss'],
  providers: [Conversion]
})
export class CaseDashbordComponent implements OnInit {
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
    this.getCaseDahbord();
    this.loadCompanyChart();
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












  public _getcaseDash: string = 'case/getcasedashbord';
  public caeCompany: any;
  public casePriorty: any;
  public caserecentHearingList: any;
  public caseStatus: any
  public totalActiveCase: number = 0;
  public totalResolvedCase: number = 0;
  public totalCompany: number = 0;
  public caseurgentPriorty: number = 0;
  getCaseDahbord() {
    debugger;
    var userId = '08427';
    var param = { strId: this.userID };
    var apiUrl = this._getcaseDash
    this._dataservice.getbyid(apiUrl, userId)
      .subscribe(response => {
        this.res = response;
        const caseList = JSON.parse(this.res.resdata.caseList);
        const dashboard = JSON.parse(caseList[0].DASHBOARD_JSON);
        this.caseStatus = dashboard.status
        this.caeCompany = dashboard.company
        this.casePriorty = dashboard.priority
        this.caserecentHearingList = dashboard.recent_hearings
        const active = this.caseStatus.find(x => x.name === 'চলমান');
        this.totalActiveCase = active ? active.total : 0;
        const urgentCase = this.casePriorty.find(x => x.name === 'উচ্চ ঝুঁকি');
        this.caseurgentPriorty = urgentCase ? urgentCase.total : 0;
        const resolved = this.caseStatus.find(x => x.name === 'স্থগিত');
        this.totalResolvedCase = resolved ? resolved.total : 0;


        this.totalCompany = this.caeCompany.length;

        console.log(" this.res---------------------", this.caeCompany, this.casePriorty, this.caserecentHearingList, this.caseStatus)
        setTimeout(() => {
          this.loadCompanyChart();
          this.loadCasePriorityChart()
        }, 0);
      }, error => {
        console.log(error);
      });
  }






  loadCompanyChart() {

    if (!this.caeCompany?.length) return;

    const canvas = document.getElementById('companyChart') as HTMLCanvasElement;

    if (!canvas) return;

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.caeCompany.map(x => x.name),
        datasets: [
          {
            label: 'Total Cases',
            data: this.caeCompany.map(x => x.total),
            backgroundColor: '#42A5F5'
          }
        ]
      },
      options: {
        responsive: true,
        legend: { display: false }
      }
    });
  }


  loadCasePriorityChart() {

    if (!this.casePriorty || this.casePriorty.length === 0) {
      return;
    }

    new Chart('documentChart', {
      type: 'doughnut',
      data: {
        labels: this.casePriorty.map(x => `${x.name} (${x.total})`),
        datasets: [
          {
            data: this.casePriorty.map(x => x.total),
            backgroundColor: [
              '#4CAF50',
              '#03A9F4',
              '#FFC107',
              '#f10808',
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
  //========================>>>>>>>>>>>===============END HERE ================================================
























}
