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

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.scss'],
  providers: [Conversion]
})
export class UserDashboardComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild('cmnpager', { static: false }) _pg: CommonPager;

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
}
