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
import { BDDate } from '../../../../app/api/api.bddate.service';
declare var $: any;

@Component({
    selector: 'app-khajnaentry',
    templateUrl: './khajnaentry.component.html',
    styleUrls: ['./khajnaentry.component.scss'],
    providers: [Conversion, BDDate]
})

export class KhajnaEntryComponent implements OnInit {
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
    public resmessage: string='';
    public IsShow: boolean = true;
    public res: any;
    public pageSize: number = 15;
    //public displayStart = 0;
    public isLoaded: Object = true;
    public khajnaDocForm: FormGroup;
    public options: Options;
    public optionMulti: Options;
    public toYearBn: string = '';
    public bddate: any;
    //public dagCs: string = '';
    // public optionbn: Options;
    // public optioncustom: Options;
    //public roleIds: [];    
    constructor(
        private _conversion: Conversion,
        public _bddate: BDDate,
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
        this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: false }]);
        this.cmnEntity.isShow = true;

        this.toYearBn = this._bddate.getDatebd(new Date()).yearEN.toString();
        this.bddate = this._bddate.getDatebd(new Date()).fullDateBD;
    }

    ngOnInit(): void {
        this.createForm();
        //this.showHide();
        this.getListByPage(this.pageSize);
        // this.getAllOwner();
        // this.getAllSeller();
        //this.getAllDistrict();
        this.getAllDistricts();
        // this.getInitThanaById('1');
        // this.getAllServey();
        // this.getAllLandClass();
        // this.getAllLandDeed();
        //this.getInitRegistryOfficeById('1');
        $('#khajnaName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.khajnaDocForm = this.formBuilder.group({
            khajnaId: new FormControl(null),
            mutationId: new FormControl(null, Validators.required),

            khajnaDate: new FormControl(this._conversion.Today(), Validators.required),
            khajnaDateBN: new FormControl(null),
            khajnaMonthBN: new FormControl(null),
            khajnaDateStrBN: new FormControl(null),

            lastDueYear: new FormControl(null),
            totalDueYear: new FormControl(null),

            khajnaAmount: new FormControl(0, Validators.required),
            fineAmount: new FormControl(0),
            totalAmount: new FormControl(0),
            remarks: new FormControl(null),

            lastPayYear: new FormControl(null),
            lastPayDate: new FormControl(null),
            lastPayYearBN: new FormControl(null),
            lastPayDateBN: new FormControl(null),
            lastPayMonthBN: new FormControl(null),
            lastPayDateStrBN: new FormControl(null),

            lastDue: new FormControl(null),
            lastPayUnit: new FormControl(null),

            basePath: new FormControl(this.cmnEntity.menuPath),
            docPath: new FormControl(null),
            docVpath: new FormControl(null),
            isActive: new FormControl(true)
        });
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listMutation';
    public muteKhajnaList: any = [];
    public _listByPageUrl: string = 'khajna/getbypage';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);
        }, 0);
    }

    public searchVal: string = '';
    getListByPages(pageSize) {
        debugger;
        this.searchVal = this._pgTop.searchVal;
        this.getListByPage(pageSize);
    }

    public _saveUrl: string = 'khajna/saveupdateform';
    onSubmit() {

        if (this.khajnaDocForm.invalid) {
            return;
        }

        if (this.khajnaDocForm.controls.totalAmount.value == null || this.khajnaDocForm.controls.totalAmount.value == 0) {
            this._msg.warning('মোট প্রদত্ত টাকা ০ থেকে বেশি হতে হবে!!!');
            return;
        }

        var formData = new FormData();
        if (this.documentList.length > 0) {
            this.documentList.forEach(item => {
                formData.append('docFile', item.attachedfile);
            });
        }

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.khajnaDocForm.value];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModelForm(apiUrl, ModelsArray, formData)
            .subscribe(response => {
                var res = response;
                var resmessage = res.resdata.message;
                if (res.resdata.resstate) {
                    //this.getListByPage(this.pageSize);
                    this.reset();
                    this.getMuteWisePayment(this.mutationEntity);
                    if (res.resdata.result == '-1') {
                        this._msg.info(resmessage);
                    } else {
                        this._msg.success(resmessage);
                    }
                    //this.loadReportOut(res.resdata.result);
                } else {
                    this._msg.warning(resmessage);
                }
            }, error => {
                console.log(error);
            });
    }

    public fullbddate: any;
    getBDDate() {
        debugger;
        var engDate = this.khajnaDocForm.controls.khajnaDate.value;
        this.fullbddate = this._bddate.getDatebd(new Date(engDate));
        this.bddate = this.fullbddate.fullDateBD;
        debugger;
    }

    khajnaDagList: any = [];
    setMutationDagList() {
        debugger;
        var formValue = this.khajnaDocForm.value;
        this.khajnaDagList = [];
        if (formValue.dagNos != null && formValue.dagNos.length > 0) {
            var khajnaDagNo = this._conversion.removeSpChars(formValue.dagNos);
            var khajnaDagNoList = khajnaDagNo.split(', ');
            if (khajnaDagNoList.length > 0) {
                khajnaDagNoList.forEach(item => {
                    this.khajnaDagList.push({
                        dagNo: item
                    });
                });
            }
        }
    }

    public isIn: boolean = false;
    public _getReportUrl: string = 'reportviewer/getkhajnareportbyid';
    loadReportOut(khajnaId) {
        this.isIn = false;
        var isModale = true;
        var repFile = 'rptMutation.rdlc';
        var rmodel = { reportPath: '/reportfile/business/khajna/' + repFile, reportName: 'দলিলের তথ্য' };
        this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
        var param = { pageNumber: 0, pageSize: 100, IsPaging: true, strId: khajnaId };
        var ModelsArray = [param];
        this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray, isModale);

    }

    //public _getReportUrl: string = 'reportviewer/getkhajnareportbyid';
    loadReportModal(khajnaId) {
        this.isIn = true;
        debugger;
        this.openReportModaDialog();
        setTimeout(() => {
            this.loadReportIn(khajnaId);
        }, 0);
    }

    loadReportIn(khajnaId) {
        debugger;
        var repFile = 'rptMutation.rdlc';
        var rmodel = { reportPath: '/reportfile/business/khajna/' + repFile, reportName: 'দলিলের তথ্য' };
        this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 1000);
        var param = { pageNumber: 0, pageSize: 100, IsPaging: true, strId: khajnaId };
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

        // if(this.receiverList.length==0 && this.khajnaReceiverList.length==0){
        //     this.getOwnerDataFromTemp();
        // }

        this._rptDialogRef = this.dialog.open(this._modalReport, _config);
        this._rptDialogRef.afterClosed().subscribe(result => {
        });
    }

    //Get by ID    
    newPayment(rowEntity) {
        debugger;
        //modelEvnt.event.preventDefault();
        this.mutationEntity = rowEntity;
        this.reset();

        this.fullbddate = this._bddate.getDatebd(new Date());
        this.khajnaDocForm.setValue({
            khajnaId: null,
            mutationId: this.mutationEntity.mutationId,

            khajnaDate: this._conversion.Today(),
            khajnaDateBN: this.fullbddate.dateBDEn,
            khajnaMonthBN: this.fullbddate.month,
            khajnaDateStrBN: this.fullbddate.fullDateBD,

            lastDueYear: this.mutationEntity.lastKhajnaYear,
            totalDueYear: this.mutationEntity.totalDueYear,

            khajnaAmount: (this.mutationEntity.lastPayUnit == null ? 0 : this.mutationEntity.lastPayUnit) * this.mutationEntity.totalDueYear,
            fineAmount: 0,
            totalAmount: (this.mutationEntity.lastPayUnit == null ? 0 : this.mutationEntity.lastPayUnit) * this.mutationEntity.totalDueYear,
            remarks: null,

            lastPayYear: this.mutationEntity.lastPayYear,
            lastPayDate: this.mutationEntity.lastPayDate,
            lastPayYearBN: this.mutationEntity.lastPayYearBN,
            lastPayDateBN: this.mutationEntity.lastPayDateBN,
            lastPayMonthBN: this.mutationEntity.lastPayMonthBN,
            lastPayDateStrBN: this.mutationEntity.lastPayDateStrBN,

            lastDue: this.mutationEntity.lastDue,
            lastPayUnit: this.mutationEntity.lastPayUnit,

            basePath: this.cmnEntity.menuPath,
            docPath: null,
            docVpath: null,
            isActive: true
        });

        this.getMuteWisePayment(rowEntity);
    }

    public khajnaList: any = [];
    public _getKhajnaByMuteIdUrl: string = 'khajna/getkhajnalistbymutationid';
    getMuteWisePayment(rowEntity) {
        debugger;
        this.mutationEntity = rowEntity;
        var param = { strId: rowEntity.mutationId };
        var apiUrl = this._getKhajnaByMuteIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                var res = response;
                this.khajnaList = [];
                if (res.resdata.khajnaList != '') {
                    this.khajnaList = JSON.parse(res.resdata.khajnaList);
                }
            }, error => {
                console.log(error);
            });
    }

    editPayment(rowEntity) {
        debugger;

        this.khajnaDocForm.controls.khajnaId.setValue(rowEntity.khajnaId);
        this.khajnaDocForm.controls.khajnaDate.setValue(rowEntity.khajnaDate);
        this.khajnaDocForm.controls.khajnaDateBN.setValue(rowEntity.khajnaDateBN);
        this.khajnaDocForm.controls.khajnaMonthBN.setValue(rowEntity.khajnaMonthBN);
        this.khajnaDocForm.controls.khajnaDateStrBN.setValue(rowEntity.khajnaDateStrBN);
        this.khajnaDocForm.controls.khajnaAmount.setValue(rowEntity.khajnaAmount);
        this.khajnaDocForm.controls.fineAmount.setValue(rowEntity.fineAmount);
        this.khajnaDocForm.controls.totalAmount.setValue(rowEntity.totalAmount);
        this.khajnaDocForm.controls.remarks.setValue(rowEntity.remarks);
        this.khajnaDocForm.controls.docPath.setValue(rowEntity.docPath);
        this.khajnaDocForm.controls.docVpath.setValue(rowEntity.docVpath);

        this.fileSrcName = 'খাজনা রশিদ-' + this._conversion.enNumToBnNum(rowEntity.khajnaYearBN);
        this.fileSrc = rowEntity.docVpath;
    }

    calTotal() {
        var docModel = this.khajnaDocForm.value;
        var ttlAmt = (docModel.khajnaAmount == null ? 0 : docModel.khajnaAmount) + (docModel.fineAmount == null ? 0 : docModel.fineAmount);
        this.khajnaDocForm.controls.totalAmount.setValue(ttlAmt);
    }

    //Delete
    public _deleteUrl: string = 'khajna/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, strId: modelEvnt.model.khajnaId };
            var apiUrl = this._deleteUrl;
            this._dataservice.deleteWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    var res = response;
                    var resmessage = res.resdata.message;
                    if (res.resdata.resstate) {
                        this.getListByPage(this.pageSize);
                        this._msg.success(resmessage);
                    }
                    else {
                        this._msg.warning(resmessage);
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

    public statusId: string = '4';
    public statusList: any = [{ id: '0', text: 'সব' }, { id: '1', text: 'পরিশোধিত' }, { id: '2', text: 'বকেয়া' }, { id: '3', text: 'নতুন' }, { id: '4', text: 'বকেয়া ও নতুন' }];

    reset() {
        this.fullbddate = this._bddate.getDatebd(new Date());
        // this.khajnaDocForm = this.formBuilder.group({
        //     khajnaId: null,
        //     mutationId: null,
        //     khajnaDate: this._conversion.Today(),
        //     khajnaDateBN: null,
        //     khajnaMonthBN: null,
        //     khajnaDateStrBN: null,
        //     lastDueYear: null,
        //     totalDueYear: null,

        //     khajnaAmount: null,
        //     fineAmount: null,
        //     totalAmount: null,
        //     remarks: null,

        //     lastPayYear: null,
        //     lastPayDate: null,
        //     lastPayYearBN: null,
        //     lastPayDateBN: null,
        //     lastPayMonthBN: null,
        //     lastPayDateStrBN: null,
        //     lastDue: null,
        //     lastPayUnit: null,

        //     basePath: this.cmnEntity.menuPath,
        //     docPath: null,
        //     docVpath: null,
        //     isActive: true
        // });

        this.khajnaDocForm.controls.khajnaId.setValue(null);
        this.khajnaDocForm.controls.khajnaDate.setValue(this._conversion.Today());
        this.khajnaDocForm.controls.khajnaDateBN.setValue(this.fullbddate.dateBDEn);
        this.khajnaDocForm.controls.khajnaMonthBN.setValue(this.fullbddate.month);
        this.khajnaDocForm.controls.khajnaDateStrBN.setValue(this.fullbddate.fullDateBD);
        this.khajnaDocForm.controls.khajnaAmount.setValue(0);
        this.khajnaDocForm.controls.fineAmount.setValue(0);
        this.khajnaDocForm.controls.totalAmount.setValue(0);
        this.khajnaDocForm.controls.remarks.setValue(null);
        this.khajnaDocForm.controls.docPath.setValue(null);
        this.khajnaDocForm.controls.docVpath.setValue(null);

        if (this._fileInput != undefined) {
            this._fileInput.nativeElement.value = "";
        }

        this.fileSrcName = '';
        this.fileSrc = undefined;
        this.resmessage = '';
        this.documentList = [];

        this.statusId = '0';
        this.districtsId = '';
        this.thanasId = '';
        this.mouzasId = '';

        $('#khajnaName').focus();
    }

    public mutationEntity: any;
    @ViewChild('modalKhajna') _modalKhajna: TemplateRef<any>;
    private _khajnaDialogRef: MatDialogRef<TemplateRef<any>>;
    openKhajnaModaDialog(rowEntity): void {
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '70%';
        //_config.panelClass = 'modalTopPosition';

        // if(this.receiverList.length==0 && this.khajnaReceiverList.length==0){
        //     this.getOwnerDataFromTemp();
        // }
        this.mutationEntity = rowEntity;
        this._khajnaDialogRef = this.dialog.open(this._modalKhajna, _config);
        this._khajnaDialogRef.afterClosed().subscribe(result => {
        });
    }
    //Khajna Modal   

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
                var res = response;
                if (res.resdata.listDistricts != '') {
                    var itemList = JSON.parse(res.resdata.listDistricts);
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
                var res = response;
                if (res.resdata.listThanas != '') {
                    var itemList = JSON.parse(res.resdata.listThanas);
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
                var res = response;
                if (res.resdata.listMouza != '') {
                    var itemList = JSON.parse(res.resdata.listMouza);
                    itemList.forEach(item => {
                        list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
                    });

                    this.mouzasList = list;
                }
            }, error => {
                console.log(error);
            });
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
                this.fileSrcName = file.name;
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
