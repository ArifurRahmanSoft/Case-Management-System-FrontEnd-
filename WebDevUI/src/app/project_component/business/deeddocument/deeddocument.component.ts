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
import { ConfirmModal } from 'src/app/theme/components/modalconfirm/confirmmodal.component';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
// import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
//import { filter } from 'rxjs/operators';
//import { GMapModal } from '../../modal/map/gmap';
declare var $: any;
declare var google: any;

// @Pipe({
//     name: 'rowFilter'
// })

@Component({
    selector: 'app-deeddocument',
    templateUrl: './deeddocument.component.html',
    styleUrls: ['./deeddocument.component.scss'],
    providers: [Conversion]
})

export class DeedDocumentComponent implements OnInit {
    //Common    
    public settings: Settings;
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
    @ViewChild('cmnpagerTop', { static: false }) _pgTop: CommonPager;
    @ViewChild('fileInput') _fileInput: ElementRef;
    @ViewChild('thanaState', { static: false }) _thanaState: ElementRef;
    @ViewChild('mouzaState', { static: false }) _mouzaState: ElementRef;
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
    public deedDocForm: FormGroup;
    public options: Options;
    public optionMulti: Options;
    public dagCs: string = '';
    public isReportShowOnSubmit: boolean = false;
    // public optionbn: Options;
    // public optioncustom: Options;
    //public roleIds: [];    
    constructor(
        public appSettings: AppSettings,
        public _conversion: Conversion,
        private _dataservice: DataService,
        public dialog: MatDialog,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        private ngZone: NgZone,
        // private locationService: LocationService,
        // private cd: ChangeDetectorRef,
        //private gmap: GMapModal,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        this.options = this._pathValidation.ngSelect2Option();
        this.optionMulti = this._pathValidation.ngSelect2MultiOption();
        this.dialogConfig = new MatDialogConfig();

        this.settings = this.appSettings.settings;
        this.today = _conversion.Today();
        // this.optionbn = this.ngSelect2OptionSelf();
        // this.optioncustom = this.ngSelect2OptionSelf2();
        //this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: true }]);
    }

    // transform(data: any[], filterType: any): any {
    //     if (!data || !filter) {
    //         return data;
    //     }

    //     return data.filter(item => item[filterType].indexOf(item) !== -1);
    // }


    ngOnInit(): void {
        // this.getLocation();
        this.createForm();
        // this.getAllOwner();
        // this.getAllSeller();
        this.getAllDistrict();
        this.getAllDistricts();
        this.getInitThanaAndRegOfficeById('1');
        this.getUploadType();
        this.getAllLandProject();
        this.getAllLandCategory();
        this.getAllLandSubCategory();
        //this.getInitRegistryOfficeById('1');
        $('#deedName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.deedDocForm = this.formBuilder.group({
            deedId: new FormControl(null),
            deedNo: new FormControl(null, Validators.required),
            deedDate: new FormControl(this._conversion.Today(), Validators.required),
            deedNoVia: new FormControl(null),
            caseNo: new FormControl(null),

            projectId: new FormControl(null),
            categoryId: new FormControl(null),
            subCategoryIds: new FormControl([]),

            deedReceiver: new FormControl('', Validators.required),
            deedSender: new FormControl('', Validators.required),

            divisionId: new FormControl('3'),
            districtId: new FormControl('1'),
            thanaId: new FormControl(null),
            mouzaId: new FormControl(null),
            registryOfficeId: new FormControl(null),
            landOfficeId: new FormControl(null),

            holdingNo: new FormControl(null),
            landClass: new FormControl(null),

            khatianCS: new FormControl(null),
            khatianSA: new FormControl(null),
            khatianDR: new FormControl(null),
            khatianRS: new FormControl(null),
            khatianBS: new FormControl(null),

            dagCS: new FormControl(null),
            dagSA: new FormControl(null),
            dagDR: new FormControl(null),
            dagRS: new FormControl(null),
            dagBS: new FormControl(null),

            totalLandInDag: new FormControl(null),
            purchasedLand: new FormControl(null),
            purchaseAmount: new FormControl(null),

            mutatedLand: new FormControl(null),
            notMutatedLand: new FormControl(null),
            mutationKhatianNo: new FormControl(null),
            mutationJotNo: new FormControl(null),

            ldTaxAmount: new FormControl(null),
            remarks: new FormControl(null),

            latitude: new FormControl(null),
            longitude: new FormControl(null),

            basePath: new FormControl(this.cmnEntity.menuPath),
            isActive: new FormControl(true),
            isPosted: new FormControl(false)
        });
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listDeed';
    public deedList: any = [];
    public _listByPageUrl: string = 'deed/getbypage';
    getListByPage(pageSize) {
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

    public _saveUrl: string = 'deed/saveupdateform';
    onSubmit() {

        if (this.deedDocForm.invalid) {
            return;
        }

        var ddf = this.deedDocForm.value;

        var ddNoVia = ddf.deedNoVia == null || ddf.deedNoVia == '' ? null : this._conversion.removeSpChars(ddf.deedNoVia);
        this.deedDocForm.controls.deedNoVia.setValue(ddNoVia);

        var ddkhatianCS = ddf.khatianCS == null || ddf.khatianCS == '' ? null : this._conversion.removeSpChars(ddf.khatianCS);
        this.deedDocForm.controls.khatianCS.setValue(ddkhatianCS);

        var ddkhatianSA = ddf.khatianSA == null || ddf.khatianSA == '' ? null : this._conversion.removeSpChars(ddf.khatianSA);
        this.deedDocForm.controls.khatianSA.setValue(ddkhatianSA);

        var ddkhatianDR = ddf.khatianDR == null || ddf.khatianDR == '' ? null : this._conversion.removeSpChars(ddf.khatianDR);
        this.deedDocForm.controls.khatianDR.setValue(ddkhatianDR);

        var ddkhatianRS = ddf.khatianRS == null || ddf.khatianRS == '' ? null : this._conversion.removeSpChars(ddf.khatianRS);
        this.deedDocForm.controls.khatianRS.setValue(ddkhatianRS);

        var ddkhatianBS = ddf.khatianBS == null || ddf.khatianBS == '' ? null : this._conversion.removeSpChars(ddf.khatianBS);
        this.deedDocForm.controls.khatianBS.setValue(ddkhatianBS);


        var dddagCS = ddf.dagCS == null || ddf.dagCS == '' ? null : this._conversion.removeSpChars(ddf.dagCS);
        this.deedDocForm.controls.dagCS.setValue(dddagCS);

        var dddagSA = ddf.dagSA == null || ddf.dagSA == '' ? null : this._conversion.removeSpChars(ddf.dagSA);
        this.deedDocForm.controls.dagSA.setValue(dddagSA);

        var dddagDR = ddf.dagDR == null || ddf.dagDR == '' ? null : this._conversion.removeSpChars(ddf.dagDR);
        this.deedDocForm.controls.dagDR.setValue(dddagDR);

        var dddagRS = ddf.dagRS == null || ddf.dagRS == '' ? null : this._conversion.removeSpChars(ddf.dagRS);
        this.deedDocForm.controls.dagRS.setValue(dddagRS);

        var dddagBS = ddf.dagBS == null || ddf.dagBS == '' ? null : this._conversion.removeSpChars(ddf.dagBS);
        this.deedDocForm.controls.dagBS.setValue(dddagBS);

        var sclist: any = [];
        this.landSubCategoryIds.forEach((item: any) => {
            sclist.push({ subCategoryId: item });
        });

        this.deedDocForm.controls.subCategoryIds.setValue(JSON.stringify(sclist));

        var formData = new FormData();
        if (this.docList.length > 0) {
            this.docList.forEach((item: any) => {
                formData.append('docFile', item.attachedfile);
            });
        }

        this.setBayaDeedList();
        this.setServeyList();

        var deedDocForms = this.deedDocForm.value;
        deedDocForms.deedNoVia = '';

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, deedDocForms, this.docList, this.deedReceiverList, this.deedSenderList, this.bayaDeedList, this.deedServeyList];
        //var ModelsArray = [param, this.deedDocForm.value, this.docList, this.deedReceiverList, this.deedSenderList, this.bayaDeedList, this.deedServeyList];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModelForm(apiUrl, ModelsArray, formData)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.getListByPage(this.pageSize);
                    this._msg.success(this.resmessage);
                    if (this.isReportShowOnSubmit) {
                        this.reset();
                        this.loadReportOut(this.res.resdata.result);
                    } else {
                        this.reset();
                    }

                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }

