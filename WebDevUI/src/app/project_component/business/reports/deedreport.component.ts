import { Component, OnInit, Inject, ViewChild, NgZone, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Options } from 'select2';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
import { ReportViewer } from '../../reportviewer/reportviewer';
import { ReportModel } from '../../reportviewer/reportmodel';
import * as signalR from '@microsoft/signalr';
import { Subject, fromEvent } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { LifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
declare var $: any;

@Component({
    selector: 'app-deedreport',
    templateUrl: './deedreport.component.html',
    styleUrls: ['./deedreport.component.scss'],
    providers: [Conversion]
})



export class DeedReportComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
    @ViewChild('dtPg', { static: false }) _dtPg: Element;
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild(ReportViewer) _rptViewer: ReportViewer;
    private userID = sessionStorage.getItem("userID");
    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    public pageSize: number = 10;
    public dynamicParam: any;
    public dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject<any>();
    //public displayStart = 0;
    public isLoaded: Object = true;
    public options: Options;
    public workerLoanForm: FormGroup;

    //Search Parameter
    public comId: string = 'TExx00000001';
    public comCode: string = 'CBTE';
    public wBookId: string = '';
    public empId: string = '';
    public dtFrom: string = '';
    //Search Parameter
    public srcQuery: string = '';

    public isPage: boolean = false;

    constructor(
        public _conversion: Conversion,
        private _dataservice: DataService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private _zone: NgZone,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        this.options = this._pathValidation.ngSelect2Option();
        //this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: true }]);
    }

    ngOnInit(): void {
        this.getAllDistrict();
        this.getAllOwner();
        this.getAllSeller();
        //this.getDataByPage();
    }


    gDtParamCal: any = { dtParam: undefined, callback: undefined };
    public _listByPageUrls: string = 'deed/getbypage';
    getDataByPage() {
        this.dtOptions = {
            searching: false,
            ordering: false,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            info: true,
            displayStart: 0,
            paging: true,
            pagingType: 'first_last_numbers',
            pageLength: this.pageSize,
            serverSide: true,
            processing: true,
            dom: 'rtp',
            ajax: (dtParam: any, callback) => {

                var dtEl: any = this.dtElement;
                if (dtEl.dt != undefined) {
                    var pinfo = dtEl.dt.page.info();
                    if (isNaN(dtParam.start) || dtParam.start > pinfo.recordsTotal) {
                        var pn = Math.floor(pinfo.recordsTotal / this.pageSize);
                        dtParam.start = pn * this.pageSize;
                    }
                }

                this.gDtParamCal.dtParam = dtParam;
                this.gDtParamCal.callback = callback;
                var pgNumber = 1;
                pgNumber = (dtParam.start + dtParam.length) / dtParam.length;
                this.gDtParamCal.dtParam.start = 0;
                this.gDtParamCal.dtParam.draw = 0;
                dtParam.draw = 0;

                var apiUrl = this._listByPageUrls;
                var param = { pageSize: this.pageSize, pageNumber: pgNumber, strId: '', strId2: '', strId3: '', strId4: '', };
                var ModelsArray = [param];
                this._dataservice.getWithMultipleModel(apiUrl, ModelsArray).subscribe(resp => {
                    this.deedList = JSON.parse(resp.resdata.listDeed);
                    var recordTtl: number = this.deedList[0].recordsTotal;
                    callback({
                        recordsTotal: recordTtl,
                        recordsFiltered: this.deedList,
                        data: ''
                    });
                });
            },
            columns: [{ data: 'deedNo' }, { data: 'deedDate' }, { data: 'districtName' }, { data: 'thanaName' }, { data: 'mouzaName' }, { data: 'isPosted' }],
        }
    }

    getDtData() {
        debugger
        var dpage: any = this.dtElement;
        dpage.dt.page(0);
        var dlen = dpage.dt.page.info();
        dpage.dtOptions.ajax(this.gDtParamCal.dtParam, this.gDtParamCal.callback);
    }




    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    showHide() {

    }

    public deedDoc: any = {
        deedNo: '',//
        deedDate: '',
        deedNoVia: '',
        caseNo: '',

        receiverId: '',
        senderId: '',

        districtId: '',//
        thanaId: '',//
        mouzaId: '',//

        khatianCS: '',
        khatianSA: '',
        khatianDR: '',
        khatianRS: '',
        khatianBS: '',

        dagCS: '',
        dagSA: '',
        dagDR: '',
        dagRS: '',
        dagBS: '',

        mutationKhatianNo: '',
        mutationJotNo: '',

        isPosted: false
    };

    reset() {
        this.deedDoc = {
            deedNo: '',//
            deedDate: '',
            deedNoVia: '',
            caseNo: '',

            receiverId: '',
            senderId: '',

            districtId: '',//
            thanaId: '',//
            mouzaId: '',//

            khatianCS: '',
            khatianSA: '',
            khatianDR: '',
            khatianRS: '',
            khatianBS: '',

            dagCS: '',
            dagSA: '',
            dagDR: '',
            dagRS: '',
            dagBS: '',

            mutationKhatianNo: '',
            mutationJotNo: '',

            isPosted: false
        };

        this.srcQuery = '';
        this.isShow = false;

        this.searchVal = '';
        this.thanaList = [];
        this.mouzaList = [];
    }

    public isShow: boolean = false;

    //Filter Master List
    public searchVal: string = '';
    //Get District
    public districtList: any = [];
    public _getDistrictUrl: string = 'dropdown/getalldistrictsrc';
    getAllDistrict() {
        var list: Array<{ id, divisionId, text, nameEn }> = [{ id: '', divisionId: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: '' };
        var apiUrl = this._getDistrictUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listDistricts != '') {
                    var itemList = JSON.parse(this.res.resdata.listDistricts);
                    itemList.forEach(item => {
                        list.push({ id: item.id.toString(), divisionId: item.divisionId, text: item.nameBn, nameEn: item.name_En });
                    });

                    this.districtList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get District

    //Get Thana    
    public thanaList: any = [];
    public _getThanaUrl: string = 'dropdown/getthanabyidsrc';
    getThanaById(districtsId) {
        //if(districtsId==''){
        this.deedDoc.thanaId = '';
        this.thanaList = [];
        this.deedDoc.mouzaId = '';
        this.mouzaList = [];
        //}

        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: districtsId };
        var apiUrl = this._getThanaUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listThanas != '') {
                    var itemList = JSON.parse(this.res.resdata.listThanas);
                    itemList.forEach(item => {
                        list.push({ id: item.id.toString(), text: item.nameBn, nameEn: item.nameEn });
                    });

                    this.thanaList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Thanas

    //Get Mouzas
    public mouzaList: any = [];
    public _getMouzaUrl: string = 'dropdown/getmouzabyidsrc';
    getMouzaById(thanasId) {
        this.deedDoc.mouzaId = '';
        this.mouzaList = [];
        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: thanasId };
        var apiUrl = this._getMouzaUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listMouza != '') {
                    var itemList = JSON.parse(this.res.resdata.listMouza);
                    itemList.forEach(item => {
                        list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
                    });

                    this.mouzaList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Mouzas

    //Get All Receiver
    public ownerList: any = [];
    public _getOwnerUrl: string = 'dropdown/getallownersrc';
    getAllOwner() {
        debugger;
        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: '' };
        var apiUrl = this._getOwnerUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listOwner != '') {
                    var itemList = JSON.parse(this.res.resdata.listOwner);
                    itemList.forEach(item => {
                        list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
                    });

                    this.ownerList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get All Receiver

    //Get All Sender
    public sellerList: any = [];
    public _getSellerUrl: string = 'dropdown/getallsellersrc';
    getAllSeller() {
        debugger;
        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: '' };
        var apiUrl = this._getSellerUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listSeller != '') {
                    var itemList = JSON.parse(this.res.resdata.listSeller);

                    itemList.forEach(item => {
                        var gong = item.isGong == '1' ? ' গং' : '';
                        list.push({ id: item.id, text: item.nameBn + gong, nameEn: item.nameEn });
                    });

                    this.sellerList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get All Sender
    public ttlPurLand: string = '';
    public ttlMutLand: string = '';
    public responseTag: string = 'listDeed';
    public deedList: any = [];
    public _listByPageUrl: string = 'deedreport/getbypage';
    getListByPage(pageSize, isPaging) {
        this.srcQuery = JSON.stringify(this.deedDoc);
        this.isPage = isPaging;
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);

            // setTimeout(() => {
            //     //this._zone.run(() => {
            //         var purThous = 0;
            //         var mutThous = 0;
            //         if (this.deedList.length > 0) {
            //             this.deedList.forEach(item => {
            //                 purThous += item.purchasedLand == null || item.purchasedLand == '' ? 0 : parseInt(item.purchasedLand);
            //                 mutThous += item.mutatedLand == null || item.mutatedLand == '' ? 0 : parseInt(item.mutatedLand);

            //                 item.purchasedLandUnit = item.purchasedLand > 0 ? this._conversion.getLandUnits(item.purchasedLand).fullUnit : '';
            //                 item.mutatedLandUnit = item.mutatedLand > 0 ? this._conversion.getLandUnits(item.mutatedLand).fullUnit : '';
            //             });

            //             this.ttlPurLand = this._conversion.getLandUnits(purThous).fullUnit;
            //             this.ttlMutLand = this._conversion.getLandUnits(mutThous).fullUnit;
            //         }
            //     //});

            // }, 1000);

        }, 0);

    }
    //Filter Master List

    public _getSingleReportUrl: string = 'reportviewer/getdeedreportbyid';
    loadSingleReportOut(deedId) {
        var isModale = true;
        var repFile = 'rptDeed.rdlc';
        var rmodel = { reportPath: '/reportfile/business/deed/' + repFile, reportName: 'দলিলের তথ্য' };
        this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
        var param = { pageNumber: this._pg.pageNumber, pageSize: this.pageSize, isPage: this.isPage, strId: deedId };
        var ModelsArray = [param];
        this._rptViewer.reportOutPage(this._getSingleReportUrl, ModelsArray, isModale);

    }
    //Report Execution
    public _getReportUrl: string = 'deedreport/getdeedreport';
    loadReportOut() {
        this.srcQuery = JSON.stringify(this.deedDoc);
        var isModal = false;
        var repFile = 'rptDeedReport.rdlc';
        var rmodel = { reportPath: '/reportfile/business/deed/' + repFile, reportName: 'Test Report' };
        this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
        var param = { pageNumber: this._pg.pageNumber, pageSize: this.pageSize, isPage: this.isPage, id: 0, Query: this.srcQuery };
        var ModelsArray = [param];
        this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray, isModal);
    }

    // loadReportIn() {
    //     this.srcQuery='['+JSON.stringify(this.deedDoc.value)+']';
    //     var repFile = 'rptDeedReport.rdlc';
    //     var rmodel = { reportPath: '/reportfile/business/deed/' + repFile, reportName: 'Test Report' };
    //     setTimeout(() => {
    //         this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
    //         var param = { pageNumber: 0, pageSize: 100, IsPaging: true, id: 0 };
    //         var ModelsArray = [param];
    //         this._rptViewer.reportInPage(this._getReportUrl, ModelsArray);
    //     }, 0);
    // }
    //Report Execution
    public modalEntity: any;
    @ViewChild('modalGmap') _modalGMap: TemplateRef<any>;
    private _gMapDialogRef: MatDialogRef<TemplateRef<any>>;
    loadModal = (item) => {
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '70%';
        //_config.panelClass = 'modalTopPosition';
        debugger;
        this._gMapDialogRef = this.dialog.open(this._modalGMap, _config);

        this.modalEntity = item;

        this.gMapLoad(item);

        this._gMapDialogRef.afterClosed().subscribe(result => {
        });
    }

    gMapLoad(item): void {
        setTimeout(() => {
            var lat = item.latitude;
            var lon = item.longitude;
            $("#_gapiloc").html("<iframe id='ifrm' src=\"https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=" + lat + ',' + lon + "&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed\" height=\"500\" style='width:100%' ></iframe>");
        });
    }

    public mouzaMapVpath: string = '';
    mouzaLoad(item) {
        this.scale = 100;
        this.top = 0;
        this.left = 0;
        this.mouzaMapVpath = item.mouzaMap == null ? '' : item.mouzaMap;
    }

    scale = 100;
    top = 0;
    left = 0;

    @ViewChild("image", { static: false }) image: ElementRef<HTMLImageElement>;

    ngAfterViewInit(): void {
        fromEvent(window, "wheel").subscribe((ev: WheelEvent) => {
            const newScale = this.scale - ev.deltaY * 0.2;
            this.scale = Math.max(newScale, 100);
            this.top = ev.clientY - this.scale / 2;
            this.left = ev.clientX - this.scale / 2;
        });
    }

    loadGMapOnNewTab(item) {
        var lat = item.latitude;
        var lon = item.longitude;

        // //var nUrl = "https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=" + lat + ',' + lon + "&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed";
        // $("#_gapilocs").html("<iframe id='ifrm' src=\"https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=" + lat + ',' + lon + "&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed\" height=\"500\" style='width:100%' ></iframe>");

        // var content = document.getElementById('_gapilocs').innerHTML;
        // var mywindow = window.open('');
        // mywindow.document.write('<html><head><title></title>');
        // mywindow.document.write('</head><body>');
        // mywindow.document.write(content);
        // mywindow.document.write('</body> <br/><br/>');
        // mywindow.document.write('<footer> <font color="green">Powered By:</font><font color="blue"> IT, City Group </font></footer>');
        // mywindow.document.write('</html>');


        // mywindow.document.close();
        // mywindow.focus();
        // mywindow.open();
        // //mywindow.close();
        // // window.open(nUrl, '_blank');
        var nurl = "http://maps.google.com/?q=" + lat + "," + lon;
        window.open(nurl, '_blank');
    }
}
