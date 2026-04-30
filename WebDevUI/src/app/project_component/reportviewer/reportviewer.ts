import { Component, OnInit, ViewChild } from '@angular/core';
import { Conversion } from '../../api/api.conversion.service';
import { DataService } from '../../api/api.dataservice.service';
import { CommonService } from '../../theme/components/commonservice/commonservice.component';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { ReportModel } from './reportmodel';
declare var $: any;

@Component({
    selector: 'reportviewer',
    templateUrl: './reportviewer.html',
    styleUrls: ['./reportviewer.scss'],
    providers: [Conversion]
})

export class ReportViewer implements OnInit {
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    private trustedUrl: any;
    private trustedUrls: any;
    private settings: Settings;
    private VSVersion:string='22';

    constructor(
        private _conversion: Conversion,
        private _dataservice: DataService,
        private appSettings: AppSettings) {
        this.settings = this.appSettings.settings;
    }

    ngOnInit(): void {

    }

    public rptModel = new ReportModel('', '');
    public isOn: boolean = false;
    private baseDocType: string = 'pdf';
    private rptType: string = 'pdf';
    private rptUrl: string = '';
    private rptModelArray: any = [];
    private isDownload: boolean = false;

    private reportTypeList19: any = [{ rndrType: 'pdf', display: 'PDF', icon: '', color: '' }, { rndrType: 'xls', display: 'Excel', icon: '', color: '' }, { rndrType: 'doc', display: 'Word', icon: '', color: '' }];
    private reportTypeList22: any = [{ rndrType: 'pdf', display: 'PDF', icon: '', color: '' }, { rndrType: 'xls', display: 'Excel', icon: '', color: '' }, { rndrType: 'doc', display: 'Word', icon: '', color: '' }];
    private reportTypeListName:string='reportTypeList'+this.VSVersion;
    private reportTypeList: any = this[this.reportTypeListName];
    setReportType() {
        this.reportInPageChange(this.rptUrl, this.rptModelArray);
    }    

    reportInPage(reportUrl: string, modelArray: any[]) {
        this.rptType = this.baseDocType;
        this.rptUrl = reportUrl;
        this.rptModelArray = modelArray;
        this.isDownload = false;
        this.reportInPages(reportUrl, modelArray);
    }

    reportInPageChange(reportUrl, modelArray) {
        if (this.rptType != 'pdf')
            this.reportInPages(reportUrl, modelArray);
    }

    reportInPages(reportUrl: string, modelArray: any[]) {
        this.settings.loadingSpinnerOnAction = true;
        this.rptModel.reportType = this._conversion.mimeData('renderType', this.rptType, this.VSVersion);
        var ModelsArray = []; ModelsArray.push(this.rptModel);
        if (modelArray.length > 0) { modelArray.forEach((model) => { ModelsArray.push(model); }); }
        var apiUrl = reportUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(
                (response) => {
                    debugger;
                    var res = response.resdata;
                    if (res.resstate) {
                        this.trustedUrls = undefined;
                        this.isOn = true;
                        this.isDownload = !this._conversion.sanitizeViewClose(this.rptType, this.VSVersion) ? true : false;
                        if (this.isDownload) {
                            this.trustedUrls = this._conversion.openSanitizedReport(res.bytes, this.rptType, this.VSVersion);
                            setTimeout(() => { this.isDownload = false; }, 100);
                        }
                        else {
                            this.trustedUrl = undefined;
                            this.trustedUrl = this._conversion.openSanitizedReport(res.bytes, this.rptType, this.VSVersion);
                        }

                        //setTimeout(() => { this.isOn = this._conversion.sanitizeViewClose(this.rptModel.reportType); }, 100);
                    }
                    else {
                        this._msg.warning('No data found!!!');
                    }

                    this.settings.loadingSpinnerOnAction = false;
                }, error => {
                    console.log(error);
                });
    }

    reportOutPage(reportUrl: string, modelArray: any[], IsModal:boolean) {
        this.settings.loadingSpinnerOnAction = true;
        this.rptModel.reportType = this._conversion.mimeData('renderType', this.rptType, this.VSVersion);
        var ModelsArray = [];
        ModelsArray.push(this.rptModel);
        if (modelArray.length > 0) {
            modelArray.forEach((model) => {
                ModelsArray.push(model);
            });
        }

        var apiUrl = reportUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(
                (response) => {
                    debugger;
                    var res = response.resdata;
                    this.isOn = false;
                    this.trustedUrl = undefined;
                    if (res.resstate) {
                        var fileName = this.rptModel.reportName + '_' + this._conversion.TodayWithHourMinuteSecondMiliseconds();;
                        this._conversion.openReport(res.bytes, this.rptType, fileName, this.VSVersion, IsModal);
                    }
                    else {
                        this._msg.warning('No data found!!!');
                    }

                    this.settings.loadingSpinnerOnAction = false;
                }, error => {
                    console.log(error);
                });
    }
}