    public isIn: boolean = false;
    public _getReportUrl: string = 'reportviewer/getdeedreportbyid';
    loadReportOut(deedId) {
        this.isIn = false;
        var isModale = true;
        var repFile = 'rptDeed.rdlc';
        var rmodel = { reportPath: '/reportfile/business/deed/' + repFile, reportName: 'দলিলের তথ্য' };
        this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
        var param = { pageNumber: 0, pageSize: 100, IsPaging: true, strId: deedId };
        var ModelsArray = [param];
        this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray, isModale);

    }

    //public _getReportUrl: string = 'reportviewer/getdeedreportbyid';
    loadReportModal(deedId) {
        this.isIn = true;
        debugger;
        this.openReportModaDialog();
        setTimeout(() => {
            this.loadReportIn(deedId);
        }, 0);
    }

    loadReportIn(deedId) {
        debugger;
        var repFile = 'rptDeed.rdlc';
        var rmodel = { reportPath: '/reportfile/business/deed/' + repFile, reportName: 'দলিলের তথ্য' };
        this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 1000);
        var param = { pageNumber: 0, pageSize: 100, IsPaging: true, strId: deedId };
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

        // if(this.receiverList.length==0 && this.deedReceiverList.length==0){
        //     this.getOwnerDataFromTemp();
        // }

        this._rptDialogRef = this.dialog.open(this._modalReport, _config);
        this._rptDialogRef.afterClosed().subscribe(result => {
        });
    }

    public ttlLand: any;
    public purLand: any;
    public mutLand: any;
    public nMutLand: any;
    getLandUnit(colName, colVal) {
        debugger;
        this[colName] = this._conversion.getLandUnits(colVal).fullUnit;
        // var lndModel = this._conversion.getLandUnits(colVal);
        // this[colName] = lndModel.ekr + ' একর, ' + lndModel.bigha + ' বিঘা, ' + lndModel.katha + ' কাঠা';
    }

    deedServeyList: any = [];
    setServeyList() {
        debugger;
        var formValue = this.deedDocForm.value;
        this.deedServeyList = [];
        var khatianType = '1', dagType = '2';
        var CS = '1', SA = '2', DR = '3', RS = '4', BS = '5';
        var serveyTypeId = khatianType;
        var serveyId = CS;
        if (formValue.khatianCS != null && formValue.khatianCS.length > 0) {
            serveyTypeId = khatianType;
            serveyId = CS;
            var khatianCS = this._conversion.removeSpChars(formValue.khatianCS);
            var khatianCSList = khatianCS.split(', ');
            if (khatianCSList.length > 0) {
                khatianCSList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.dagCS != null && formValue.dagCS.length > 0) {
            serveyTypeId = dagType;
            serveyId = CS;
            var dagCS = this._conversion.removeSpChars(formValue.dagCS);
            var dagCSList = dagCS.split(', ');
            if (dagCSList.length > 0) {
                dagCSList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.khatianSA != null && formValue.khatianSA.length > 0) {
            serveyTypeId = khatianType;
            serveyId = SA;
            var khatianSA = this._conversion.removeSpChars(formValue.khatianSA);
            var khatianSAList = khatianSA.split(', ');
            if (khatianSAList.length > 0) {
                khatianSAList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.dagSA != null && formValue.dagSA.length > 0) {
            serveyTypeId = dagType;
            serveyId = SA;
            var dagSA = this._conversion.removeSpChars(formValue.dagSA);
            var dagSAList = dagSA.split(', ');
            if (dagSAList.length > 0) {
                dagSAList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.khatianDR != null && formValue.khatianDR.length > 0) {
            serveyTypeId = khatianType;
            serveyId = DR;
            var khatianDR = this._conversion.removeSpChars(formValue.khatianDR);
            var khatianDRList = khatianDR.split(', ');
            if (khatianDRList.length > 0) {
                khatianDRList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.dagDR != null && formValue.dagDR.length > 0) {
            serveyTypeId = dagType;
            serveyId = DR;
            var dagDR = this._conversion.removeSpChars(formValue.dagDR);
            var dagDRList = dagDR.split(', ');
            if (dagDRList.length > 0) {
                dagDRList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.khatianRS != null && formValue.khatianRS.length > 0) {
            serveyTypeId = khatianType;
            serveyId = RS;
            var khatianRS = this._conversion.removeSpChars(formValue.khatianRS);
            var khatianRSList = khatianRS.split(', ');
            if (khatianRSList.length > 0) {
                khatianRSList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.dagRS != null && formValue.dagRS.length > 0) {
            serveyTypeId = dagType;
            serveyId = RS;
            var dagRS = this._conversion.removeSpChars(formValue.dagRS);
            var dagRSList = dagRS.split(', ');
            if (dagRSList.length > 0) {
                dagRSList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.khatianBS != null && formValue.khatianBS.length > 0) {
            serveyTypeId = khatianType;
            serveyId = BS;
            var khatianBS = this._conversion.removeSpChars(formValue.khatianBS);
            var khatianBSList = khatianBS.split(', ');
            if (khatianBSList.length > 0) {
                khatianBSList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }

        if (formValue.dagBS != null && formValue.dagBS.length > 0) {
            serveyTypeId = dagType;
            serveyId = BS;
            var dagBS = this._conversion.removeSpChars(formValue.dagBS);
            var dagBSList = dagBS.split(', ');
            if (dagBSList.length > 0) {
                dagBSList.forEach(item => {
                    this.deedServeyList.push({
                        serveyId: serveyId
                        , serveyTypeId: serveyTypeId
                        , serveyNo: item
                    });
                });
            }
        }
    }

    bayaDeedList: any = [];
    setBayaDeedList() {
        var formValue = this.deedDocForm.value;
        this.bayaDeedList = [];
        if (formValue.deedNoVia != null && formValue.deedNoVia.length > 0) {
            var bayaDeed = this._conversion.removeSpChars(formValue.deedNoVia);
            var bayaList = bayaDeed.split(', ');
            if (bayaList.length > 0) {
                bayaList.forEach(item => {
                    this.bayaDeedList.push({
                        bayaDeedNo: item
                    });
                });
            }
        }
    }

    //Get by ID
    public _getbyIdUrl: string = 'deed/getbyid';
    edit(modelEvnt) {
        debugger;
        //modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.deedId };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                debugger;
                if (this.res.resdata.objDeed != '') {
                    var deed = JSON.parse(this.res.resdata.objDeed)[0];

                    this.deedDocForm.setValue({
                        deedId: deed.deedId,
                        deedNo: deed.deedNo,
                        deedDate: this._conversion.DateConvert(deed.deedDate),
                        deedNoVia: deed.deedNoVia,
                        caseNo: deed.caseNo,

                        projectId: deed.projectId,
                        categoryId: deed.categoryId,
                        subCategoryIds: deed.subCategoryIds,

                        deedReceiver: '',
                        deedSender: '',

                        divisionId: deed.divisionId,
                        districtId: deed.districtId,
                        thanaId: deed.thanaId,
                        mouzaId: deed.mouzaId,
                        registryOfficeId: deed.registryOfficeId,
                        landOfficeId: deed.landOfficeId,

                        holdingNo: deed.holdingNo,
                        landClass: deed.landClass,

                        khatianCS: deed.khatianCS,
                        khatianSA: deed.khatianSA,
                        khatianDR: deed.khatianDR,
                        khatianRS: deed.khatianRS,
                        khatianBS: deed.khatianBS,

                        dagCS: deed.dagCS,
                        dagSA: deed.dagSA,
                        dagDR: deed.dagDR,
                        dagRS: deed.dagRS,
                        dagBS: deed.dagBS,

                        totalLandInDag: deed.totalLandInDag,
                        purchasedLand: deed.purchasedLand,
                        purchaseAmount: deed.purchaseAmount,

                        mutatedLand: deed.mutatedLand,
                        notMutatedLand: deed.notMutatedLand,
                        mutationKhatianNo: deed.mutationKhatianNo,
                        mutationJotNo: deed.mutationJotNo,

                        ldTaxAmount: deed.ldTaxAmount,
                        remarks: deed.remarks,

                        latitude: deed.latitude,
                        longitude: deed.longitude,

                        basePath: this.cmnEntity.menuPath,
                        isActive: deed.isActive == "1" ? true : false,
                        isPosted: deed.isPosted == "1" ? true : false
                    });

                    if (this.res.resdata.objViaDeed != '') {
                        var viaDeedList = JSON.parse(this.res.resdata.objViaDeed);
                        var viaDeedArray = [];
                        viaDeedList.forEach((item) => {
                            viaDeedArray.push(item.deedNoVia);
                        });

                        var viaDeedNo = viaDeedArray.join(', ');
                        this.deedDocForm.controls.deedNoVia.setValue(viaDeedNo);
                    }

                    this.landSubCategoryIds = [];
                    if (this.res.resdata.objSubCat != '') {
                        // this.ngZone.run(() => {
                        this.getSubCatByCatId(deed.categoryId, false);
                        var subCatList = JSON.parse(this.res.resdata.objSubCat);
                        //this.landSubCategoryIds = [];
                        // setTimeout(() => {
                        subCatList.forEach((item) => {
                            this.landSubCategoryIds.push(item.subCategoryId);
                        });
                        // });

                        // this.cd.detectChanges();
                        // },10);
                        // this.deedDocForm.controls.subCategoryIds.setValue(this.res.resdata.objSubCat);

                    }

                    if (deed.totalLandInDag != null && deed.totalLandInDag > 0) {
                        this.getLandUnit('ttlLand', deed.totalLandInDag);
                    }

                    if (deed.purchasedLand != null && deed.purchasedLand > 0) {
                        this.getLandUnit('purLand', deed.purchasedLand);
                    }

                    if (deed.mutatedLand != null && deed.mutatedLand > 0) {
                        this.getLandUnit('mutLand', deed.mutatedLand);
                    }

                    if (deed.notMutatedLand != null && deed.notMutatedLand > 0) {
                        this.getLandUnit('nMutLand', deed.notMutatedLand);
                    }

                    this.getThanaAndRegOfficeById(deed.districtId);
                    this.getMouzaId(deed.thanaId);

                    this.docList = [];
                    if (this.res.resdata.objDoc != '') {
                        var docLists = JSON.parse(this.res.resdata.objDoc);
                        docLists.forEach(item => {
                            item.isActive = item.isActive == '1' ? true : false;
                            item.isCancel = item.isCancel == '1' ? true : false;
                        });

                        this.docList = docLists;
                    }

                    if (this.res.resdata.objOwner != '') {
                        //this.strDeedReceiver = '';
                        this.deedDocForm.controls.deedReceiver.setValue('');
                        var rcvNameList = [];
                        var ownerLists = JSON.parse(this.res.resdata.objOwner);
                        ownerLists.forEach(item => {
                            item.isGong = item.isGong == '1' ? true : false;
                            item.isChecked = item.isChecked == '1' ? true : false;
                            rcvNameList.push(item.nameBn);
                        });

                        this.deedReceiverList = ownerLists;

                        var strDeedReceiver = rcvNameList.join(', ');
                        this.deedDocForm.controls.deedReceiver.setValue(strDeedReceiver);
                    }

                    if (this.res.resdata.objSeller != '') {
                        //this.strDeedSender = '';
                        this.deedDocForm.controls.deedSender.setValue('');
                        var sndrNameList = [];
                        var sellerLists = JSON.parse(this.res.resdata.objSeller);
                        sellerLists.forEach(item => {
                            item.isGong = item.isGong == '1' ? true : false;
                            item.isChecked = item.isChecked == '1' ? true : false;
                            sndrNameList.push(item.nameBn);
                        });

                        this.deedSenderList = sellerLists;
                        var strDeedSender = sndrNameList.join(', ');
                        this.deedDocForm.controls.deedSender.setValue(strDeedSender);
                    }
                }
            }, error => {
                console.log(error);
            });
    }

    //Delete
    public _deleteUrl: string = 'deed/delete';
    delete(modelEvnt) {
        debugger;
        //modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, strId: modelEvnt.model.deedId };
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

    //Get by ID for set location
    public deedLockForm: any;
    public _getbyIdforlocationUrl: string = 'deed/getbyidforsetlocation';
    getDeedForLocation(modelEvnt) {
        debugger;
        //modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.deedId };
        var apiUrl = this._getbyIdforlocationUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                debugger;
                if (this.res.resdata.objDeed != '') {
                    var deed = JSON.parse(JSON.parse(this.res.resdata.objDeed)[0].JSON_DOC)[0];

                    this.deedLockForm = {
                        deedId: deed.deedId,
                        deedNo: deed.deedNo,
                        deedDate: this._conversion.DateConvert(deed.deedDate),

                        divisionName: deed.divisionName,
                        districtName: deed.districtName,
                        thanaName: deed.thanaName,
                        mouzaName: deed.mouzaName,
                        registryOfficeName: deed.registryOfficeName,
                        landOfficeName: deed.landOfficeName,

                        holdingNo: deed.holdingNo,
                        landClass: deed.landClass,

                        khatianCS: deed.khatianCS,
                        khatianSA: deed.khatianSA,
                        khatianDR: deed.khatianDR,
                        khatianRS: deed.khatianRS,
                        khatianBS: deed.khatianBS,

                        dagCS: deed.dagCS,
                        dagSA: deed.dagSA,
                        dagDR: deed.dagDR,
                        dagRS: deed.dagRS,
                        dagBS: deed.dagBS,

                        mutationKhatianNo: deed.mutationKhatianNo,
                        mutationJotNo: deed.mutationJotNo,

                        latitude: deed.latitude,
                        longitude: deed.longitude,
                    };

                    this.openSetLocationModaDialog();
                }
            }, error => {
                console.log(error);
            });
    }

    reset() {
        this.deedDocForm = this.formBuilder.group({
            deedId: new FormControl(null),
            deedNo: new FormControl(null, Validators.required),
            deedDate: new FormControl(this._conversion.Today(), Validators.required),
            deedNoVia: new FormControl(null),
            caseNo: new FormControl(null),

            projectId: new FormControl(null),
            categoryId: new FormControl(null),
            subCategoryIds: new FormControl(null),

            deedReceiver: new FormControl('', Validators.required),
            deedSender: new FormControl('', Validators.required),

            divisionId: new FormControl('3'),
            districtId: new FormControl('1'),
            thanaId: new FormControl(null),
            mouzaId: new FormControl(null),
            registryOfficeId: new FormControl(null),
            landOfficeId: new FormControl(null),

            holdingNo: new FormControl(null),
            landClass: new FormControl(null),

            khatianCS: new FormControl(null),
            khatianSA: new FormControl(null),
            khatianDR: new FormControl(null),
            khatianRS: new FormControl(null),
            khatianBS: new FormControl(null),

            dagCS: new FormControl(null),
            dagSA: new FormControl(null),
            dagDR: new FormControl(null),
            dagRS: new FormControl(null),
            dagBS: new FormControl(null),

            totalLandInDag: new FormControl(null),
            purchasedLand: new FormControl(null),
            purchaseAmount: new FormControl(null),

            mutatedLand: new FormControl(null),
            notMutatedLand: new FormControl(null),
            mutationKhatianNo: new FormControl(null),
            mutationJotNo: new FormControl(null),

            ldTaxAmount: new FormControl(null),
            remarks: new FormControl(null),

            latitude: new FormControl(null),
            longitude: new FormControl(null),

            basePath: new FormControl(this.cmnEntity.menuPath),
            isActive: new FormControl(true),
            isPosted: new FormControl(false)
        });

        // this.receiverList=[];
        // this.senderList=[];
        if (this._fileInput != undefined) {
            this._fileInput.nativeElement.value = "";
        }

        this.isReportShowOnSubmit = false;
        this.isAllChecked = false;
        //this.strDeedReceiver = '';
        this.deedReceiverList = [];

        this.isSndrAllChecked = false;
        //this.strDeedSender = '';
        this.deedSenderList = [];

        this.docTypeId = '';
        this.registryOfficeList = [];
        this.thanaList = [];
        this.docList = [];
        //this.imageSrc = undefined;
        this.resmessage = null;

        this.districtsId = '';
        this.thanasId = '';
        this.mouzasId = '';
        this.postedId = '0';

        this.getInitThanaAndRegOfficeById('1');
        $('#deedName').focus();
    }

    //Get Upload Type
    public docTypeId: string = '';
    public uploadTypeList: any = [];
    public _getUploadTypeUrl: string = 'dropdown/getalluploadtype';
    getUploadType() {
        debugger;
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getUploadTypeUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listUploadType != '') {
                    var itemList = this.res.resdata.listUploadType;
                    itemList.forEach(item => {
                        list.push({ id: item.typeId.toString(), text: item.typeName });
                    });

                    this.uploadTypeList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Upload Type

    //Get Land Project   
    public landProjectId: string = '';
    public landProjectList: any = [];
    public _getLandProjectUrl: string = 'dropdown/getalllandproject';
    getAllLandProject() {
        debugger;
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getLandProjectUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listLandProject != '') {
                    var itemList = this.res.resdata.listLandProject;
                    itemList.forEach(item => {
                        list.push({ id: item.projectId.toString(), text: item.projectName });
                    });

                    this.landProjectList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Land Project

    //Get Land Category   
    public landCategoryId: string = '';
    public landCategoryList: any = [];
    public _getLandCategoryUrl: string = 'dropdown/getalllandcategories';
    getAllLandCategory() {
        debugger;
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getLandCategoryUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listLandCategories != '') {
                    var itemList = this.res.resdata.listLandCategories;
                    itemList.forEach(item => {
                        list.push({ id: item.categoryId.toString(), text: item.categoryName });
                    });

                    this.landCategoryList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Land Category

    //Get Land Sub Category   
    public landSubCategoryIds: any = [];
    public landSubCategoryId: string = '';
    public landSubCategoryList: any = [];
    public landSubCategoryHoldList: any = [];
    public _getLandSubCategoryUrl: string = 'dropdown/getalllandsubcategories';
    getAllLandSubCategory() {
        debugger;
        var param = { strId: '' };
        var apiUrl = this._getLandSubCategoryUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listLandSubCategories != '') {
                    // var itemList = this.res.resdata.listLandSubCategories;
                    // // this.landSubCategoryList = list;
                    this.landSubCategoryHoldList = this.res.resdata.listLandSubCategories;
                    // this.landSubCategoryIds = [];

                    // var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
                    // var itemList = this.landSubCategoryHoldList;//.filter(x => x.categoryId == catId);
                    // itemList.forEach(item => {
                    //     list.push({ id: item.subCategoryId.toString(), text: item.subCategoryName });
                    // });

                    // this.landSubCategoryList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Land Sub Category

    //Get Sub Category by category id
    getSubCatByCatId(catId: string, isNew: boolean) {
        debugger;
        this.landSubCategoryIds = [];
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var itemList = this.landSubCategoryHoldList.filter(x => x.categoryId == catId);
        itemList.forEach(item => {
            list.push({ id: item.subCategoryId.toString(), text: item.subCategoryName });
        });

        this.landSubCategoryList = list;
    }
    //Get Sub Category

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
    public registryOfficeList: any = [];
    public thanaList: any = [];
    public _getThanaUrl: string = 'dropdown/getthanabyid';
    getInitThanaAndRegOfficeById(districtId) {
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
                    this.registryOfficeList = list;
                }
            }, error => {
                console.log(error);
            });
    }

    getThanaAndRegOfficeById(districtId) {
        var thanastt: any = this._thanaState;
        var tasksMode: boolean = thanastt.zone.hasPendingMacrotasks;
        var nestingCount: number = thanastt.zone._nesting;
        if (nestingCount == 1) {

            this.thanaList = [];
            this.registryOfficeList = [];

            if (!this.cmnEntity.isEdit && !this.cmnEntity.isViewOnly) {
                this.deedDocForm.controls.thanaId.setValue(null);
                this.deedDocForm.controls.registryOfficeId.setValue(null);
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
                        this.registryOfficeList = list;
                    }
                }, error => {
                    console.log(error);
                });
        }
    }
    //Get Thana

    // //Get Registry Office
    // public registryOfficeList: any = [];
    // public _getRegistryOfficeUrl: string = 'dropdown/getregistryofficebyid';
    // getInitRegistryOfficeById(districtId) {
    //     var list: Array<{ id, text, nameEn }> = [{ id: '', text: "AbyMÖn K‡i wbe©vPb Kiæb", nameEn: '' }];
    //     var param = { strId: districtId };
    //     var apiUrl = this._getRegistryOfficeUrl;
    //     this._dataservice.getWithMultipleModel(apiUrl, param)
    //         .subscribe(response => {
    //             this.res = response;
    //             if (this.res.resdata.listRegistryOffice != '') {
    //                 var itemList = this.res.resdata.listRegistryOffice;
    //                 itemList.forEach(item => {
    //                     list.push({ id: item.id, text: item.nameEn, nameEn: item.nameEn });
    //                 });

    //                 this.registryOfficeList = list;
    //             }
    //         }, error => {
    //             console.log(error);
    //         });
    // }

    // getRegistryOfficeById(districtId) {
    //     var regstt: any = this._regState;
    //     var tasksMode: boolean = regstt.zone.hasPendingMacrotasks;
    //     var nestingCount: number = regstt.zone._nesting;
    //     if (nestingCount == 1) {
    //         var list: Array<{ id, text, nameEn }> = [{ id: '', text: "AbyMÖn K‡i wbe©vPb Kiæb", nameEn: '' }];
    //         var param = { strId: districtId };
    //         var apiUrl = this._getRegistryOfficeUrl;
    //         this._dataservice.getWithMultipleModel(apiUrl, param)
    //             .subscribe(response => {
    //                 this.res = response;
    //                 if (this.res.resdata.listRegistryOffice != '') {
    //                     var itemList = this.res.resdata.listRegistryOffice;
    //                     itemList.forEach(item => {
    //                         list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
    //                     });

    //                     this.registryOfficeList = list;
    //                 }
    //             }, error => {
    //                 console.log(error);
    //             });
    //     }
    // }
    // //Get Registry Office

    //Get Registry Office

    //Get Mouza
    public mouzaList: any = [];
    public _getMouzaUrl: string = 'dropdown/getmouzabyid';
    getMouzaId(thanaId) {
        var moustt: any = this._mouzaState;
        var tasksMode: boolean = moustt.zone.hasPendingMacrotasks;
        var nestingCount: number = moustt.zone._nesting;
        if (nestingCount == 1) {
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

    //Get All Receiver
    public ownerList: any = [];
    public _getOwnerUrl: string = 'dropdown/getallowner';
    getAllOwner() {
        debugger;
        var param = { strId: '' };
        var apiUrl = this._getOwnerUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listOwner != '') {
                    this.ownerList = this.res.resdata.listOwner;

                    var owner = this.ownerList.filter(x => x.isChecked);
                    if (owner.length > 0 && this.deedReceiverList.length == 0) {
                        owner.forEach(item => {
                            this.deedReceiverList.push({
                                id: item.id,
                                nameEn: item.nameEn,
                                nameBn: item.nameBn,
                                addressEn: item.addressEn,
                                addressBn: item.addressBn,
                                isGong: item.isGong,
                                isChecked: item.isChecked
                            });
                        });
                    } else {
                        this.deedReceiverList.forEach(item => {
                            var ownerModel = this.ownerList.filter(x => x.id == item.id)[0];
                            ownerModel.isChecked = item.isChecked;
                            ownerModel.isGong = item.isGong;
                        });
                    }

                    this.setRcvrCheckIfChecked();

                    this.openReceiverModaDialog();
                }
            }, error => {
                console.log(error);
            });
    }
    //Get All Receiver

    //Get All Sender    
    scrolltop: number = null;
    public sellerList: any = [];
    public _getSellerUrl: string = 'dropdown/getallseller';
    getAllSeller(pageNumber: number, pageSize: number, isScroll: boolean, isPaging: boolean) {
        debugger;
        this.settings.loadingSpinnerOnAction = true;
        var param = { pageNumber: pageNumber, pageSize: pageSize, isPaging: isPaging };
        var apiUrl = this._getSellerUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                this.settings.loadingSpinnerOnAction = false;
                debugger;
                if (this.res.resdata.listSeller != '') {
                    var ressel = JSON.parse(this.res.resdata.listSeller)

                    ressel.forEach(item => {
                        item.isGong = item.isGong == '1' ? true : false
                        item.isChecked = false;
                    });

                    //New Code
                    if (isScroll) {
                        ressel.forEach(item => {
                            this.sellerList.push({
                                id: item.id,
                                nameEn: item.nameEn,
                                nameBn: item.nameBn,
                                addressEn: item.addressEn,
                                addressBn: item.addressBn,
                                isGong: item.isGong,
                                isChecked: item.isChecked
                            });
                        });

                    } else {
                        this.sellerList = ressel;
                    }
                    //New Code
                    //prev code
                    // this.sellerList = ressel;

                    var seller = this.sellerList.filter(x => x.isChecked);
                    if (seller.length > 0 && this.deedSenderList.length == 0) {
                        seller.forEach(item => {
                            this.deedSenderList.push({
                                id: item.id,
                                nameEn: item.nameEn,
                                nameBn: item.nameBn,
                                addressEn: item.addressEn,
                                addressBn: item.addressBn,
                                isGong: item.isGong,
                                isChecked: item.isChecked
                            });
                        });
                    } else {
                        this.deedSenderList.forEach(item => {
                            var rcvrModel = this.sellerList.filter(x => x.id == item.id)[0];
                            if (rcvrModel != undefined) {
                                rcvrModel.isChecked = item.isChecked;
                                rcvrModel.isGong = item.isGong;
                            }
                        });
                    }

                    this.filteredData = this.sellerList;

                    this.setSndrCheckIfChecked();

                    //new code
                    if (!isScroll && isPaging) {
                        this.openSenderModaDialog();
                    }
                    //new code

                    //prev code
                    // this.openSenderModaDialog();
                }
            }, error => {
                console.log(error);
            });
    }

    onScroll(event: any) {
        debugger;
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
            if (this.sellerList[0].ttlRow != this.sellerList.length) {
                this.getAllSeller(this.sellerList.length, 10, true, true);
            }
        }
    }

    loadSellerAll() {
        this.getAllSeller(this.sellerList.length, 10, false, false);
    }

    @ViewChild('scrollMe') myScrollContainer: ElementRef;
    scrollToBottom(): void {
        debugger;
        try {
            this.scrolltop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
    //Get All Sender
    public filteredData = [];
    filterOnSide(event) {
        // get the value of the key pressed and make it lowercase
        const val = event.target.value.toLowerCase();
        // get the amount of columns in the table
        const colsAmt = 1;//this.columns.length;
        // get the key names of each column in the dataset
        const keys = Object.keys(this.filteredData[0]);
        // assign filtered matches to the active datatable
        this.sellerList = this.filteredData.filter(function (item) {
            // iterate through each row's column data
            for (let i = 0; i < colsAmt; i++) {
                // check for a match
                if (
                    item.nameBn.indexOf(val) !== -1 ||
                    !val
                ) {
                    // found match, return true to add to result set
                    return true;
                }
            }
        });
        // whenever the filter changes, always go back to the first page
        //this.pages.offset = 0;
    }

    //   filterOnSide1(event) {
    //     // get the value of the key pressed and make it lowercase
    //     const val = event.target.value.toLowerCase();
    //     // get the amount of columns in the table
    //     const colsAmt = 7;//this.columns.length;
    //     // get the key names of each column in the dataset
    //     const keys = Object.keys(this.filteredData[0]);
    //     // assign filtered matches to the active datatable
    //     this.sellerList = this.filteredData.filter(function (item) {
    //       // iterate through each row's column data
    //       for (let i = 0; i < colsAmt; i++) {
    //         // check for a match
    //         if (
    //           item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 ||
    //           !val
    //         ) {
    //           // found match, return true to add to result set
    //           return true;
    //         }
    //       }
    //     });
    //     // whenever the filter changes, always go back to the first page
    //     //this.pages.offset = 0;
    //   }

    //Set Deed Receiver
    public deedReceiverList: any = [];
    //public strDeedReceiver: string = '';
    @ViewChild('modalReceiver') _modalReceiver: TemplateRef<any>;
    private _rcvrDialogRef: MatDialogRef<TemplateRef<any>>;
    openReceiverModaDialog(): void {
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '40%';
        _config.panelClass = 'modalTopPosition';

        // if(this.receiverList.length==0 && this.deedReceiverList.length==0){
        //     this.getOwnerDataFromTemp();
        // }

        this._rcvrDialogRef = this.dialog.open(this._modalReceiver, _config);
        this._rcvrDialogRef.afterClosed().subscribe(result => {
        });
    }

    public isAllChecked: boolean = false;
    addAllRcvrToList() {
        if (this.isAllChecked) {
            this.ownerList.forEach(item => {
                item.isChecked = true;
                this.deedReceiverList.push({
                    id: item.id,
                    nameEn: item.nameEn,
                    nameBn: item.nameBn,
                    addressEn: item.addressEn,
                    addressBn: item.addressBn,
                    isGong: item.isGong,
                    isChecked: item.isChecked
                });
            });
        } else {
            this.ownerList.forEach(item => {
                item.isChecked = false;
                this.deedReceiverList = [];
            });
        }

        //this.strDeedReceiver = '';
        this.deedDocForm.controls.deedReceiver.setValue('');
        if (this.deedReceiverList.length > 0) {
            var rcvNameList = [];
            this.deedReceiverList.forEach(item => {
                rcvNameList.push(item.nameBn);
            });

            var strDeedReceiver = rcvNameList.join(', ');
            this.deedDocForm.controls.deedReceiver.setValue(strDeedReceiver);
            //this.strDeedReceiver = rcvNameList.join(', ');
        }
    }

    addRcvrToList(item, sl) {

        item.isChecked = item.isChecked ? false : true;

        if (item.isChecked) {
            if (this.deedReceiverList.length > 0) {
                var exRecvr = this.deedReceiverList.filter(x => x.id == item.id);

                if (exRecvr.length == 0) {
                    this.deedReceiverList.push({
                        id: item.id,
                        nameEn: item.nameEn,
                        nameBn: item.nameBn,
                        addressEn: item.addressEn,
                        addressBn: item.addressBn,
                        isGong: item.isGong,
                        isChecked: item.isChecked
                    });
                } else {
                    this._msg.info('Already exists');
                }

            } else {
                this.deedReceiverList.push({
                    id: item.id,
                    nameEn: item.nameEn,
                    nameBn: item.nameBn,
                    addressEn: item.addressEn,
                    addressBn: item.addressBn,
                    isGong: item.isGong,
                    isChecked: item.isChecked
                });
            }
        }
        else {
            if (this.deedReceiverList.length > 0) {
                var exRecvr = this.deedReceiverList.filter(x => x.id == item.id);
                this.deedReceiverList.splice(this.deedReceiverList.indexOf(exRecvr), 1);
            }
        }

        this.setRcvrCheckIfChecked();
    }

    setRcvrCheckIfChecked() {
        this.isAllChecked = false;
        var chkModel = this.ownerList.filter(x => !x.isChecked)[0];
        if (chkModel == undefined) {
            this.isAllChecked = true;
        }

        //this.strDeedReceiver = '';
        this.deedDocForm.controls.deedReceiver.setValue('');
        if (this.deedReceiverList.length > 0) {
            var rcvNameList = [];
            this.deedReceiverList.forEach(item => {
                rcvNameList.push(item.nameBn);
            });

            var strDeedReceiver = rcvNameList.join(', ');
            this.deedDocForm.controls.deedReceiver.setValue(strDeedReceiver);
        }
    }

    setRcvrGong(item) {

        item.isGong = item.isGong ? false : true;

        var uOwnerList = this.ownerList.filter(x => x.id != item.id);
        uOwnerList.forEach(items => {
            items.isGong = false;
        });

        if (this.deedReceiverList.length > 0) {
            var rcvr = this.deedReceiverList.filter(x => x.id == item.id)[0];
            if (rcvr != undefined) {
                rcvr.isGong = item.isGong;
            }
        }
    }
    //Set Deed Receiver

    //Set Deed Sender    
    public deedSenderList: any = [];
    //public strDeedSender: string = '';
    @ViewChild('modalSender') _modalSender: TemplateRef<any>;
    private _sndrDialogRef: MatDialogRef<TemplateRef<any>>;
    openSenderModaDialog(): void {
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '40%';
        _config.panelClass = 'modalTopPosition';

        // if(this.receiverList.length==0 && this.deedReceiverList.length==0){
        //     this.getOwnerDataFromTemp();
        // }

        this._sndrDialogRef = this.dialog.open(this._modalSender, _config);
        this._sndrDialogRef.afterClosed().subscribe(result => {
        });
    }

    public isSndrAllChecked: boolean = false;
    addAllSndrToList() {
        if (this.isAllChecked) {
            this.sellerList.forEach(item => {
                item.isChecked = true;
                this.deedSenderList.push({
                    id: item.id,
                    nameEn: item.nameEn,
                    nameBn: item.nameBn,
                    addressEn: item.addressEn,
                    addressBn: item.addressBn,
                    isGong: item.isGong,
                    isChecked: item.isChecked
                });
            });
        } else {
            this.sellerList.forEach(item => {
                item.isChecked = false;
                this.deedSenderList = [];
            });
        }

        //this.strDeedSender = '';
        this.deedDocForm.controls.deedSender.setValue('');
        if (this.deedSenderList.length > 0) {
            var sndrNameList = [];
            this.deedSenderList.forEach(item => {
                sndrNameList.push(item.nameBn);
            });

            var strDeedSender = sndrNameList.join(', ');
            this.deedDocForm.controls.deedSender.setValue(strDeedSender);
        }
    }

    addSndrToList(item, sl) {
        debugger;
        item.isChecked = item.isChecked ? false : true;

        if (item.isChecked) {
            if (this.deedSenderList.length > 0) {
                var exSndr = this.deedSenderList.filter(x => x.id == item.id);

                if (exSndr.length == 0) {
                    this.deedSenderList.push({
                        id: item.id,
                        nameEn: item.nameEn,
                        nameBn: item.nameBn,
                        addressEn: item.addressEn,
                        addressBn: item.addressBn,
                        isGong: item.isGong,
                        isChecked: item.isChecked
                    });
                } else {
                    this._msg.info('Already exists');
                }

            } else {
                this.deedSenderList.push({
                    id: item.id,
                    nameEn: item.nameEn,
                    nameBn: item.nameBn,
                    addressEn: item.addressEn,
                    addressBn: item.addressBn,
                    isGong: item.isGong,
                    isChecked: item.isChecked
                });
            }
        }
        else {
            if (this.deedSenderList.length > 0) {
                var exSndr = this.deedSenderList.filter(x => x.id == item.id);
                this.deedSenderList.splice(this.deedSenderList.indexOf(exSndr), 1);
            }
        }

        this.setSndrCheckIfChecked();
    }

    setSndrCheckIfChecked() {
        this.isSndrAllChecked = false;
        var chkModel = this.sellerList.filter(x => !x.isChecked)[0];
        if (chkModel == undefined) {
            this.isSndrAllChecked = true;
        }

        //this.strDeedSender = '';
        this.deedDocForm.controls.deedSender.setValue('');
        if (this.deedSenderList.length > 0) {
            var sndrNameList = [];
            this.deedSenderList.forEach(item => {
                sndrNameList.push(item.nameBn);
            });

            var strDeedSender = sndrNameList.join(', ');
            this.deedDocForm.controls.deedSender.setValue(strDeedSender);
        }
    }

    setSndrGong(item) {

        item.isGong = item.isGong ? false : true;

        var uRcvrList = this.sellerList.filter(x => x.id != item.id);
        uRcvrList.forEach(items => {
            items.isGong = false;
        });

        if (this.deedSenderList.length > 0) {
            var rcvr = this.deedSenderList.filter(x => x.id == item.id)[0];
            if (rcvr != undefined) {
                rcvr.isGong = item.isGong;
            }
        }
    }
    //Set Deed Sender

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

        // if(this.receiverList.length==0 && this.deedReceiverList.length==0){
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
        this.deedDocForm.controls[mName].setValue(models);
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
    //Get Mouzas
    public postedId: string = '0';
    public postingList: any = [{ id: '0', text: 'সব' }, { id: '1', text: 'আনপোষ্টেড' }, { id: '2', text: 'পোষ্টেড' }];
    //Filter Master List

    //Document Upload
    private fileSrc;
    public docList: any = [];
    public docHoldList: any = [];
    public IsDocAddDisabled: boolean = true;
    public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf"];
    //public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "csv", "xls", "xlsx", "ppt", "pptx"];

    onFileChange() {
        debugger;
        this.IsDocAddDisabled = true;
        this.docHoldList = [];
        //var fileInfo=this._fileInput;
        //let reader = new FileReader();
        if (this._fileInput.nativeElement.files.length > 0) {
            for (var i = 0; i < this._fileInput.nativeElement.files.length; i++) {

                let file = this._fileInput.nativeElement.files[i];

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

                    var typeName = '';
                    var upModel = this.uploadTypeList.filter(x => x.id == this.docTypeId)[0];
                    if (upModel != undefined) {
                        typeName = upModel.text;
                    }

                    this.docHoldList.push({
                        documentId: 0,
                        referenceId: this.deedDocForm.controls.deedId.value,
                        inputName: '',
                        inputNumber: '',
                        inputTypeId: this.docTypeId.toString(),
                        inputType: typeName,
                        inputOthers: '',
                        originalDocName: file.name,
                        documentName: file.name,
                        documentType: extlwr,
                        documentSize: fileSize,
                        attachedfile: file,
                        documentPath: this.cmnEntity.menuPath,
                        basePath: '',
                        documentFullPath: '',
                        virtualPath: this.fileSrc.changingThisBreaksApplicationSecurity,
                        remarks: '',
                        isActive: true,
                        isCancel: false,
                        createBy: this.cmnEntity.userId
                    });

                    //this.IsDocAddDisabled = false;
                }
            };

            this.IsDocAddDisabled = this.docHoldList.length > 0 ? false : true;
        }

    }

    addDocumnet() {
        this.docHoldList.forEach(item => {
            this.docList.push({
                documentId: item.documentId,
                referenceId: item.referenceId,
                inputName: item.inputName,
                inputNumber: item.inputNumber,
                inputTypeId: item.inputTypeId,
                inputType: item.inputType,
                inputOthers: item.inputOthers,
                originalDocName: item.originalDocName,
                documentName: item.documentName,
                documentType: item.documentType,
                documentSize: item.documentSize,
                attachedfile: item.attachedfile,
                documentPath: item.documentPath,
                basePath: item.basePath,
                documentFullPath: item.documentFullPath,
                virtualPath: item.virtualPath,
                remarks: item.remarks,
                isActive: item.isActive,
                isCancel: item.isCancel,
                createBy: item.createBy
            });
        });

        this.docHoldList = [];
        this._fileInput.nativeElement.value = "";
        this.IsDocAddDisabled = true;
    }

    delectDocument(index, item) {
        if (item.documentId == 0) {
            this.docList.splice(index, 1);
        }
        else {
            item.isCancel = item.isCancel == false ? true : false;
        }
    }

    viewDocument(item) {
        this._conversion.viewDocument(item.virtualPath);
    }

    downloadDocument(item) {
        this._conversion.downloadDocument(item.docVpath);
    }
    //Document Upload

    public dialogConfig: any;
    //Confirm modal
    openModal(item, index) {
        this.cmnEntity.funcIndex = index;
        //this.dialogConfig.backdropClass='backdropBackground';
        //this.dialogConfig.width='30%';        
        this.dialogConfig.data = {
            funcName: this.cmnEntity.cmnBtn[index].btnFunc
            , custMessage: this.cmnEntity.cmnBtn[index].message + ' ' + item.deedNo.toString()
            , isDualAction: this.cmnEntity.cmnBtn[index].isDual
            , model: item
        };

        this.dialogConfig.hasBackdrop = true;
        this.dialogConfig.disableClose = true;
        this.dialogConfig.panelClass = 'confirm-modal';

        const dialogRef = this.dialog.open(ConfirmModal, this.dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            debugger;
            if (result != '' && result != undefined) {
                var rs = result;
                rs.func = rs.funcName;
                this.cmnbtnAction(rs);

                // if(this.modelIndex==1 || this.modelIndex==2){
                //     this.cmnEntity.isEdit=false; this.cmnEntity.isViewOnly=false; 
                // }
            }
        });

        // dialogRef.backdropClick().subscribe(result=>{
        //     debugger;
        //     this.dialog.closeAll();
        // });
    }

    // //Googl Map Modal
    // @ViewChild('modalGMap') _modalGMap: TemplateRef<any>;
    // private _gMapDialogRef: MatDialogRef<TemplateRef<any>>;
    // openGMapModaDialog(): void {
    //     const _config = new MatDialogConfig();
    //     _config.restoreFocus = false;
    //     _config.autoFocus = false;
    //     _config.role = 'dialog';
    //     _config.width = '70%';
    //     //_config.panelClass = 'modalTopPosition';

    //     // if(this.receiverList.length==0 && this.deedReceiverList.length==0){
    //     //     this.getOwnerDataFromTemp();
    //     // }
    //     debugger;
    //     this._gMapDialogRef = this.dialog.open(this._modalGMap, _config);

    //     var lat = this.deedDocForm.controls.latitude.value;
    //     var lon = this.deedDocForm.controls.longitude.value;
    //     //this._conversion.promtGMap(lat, lon);

    //     // var map = $("googleMap").val();
    //     // debugger;
    //     //$("#gapiloc").html("<iframe id='ifrm' src=\"https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=" + lat + ',' + lon + "&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed\" height=\"500\" style='width:100%' ></iframe>");

    //     // $("#gapiloc").html("<iframe id='ifrm' src=\"http://maps.googleapis.com/maps/api/js?key=AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM&sensor=false&output=embed\" height=\"500\" style='width:100%' ></iframe>");

    //     // $(document).ready(function () {
    //     var gmarkers = [];
    //     var map;
    //     //     debugger;
    //     //     function initialize() {


    //     //}

    //     google.maps.event.addDomListener(window, 'load', this.initialize());
    //     // })

    //     debugger;
    //     //var dd:any = document.getElementById('ifrm');
    //     //var dds=dd.src;
    //     // //var cc=window.frames['ifrm'].document.body
    //     // var content = $("ifrm").contents().find('body').html();
    //     // debugger;
    //     this._gMapDialogRef.afterClosed().subscribe(result => {
    //     });
    // }

    // //gmarkers:any=[];
    // initialize() {
    //     let value: any = { Flag: 'Bangladesh', Latitude: '23.794959', Longitude: '90.411597', CompanyName: 'City Group', Location: 'Gulshan' };
    //     var gmarkers = [];
    //     var map;
    //     var mapProp = {
    //         center: new google.maps.LatLng(23.794959, 90.411597), //India Lat and Lon
    //         zoom: 18,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //     };
    //     map = new google.maps.Map(document.getElementById("googleMap"), mapProp);


    //     for (var i = 0; i < gmarkers.length; i++) {
    //         gmarkers[i].setMap(null);
    //     }

    //     var latlng = new google.maps.LatLng(value.Latitude, value.Longitude);
    //     var flag = value.Flag;
    //     //var contentString = '<div ><p>Mission Name:' + value.Name + '</p><p>Latitude: ' + value.Latitude + '</p><p>Longitude: ' + value.Longitude + '</p></div>';
    //     var contentString = '<div>Company Name:' + value.CompanyName + '<br/>Location:' + value.Location + '<br/>Latitude: ' + value.Latitude + '<br/>Longitude: ' + value.Longitude + '</div>';
    //     var marker = new google.maps.Marker({
    //         position: latlng,
    //         // icon: "../Content/img/" + flag,
    //         icon: "./assets/img/map/pins.png",
    //         // icon: {
    //         //     path: './assets/img/map/pin.png',
    //         //     strokeColor: "blue",
    //         //     scale: 5
    //         // },        
    //         map: map
    //     });
    //     var infowindow = new google.maps.InfoWindow({
    //         content: contentString
    //     });

    //     gmarkers.push(marker);

    //     //marker.addListener('click', function () {
    //     //    infowindow.open(map, marker);
    //     //});

    //     marker.addListener('click', function () {
    //         infowindow.open(map, this);
    //     });
    // }
    // //Googl Map Modal

    // openGmap() {
    //     var latLong: any = { latitude: '23.794959', longitude: '90.411597' };
    //     this.gmap.load(latLong);
    // }

    //Self Activity Modal
    public today: string = '';
    public entryMenuId: string = 'T_LAND_DEED';
    public listUserActivity: any = [];
    public _getActivityUrl: string = 'userDashboard/getallentryuseractivity';
    getAllUserActivity(isNew: boolean) {
        debugger;
        var param = { strId: this.entryMenuId, strId2: this.cmnEntity.userId, strId3: this.today == '' ? null : this.today };
        var apiUrl = this._getActivityUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listUserActivity != '') {
                    var itemList = JSON.parse(this.res.resdata.listUserActivity);
                    var itemLists = itemList.filter(x => x.entryUserId != '08776' && x.entryUserId != '06182');
                    this.listUserActivity = itemLists;

                    if (isNew) {
                        this.openSelfActivityModaDialog();
                    }
                } else {
                    this.listUserActivity = [];
                }
            }, error => {
                console.log(error);
            });
    }

    @ViewChild('modalSelfActivity') _modalSelfActivity: TemplateRef<any>;
    private _selfActivityDialogRef: MatDialogRef<TemplateRef<any>>;
    openSelfActivityModaDialog(): void {
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '70%';
        //_config.panelClass = 'modalTopPosition';

        // if(this.receiverList.length==0 && this.deedReceiverList.length==0){
        //     this.getOwnerDataFromTemp();
        // }
        //this.getAllUserActivity();
        this._selfActivityDialogRef = this.dialog.open(this._modalSelfActivity, _config);
        this._selfActivityDialogRef.afterClosed().subscribe(result => {
        });
    }
    //Self Activity Modal

    //Get Current Location
    getLocation(frm: any, isSetVal: boolean) {
        debugger;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (isSetVal) {
                        frm.controls.latitude.setValue(position.coords.latitude);
                        frm.controls.longitude.setValue(position.coords.longitude);
                    } else {
                        frm.latitude = position.coords.latitude;
                        frm.longitude = position.coords.longitude;
                    }
                    // console.log("Latitude: ", position.coords.latitude);
                    // console.log("Longitude: ", position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }
    //Get Current Location

    //Set Geo Location Modal
    @ViewChild('modalSetLocation') _modalSetLocation: TemplateRef<any>;
    private _setLocationDialogRef: MatDialogRef<TemplateRef<any>>;
    openSetLocationModaDialog(): void {
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '70%';
        // _config.height = '98%';
        this._setLocationDialogRef = this.dialog.open(this._modalSetLocation, _config);
        this._setLocationDialogRef.afterClosed().subscribe(result => {
        });
    }

    public _updateLocationUrl: string = 'deed/setdeedlocation';
    onSubmitLocation() {
        debugger;
        if (!this.deedLockForm.latitude || !this.deedLockForm.longitude) {
            return;
        }

        var param = [{ strId: this.deedLockForm.deedId, strId2: this.deedLockForm.latitude, strId3: this.deedLockForm.longitude }];
        var apiUrl = this._updateLocationUrl;
        this._dataservice.postMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.getListByPage(this.pageSize);
                    this._msg.success(this.resmessage);
                    this._setLocationDialogRef.close();
                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }

    // setLocation(frm: any) {
    //     this.locationService.getLocation().subscribe({
    //         next: (pos) => {
    //             frm.latitude = pos.coords.latitude;
    //             frm.longitude = pos.coords.longitude;
    //         },
    //         error: (err) => console.error(err)
    //     });
    // }
    //Set Geo Location Modal
}
