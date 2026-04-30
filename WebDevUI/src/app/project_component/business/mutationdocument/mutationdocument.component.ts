import { Component, OnInit, Inject, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
import { Options } from 'select2';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ReportViewer } from '../../reportviewer/reportviewer';
import { ReportModel } from '../../reportviewer/reportmodel';
import { BDDate } from '../../../api/api.bddate.service';
declare var $: any;

@Component({
    selector: 'app-mutationdocument',
    templateUrl: './mutationdocument.component.html',
    styleUrls: ['./mutationdocument.component.scss'],
    providers: [Conversion, BDDate]
})

export class MutationDocumentComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
    @ViewChild('cmnpagerTop', { static: false }) _pgTop: CommonPager;
    @ViewChild('fileInput') _fileInput: ElementRef;
    @ViewChild('thanaState', { static: false }) _thanaState: ElementRef;
    @ViewChild('mouzaState', { static: false }) _mouzaState: ElementRef;
    @ViewChild('deedStat', { static: false }) _deedStat: ElementRef;
    @ViewChild(ReportViewer) _rptViewer: ReportViewer;
    private userID = sessionStorage.getItem("userID");
    public loggedInfo = JSON.parse(sessionStorage.loggedUser);
    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    public pageSize: number = 15;
    //public displayStart = 0;
    public isLoaded: Object = true;
    public mutationDocForm: FormGroup;
    public options: Options;
    public optionMulti: Options;
    //public dagCs: string = '';
    // public optionbn: Options;
    // public optioncustom: Options;
    //public roleIds: [];    
    constructor(
        private _conversion: Conversion,
        private _bddate: BDDate,
        private _dataservice: DataService,
        public dialog: MatDialog,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        this.options = this._pathValidation.ngSelect2Option();
        this.optionMulti = this._pathValidation.ngSelect2MultiOption();
        // this.optionbn = this.ngSelect2OptionSelf();
        // this.optioncustom = this.ngSelect2OptionSelf2();
        //this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: true }]);
    }

    ngOnInit(): void {
        this.createForm();
        // this.getAllOwner();
        // this.getAllSeller();
        this.getYearList();
        this.getAllDistrict();
        this.getAllDistricts();
        this.getInitThanaById('1');
        this.getAllServey();
        this.getAllLandClass();
        // this.getAllLandDeed();
        //this.getInitRegistryOfficeById('1');
        $('#mutationName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.mutationDocForm = this.formBuilder.group({
            mutationId: new FormControl(null),
            khatianNo: new FormControl(null, Validators.required),
            jotNo: new FormControl(null, Validators.required),
            caseNo: new FormControl(null),
            mutationDate: new FormControl(this._conversion.Today(), Validators.required),

            serveyId: new FormControl(null),

            districtId: new FormControl('1'),
            thanaId: new FormControl(null),
            mouzaId: new FormControl(null),

            dagNos: new FormControl(null),
            deedIds: new FormControl(null),
            deedNos: new FormControl(null),
            classIds: new FormControl(null),
            landClass: new FormControl(null),

            totalLand: new FormControl(null),
            dcrFee: new FormControl(null),
            totalDue: new FormControl(null),
            paymentUnit: new FormControl(null),

            lastPayDate: new FormControl(this._conversion.Today()),
            lastPayDateBN: new FormControl(null),
            lastPayMonthBN: new FormControl(null),
            lastPayDateStrBN: new FormControl(null),

            basePath: new FormControl(this.cmnEntity.menuPath),
            docPath: new FormControl(null),
            docVpath: new FormControl(null),
            isActive: new FormControl(true)
        });

        this.getBDDate();
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listMutation';
    public mutationList: any = [];
    public _listByPageUrl: string = 'mutation/getbypage';
    getListByPage(pageSize) {
        debugger
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);
        }, 0);
    }

    public searchVal: string = '';
    getListByPages(pageSize) {
        debugger
        this.searchVal = this._pgTop.searchVal;
        this.getListByPage(pageSize);
    }

    public _saveUrl: string = 'mutation/saveupdateform';
    onSubmit() {

        if (this.mutationDocForm.invalid) {
            return;
        }

        this.mutationDocForm.controls.lastPayDateBN.setValue(this.fullbddate.dateBDEn);
        this.mutationDocForm.controls.lastPayMonthBN.setValue(this.fullbddate.month);
        this.mutationDocForm.controls.lastPayDateStrBN.setValue(this.fullbddate.fullDateBD);

        var formData = new FormData();
        if (this.documentList.length > 0) {
            this.documentList.forEach(item => {
                formData.append('docFile', item.attachedfile);
            });
        }

        this.setMutationDagList();
        this.setDeedList();
        this.setLandClassList();

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.mutationDocForm.value, this.landDeedIdList, this.landClassIdList, this.mutationDagList,];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModelForm(apiUrl, ModelsArray, formData)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.getListByPage(this.pageSize);
                    this._msg.success(this.resmessage);
                    this.reset();
                    //this.loadReportOut(this.res.resdata.result);
                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }

    mutationDagList: any = [];
    setMutationDagList() {
        debugger;
        var formValue = this.mutationDocForm.value;
        this.mutationDagList = [];
        if (formValue.dagNos != null && formValue.dagNos.length > 0) {
            var mutationDagNo = this._conversion.removeSpChars(formValue.dagNos);
            var mutationDagNoList = mutationDagNo.split(', ');
            if (mutationDagNoList.length > 0) {
                mutationDagNoList.forEach(item => {
                    this.mutationDagList.push({
                        dagNo: item
                    });
                });
            }
        }
    }

    landDeedIdList: any = [];
    setDeedList() {
        this.mutationDocForm.controls.deedIds.setValue(null);
        this.mutationDocForm.controls.deedNos.setValue(null);
        this.landDeedIdList = [];
        var deedIdsList = [];
        var deedNosList = [];
        if (this.landDeedIds.length > 0) {
            this.landDeedIds.forEach(item => {
                this.landDeedIdList.push({ deedId: item });

                var imodel = this.landDeedList.filter(x => x.id == item)[0];
                if (imodel != undefined) {
                    deedIdsList.push(imodel.id);
                    deedNosList.push(imodel.text);
                }
            });

            if (deedNosList.length > 0 && deedIdsList.length > 0) {
                var cids = deedIdsList.join(', ');
                var cnos = deedNosList.join(', ');
                this.mutationDocForm.controls.deedIds.setValue(cids);
                this.mutationDocForm.controls.deedNos.setValue(cnos);
            }
        }


    }

    landClassIdList: any = [];
    setLandClassList() {
        this.mutationDocForm.controls.classIds.setValue(null);
        this.mutationDocForm.controls.landClass.setValue(null);
        this.landClassIdList = [];
        var classIdList = [];
        var classNameList = [];
        if (this.landClassIds.length > 0) {
            this.landClassIds.forEach(item => {
                this.landClassIdList.push({ classId: item });

                var imodel = this.landClassList.filter(x => x.id == item)[0];
                if (imodel != undefined) {
                    classIdList.push(imodel.id);
                    classNameList.push(imodel.text);
                }
            });

            if (classNameList.length > 0 && classIdList.length > 0) {
                var cids = classIdList.join(', ');
                var cnames = classNameList.join(', ');
                this.mutationDocForm.controls.classIds.setValue(cids);
                this.mutationDocForm.controls.landClass.setValue(cnames);
            }
        }
    }

    public isIn: boolean = false;
    public _getReportUrl: string = 'reportviewer/getmutationreportbyid';
    loadReportOut(mutationId) {
        this.isIn = false;
        var isModale = true;
        var repFile = 'rptMutation.rdlc';
        var rmodel = { reportPath: '/reportfile/business/mutation/' + repFile, reportName: 'দলিলের তথ্য' };
        this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
        var param = { pageNumber: 0, pageSize: 100, IsPaging: true, strId: mutationId };
        var ModelsArray = [param];
        this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray, isModale);

    }

    //public _getReportUrl: string = 'reportviewer/getmutationreportbyid';
    loadReportModal(mutationId) {
        this.isIn = true;
        debugger;
        this.openReportModaDialog();
        setTimeout(() => {
            this.loadReportIn(mutationId);
        }, 0);
    }

    loadReportIn(mutationId) {
        debugger;
        var repFile = 'rptMutation.rdlc';
        var rmodel = { reportPath: '/reportfile/business/mutation/' + repFile, reportName: 'দলিলের তথ্য' };
        this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 1000);
        var param = { pageNumber: 0, pageSize: 100, IsPaging: true, strId: mutationId };
        var ModelsArray = [param];
        this._rptViewer.reportInPage(this._getReportUrl, ModelsArray);
        //this.openReportModaDialog();
    }

    @ViewChild('modalReport') _modalReport: TemplateRef<any>;
    private _rptDialogRef: MatDialogRef<TemplateRef<any>>;
    openReportModaDialog(): void {
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '70%';
        //_config.panelClass = 'modalTopPosition';

        // if(this.receiverList.length==0 && this.mutationReceiverList.length==0){
        //     this.getOwnerDataFromTemp();
        // }

        this._rptDialogRef = this.dialog.open(this._modalReport, _config);
        this._rptDialogRef.afterClosed().subscribe(result => {
        });
    }

    //Get by ID
    public _getbyIdUrl: string = 'mutation/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.model.mutationId };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                debugger;
                this.documentList = [];
                if (this.res.resdata.objMutation != '') {
                    var mutation = JSON.parse(this.res.resdata.objMutation)[0];
                    console.log("total mutation is ",mutation)

                    this.mutationDocForm.setValue({
                        mutationId: mutation.mutationId,
                        khatianNo: mutation.khatianNo,
                        jotNo: mutation.jotNo,
                        caseNo: mutation.caseNo,
                        mutationDate: mutation.mutationDate,

                        serveyId: mutation.serveyId,

                        districtId: mutation.districtId,
                        thanaId: mutation.thanaId,
                        mouzaId: mutation.mouzaId,

                        dagNos: mutation.dagNos,
                        deedIds: mutation.deedIds,
                        deedNos: mutation.deedNos,
                        classIds: mutation.classIds,
                        landClass: mutation.landClass,

                        totalLand: mutation.totalLand,
                        dcrFee: mutation.dcrFee,
                        totalDue: mutation.totalDue,
                        paymentUnit: mutation.paymentUnit,

                        lastPayDate: mutation.lastPayDate,
                        lastPayDateBN: mutation.lastPayDateBN,
                        lastPayMonthBN: mutation.lastPayMonthBN,
                        lastPayDateStrBN: mutation.lastPayDateStrBN,

                        basePath: this.cmnEntity.menuPath,
                        docPath: mutation.docPath,
                        docVpath: mutation.docVpath,
                        isActive: mutation.isActive == '1' ? true : false
                    });

                    this.bddate = '';
                    if (mutation.lastPayDate != null && mutation.lastPayDate != '') {
                        this.fullbddate = this._bddate.getDatebd(new Date(mutation.lastPayDate));
                        this.bddate = this.fullbddate.fullDateBD;
                        // this.bddate = this._bddate.getDatebd(new Date(mutation.lastPayDate)).fullDateBD;
                    }

                    this.fileSrcName = '';
                    if (mutation.docPath != null && mutation.docPath != '') {
                        this.fileSrc = mutation.docVpath;

                        var docNames = mutation.docPath.split('\\');
                        var docName = docNames[docNames.length - 1];
                        //this.fileSrcName = docName;
                        this.fileSrcName = this.mutationDocForm.controls.khatianNo.value + '_' + this.mutationDocForm.controls.jotNo.value + '_' + this.mutationDocForm.controls.mutationDate.value //file.name;
                    }

                    if (mutation.deedIds != null && mutation.deedIds.length > 0) {
                        this.landDeedIds = mutation.deedIds.split(',');
                    }

                    if (mutation.classIds != null && mutation.classIds.length > 0) {
                        this.landClassIds = mutation.classIds.split(',');
                    }

                    this.getThanaById(mutation.districtId);
                    this.getMouzaId(mutation.thanaId);
                    this.getAllLandDeed(mutation.mouzaId);
                }
            }, error => {
                console.log(error);
            });
    }

    //Delete
    public _deleteUrl: string = 'mutation/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, strId: modelEvnt.model.mutationId };
            var apiUrl = this._deleteUrl;
            this._dataservice.deleteWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    this.resmessage = this.res.resdata.message;
                    if (this.res.resdata.resstate) {
                        this.getListByPage(this.pageSize);
                        this._msg.success(this.resmessage);
                    }
                    else {
                        this._msg.warning(this.resmessage);
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

    reset() {
        this.mutationDocForm = this.formBuilder.group({
            mutationId: null,
            khatianNo: null,
            jotNo: null,
            caseNo: null,
            mutationDate: this._conversion.Today(),

            serveyId: null,

            districtId: '1',
            thanaId: null,
            mouzaId: null,

            dagNos: null,
            deedIds: null,
            deedNos: null,
            classIds: null,
            landClass: null,

            totalLand: null,
            dcrFee: null,
            totalDue: null,
            paymentUnit: null,

            lastPayDate: this._conversion.Today(),
            lastPayDateBN: null,
            lastPayMonthBN: null,
            lastPayDateStrBN: null,

            basePath: this.cmnEntity.menuPath,
            docPath: null,
            docVpath: null,
            isActive: true
        });

        this.bddate = this._bddate.getDatebd(new Date()).fullDateBD;
        this.landDeedIds = [];
        this.landClassIds = [];
        // this.receiverList=[];
        // this.senderList=[];
        if (this._fileInput != undefined) {
            this._fileInput.nativeElement.value = "";
        }

        this.fileSrcName = '';
        this.fileSrc = undefined;
        this.resmessage = null;
        this.documentList = [];

        this.districtsId = '';
        this.thanasId = '';
        this.mouzasId = '';

        this.getInitThanaById('1');
        $('#mutationName').focus();
    }

    //Get Land Class   
    public landDeedIds: any = [];
    public landDeedList: any = [];
    public _getLandDeedUrl: string = 'dropdown/getalllanddeed';
    getAllLandDeed(mouzaId) {
        debugger;
        var deedstt: any = this._deedStat;
        //var tasksMode: boolean = moustt.zone.hasPendingMacrotasks;
        var nestingCount: number = deedstt.zone._nesting;
        if (nestingCount == 1) {
            this.landDeedList = [];
            var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
            var param = { strId: mouzaId };
            var apiUrl = this._getLandDeedUrl
            this._dataservice.getWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    if (this.res.resdata.listLandDeed != '') {
                        var itemList = this.res.resdata.listLandDeed;
                        itemList.forEach(item => {
                            list.push({ id: item.deedId.toString(), text: item.deedNo + '-' + item.deedDate });
                        });

                        this.landDeedList = list;
                    }
                    
                }, error => {
                    console.log(error);
                });
        }
    }
    //Get Land Class

    //Get Servey    
    public serveyList: any = [];
    public _getServeyUrl: string = 'dropdown/getallservey';
    getAllServey() {
        debugger;
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getServeyUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listServey != '') {
                    var itemList = this.res.resdata.listServey;
                    itemList.forEach(item => {
                        list.push({ id: item.serveyId.toString(), text: item.serveyName });
                    });

                    this.serveyList = list;
                   
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Servey

    //Get Land Class   
    public landClassIds: any = [];
    public landClassList: any = [];
    public _getLandClassUrl: string = 'dropdown/getalllandclass';
    getAllLandClass() {
        debugger;
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getLandClassUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listLandClass != '') {
                    var itemList = this.res.resdata.listLandClass;
                    itemList.forEach(item => {
                        list.push({ id: item.classId.toString(), text: item.className });
                    });

                    this.landClassList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Land Class

    //Get District
    public districtList: any = [];
    public _getDistrictUrl: string = 'dropdown/getalldistrict';
    getAllDistrict() {
        var list: Array<{ id, divisionId, text, nameEn }> = [{ id: '', divisionId: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: '' };
        var apiUrl = this._getDistrictUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listDistricts != '') {
                    var itemList = this.res.resdata.listDistricts;
                    itemList.forEach(item => {
                        list.push({ id: item.id, divisionId: item.divisionId, text: item.nameBn, nameEn: item.name_En });
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
    public _getThanaUrl: string = 'dropdown/getthanabyid';
    getInitThanaById(districtId) {
        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: districtId };
        var apiUrl = this._getThanaUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listThanas != '') {
                    var itemList = this.res.resdata.listThanas;
                    itemList.forEach(item => {
                        list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
                    });

                    this.thanaList = list;
                }
            }, error => {
                console.log(error);
            });
    }

    getThanaById(districtId) {
        var thanastt: any = this._thanaState;
        //var tasksMode: boolean = thanastt.zone.hasPendingMacrotasks;
        var nestingCount: number = thanastt.zone._nesting;
        if (nestingCount == 1) {

            this.thanaList = [];

            if (!this.cmnEntity.isEdit) {
                this.mutationDocForm.controls.thanaId.setValue(null);
            }

            var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
            var param = { strId: districtId };
            var apiUrl = this._getThanaUrl;
            this._dataservice.getWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    if (this.res.resdata.listThanas != '') {
                        var itemList = this.res.resdata.listThanas;
                        itemList.forEach(item => {
                            list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
                        });

                        this.thanaList = list;
                    }
                }, error => {
                    console.log(error);
                });
        }
    }
    //Get Thana

    //Get Mouza
    public mouzaList: any = [];
    public _getMouzaUrl: string = 'dropdown/getmouzabyid';
    getMouzaId(thanaId) {
        var moustt: any = this._mouzaState;
        //var tasksMode: boolean = moustt.zone.hasPendingMacrotasks;
        var nestingCount: number = moustt.zone._nesting;
        if (nestingCount == 1) {
            this.mouzaList = [];
            var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
            var param = { strId: thanaId };
            var apiUrl = this._getMouzaUrl;
            this._dataservice.getWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    if (this.res.resdata.listMouza != '') {
                        var itemList = this.res.resdata.listMouza;
                        itemList.forEach(item => {
                            list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
                        });

                        this.mouzaList = list;
                    }
                }, error => {
                    console.log(error);
                });
        }
    }
    //Get Mouza

    //Formatter Modal
    @ViewChild('modalFormatter') _modalFormatter: TemplateRef<any>;
    private _frmtDialogRef: MatDialogRef<TemplateRef<any>>;
    openFormatterModaDialog(): void {
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '70%';
        //_config.panelClass = 'modalTopPosition';

        // if(this.receiverList.length==0 && this.mutationReceiverList.length==0){
        //     this.getOwnerDataFromTemp();
        // }

        this._frmtDialogRef = this.dialog.open(this._modalFormatter, _config);
        this._frmtDialogRef.afterClosed().subscribe(result => {
        });
    }
    //Formatter Modal

    removeSpCharFunc(model, mName) {
        debugger;
        var models = this._conversion.removeSpChars(model);
        this.mutationDocForm.controls[mName].setValue(models);
    }

    //Filter Master List
    //Get District
    public districtsId: string = '';
    public districtsList: any = [];
    public _getDistrictsUrl: string = 'dropdown/getalldistrictsrc';
    getAllDistricts() {
        var list: Array<{ id, divisionId, text, nameEn }> = [{ id: '', divisionId: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: '' };
        var apiUrl = this._getDistrictsUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listDistricts != '') {
                    var itemList = JSON.parse(this.res.resdata.listDistricts);
                    itemList.forEach(item => {
                        list.push({ id: item.id.toString(), divisionId: item.divisionId, text: item.nameBn, nameEn: item.name_En });
                    });

                    this.districtsList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get District

    //Get Thana
    public thanasId: string = '';
    public thanasList: any = [];
    public _getThanasUrl: string = 'dropdown/getthanabyidsrc';
    getThanasById(districtsId) {
        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: districtsId };
        var apiUrl = this._getThanasUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listThanas != '') {
                    var itemList = JSON.parse(this.res.resdata.listThanas);
                    itemList.forEach(item => {
                        list.push({ id: item.id.toString(), text: item.nameBn, nameEn: item.nameEn });
                    });

                    this.thanasList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Thanas

    //Get Mouzas
    public mouzasId: string = '';
    public mouzasList: any = [];
    public _getMouzasUrl: string = 'dropdown/getmouzabyidsrc';
    getMouzasById(thanasId) {
        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: thanasId };
        var apiUrl = this._getMouzasUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listMouza != '') {
                    var itemList = JSON.parse(this.res.resdata.listMouza);
                    itemList.forEach(item => {
                        list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
                    });

                    this.mouzasList = list;
                }
            }, error => {
                console.log(error);
            });
    }

    public khajnaYearList: any = [];
    public currentYear = this._conversion.TodayYear();
    getYearList() {
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var startYear = 1970;
        var endYear = this._conversion.TodayYear();
        //var endYearDesc=this._conversion.getYearListDesc(endYear, startYear);
        var yearLists = this._conversion.getYearListDesc(endYear, startYear);
        yearLists.forEach((item) => {
            list.push({ id: item.yearNo, text: item.yearNo.toString() });
        });

        this.khajnaYearList = list;
    }

    public fullbddate: any;
    public bddate: any ;//= this._bddate.getDatebd(new Date()).fullDateBD;
    getBDDate() {
        debugger;
        var engDate = this.mutationDocForm.controls.lastPayDate.value;
        this.fullbddate = this._bddate.getDatebd(new Date(engDate));
        this.bddate = this.fullbddate.fullDateBD;
        debugger;
    }

    //Document Upload
    clickOnBtnFile() {
        this._fileInput.nativeElement.value = "";
        $('#attachedSingleFile').click();
    }

    public fileSrcName: string = '';
    public fileSrc;
    public documentList: any = [];
    onFileChange() {
        debugger;
        //var fileInfo=this._fileInput;
        this.documentList = [];
        //let reader = new FileReader();
        if (this._fileInput.nativeElement.files.length > 0) {
            let file = this._fileInput.nativeElement.files[0];
            var arryext = file.name.split(".");
            var ext = arryext[arryext.length - 1];
            var extlwr = ext.toLowerCase();
            var fileIndex = this.fileTypes.indexOf(extlwr);
            var fileSize = file.size / 1024 / 1024; // in MB
            //var fileType = file.type;
            if (fileSize > 15) {
                this._fileInput.nativeElement.value = "";
                this._msg.error('File size exceeds 15 MB');
            } else if (fileIndex === -1) {
                this._fileInput.nativeElement.value = "";
                this._msg.error('File type not supported. Valid file types are ' + this.fileTypes);
            } else {
                this.fileSrc = this._conversion.openSanitizedReportByFile(file);
                this.fileSrcName = this.mutationDocForm.controls.khatianNo.value + '_' + this.mutationDocForm.controls.jotNo.value + '_' + this.mutationDocForm.controls.mutationDate.value //file.name;
                this.documentList.push({
                    documentId: 0,
                    originalDocName: file.name,
                    documentName: file.name,
                    documentType: extlwr,
                    documentSize: fileSize,
                    attachedfile: file,
                    documentPath: this.cmnEntity.menuPath,
                    basePath: '',
                    documentFullPath: '',
                    virtualPath: '',
                    isActive: true,
                    isDelete: false,
                    createBy: this.userID
                });
            }
        }
    }

    public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf"];
    //Document Upload
}
