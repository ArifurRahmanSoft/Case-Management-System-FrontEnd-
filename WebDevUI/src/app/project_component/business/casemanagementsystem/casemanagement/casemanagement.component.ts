import { Component, OnInit, Inject, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../../api/api.conversion.service';
import { DataService } from '../../../../api/api.dataservice.service';
import { pathValidation } from '../../../../api/api.pathvlidation.service';
import { CommonService } from '../../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../../theme/components/commonpager/commonpager';
import { Options } from 'select2';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ReportViewer } from '../../../reportviewer/reportviewer';
import { ReportModel } from '../../../reportviewer/reportmodel';
import { ConfirmModal } from 'src/app/theme/components/modalconfirm/confirmmodal.component';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
// import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { error } from 'console';
//import { filter } from 'rxjs/operators';
//import { GMapModal } from '../../modal/map/gmap';
declare var $: any;
declare var google: any;

// @Pipe({
//     name: 'rowFilter'
// })

@Component({
    selector: 'app-casemanagement',
    templateUrl: './casemanagement.component.html',
    styleUrls: ['./casemanagement.component.scss'],
    providers: [Conversion]
})

export class CaseManagementComponent implements OnInit {
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
    public roleId = sessionStorage.getItem("roleId");
    public isAdvocate: boolean = false;
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
    public today: string = '';

    public district: string = '';
    public thana: string = '';
    public mouza: string = '';
    public court: string = '';
    public caseCstatus: string = '';
    public casePriority: string = ''





    public caseForm: FormGroup = new FormGroup({});
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
        this.createForm();
        this.getAllServey();
        this.getAllCaseType();
        this.getAllCourt();
        this.getAllCaseStatus();
        this.getAllCasePriority();
        this.getAllAdvocate();
        this.getAllHearingEvent();
        this.getAllPurchasers();
        this.getAllDistrict();
        this.getAllDistricts();
        this.getUploadType();
        this.getInitThanaAndRegOfficeById('1');
        this.getUserRole();
        $('#deedName').focus();
    }

    // radiotest() {
    //     this.caseForm.get('selectedSurvey')?.setValue('1');
    //     console.log("selected value", this.caseForm.value);
    // }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }


    getUserRole() {
        const loggedUserStr = sessionStorage.getItem('loggedUser');


        if (loggedUserStr) {
            const loggedUser = JSON.parse(loggedUserStr);
            const roleId = loggedUser.roleId;
            if (roleId == 9) {
                this.isAdvocate = true;
            } else {
                this.isAdvocate = false;
            }
        }
    }

    createForm() {
        this.caseForm = this.formBuilder.group({
            caseOid: new FormControl(null),
            caseNo: new FormControl(null, Validators.required),
            refCaseNo: new FormControl(null),
            caseType: new FormControl(null, Validators.required),
            casePriorityId: new FormControl(null, Validators.required),
            courtId: new FormControl(null, Validators.required),
            //caseDate: new FormControl(this._conversion.Today(), Validators.required),
            caseDate: new FormControl(null),
            districtId: new FormControl(null, Validators.required),
            thanaId: new FormControl(null, Validators.required),
            mouzaId: new FormControl(null, Validators.required),
            badi: new FormControl(null),
            bibadi: new FormControl(null),
            company: new FormControl(null),
            deedIds: new FormControl(null),
            deedNos: new FormControl(null),
            totalLand: new FormControl(null, Validators.required),
            selectedSurvey: new FormControl(null, Validators.required),
            caseDetails: new FormControl(null),
            currentStatusId: new FormControl(null, Validators.required),
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
            remarks: new FormControl(null),
            isActive: new FormControl(true),
        })
        //this.radiotest();
    }

    public caseTypeList: any = [];
    public _getCaseTypeUrl: string = 'dropdown/getallcasetype';
    getAllCaseType() {
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getCaseTypeUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response
                if (this.res.resdata.listCaseType != '') {
                    var itemList = this.res.resdata.listCaseType;
                    itemList.forEach(item => {
                        list.push({ id: item.caseId, text: item.caseBnName })
                    })
                    this.caseTypeList = list;
                }
            }, error => {
                console.log(error);
            })
    }

    public courtList: any = [];
    public _getCourtUrl: string = 'dropdown/getallcourt';
    getAllCourt() {
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getCourtUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response
                if (this.res.resdata.listCourt != '') {
                    var itemList = this.res.resdata.listCourt;
                    itemList.forEach(item => {
                        list.push({ id: item.courtId, text: item.courtBnName })
                    })
                    this.courtList = list;
                }
            }, error => {
                console.log(error);
            })
    }

    public caseStatusList: any = [];
    public _getCaseStatustUrl: string = 'dropdown/getallcasestatus';
    getAllCaseStatus() {
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getCaseStatustUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response
                if (this.res.resdata.listCaseStatus != '') {
                    var itemList = this.res.resdata.listCaseStatus;
                    itemList.forEach(item => {
                        list.push({ id: item.statusid, text: item.statusBnName })
                    })
                    this.caseStatusList = list;
                }
            }, error => {
                console.log(error);
            })
    }


    public casePriorityList: any = [];
    public _getCasepriotityUrl: string = 'dropdown/getallcasepriority';
    getAllCasePriority() {
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getCasepriotityUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response
                if (this.res.resdata.listCasePriority != '') {
                    var itemList = this.res.resdata.listCasePriority;
                    itemList.forEach(item => {
                        list.push({ id: item.priorityId, text: item.priorityBnName })
                    })
                    this.casePriorityList = list;
                }
            }, error => {
                console.log(error);
            })
    }

    public advoacateList: any = [];
    public _getAdvocateUrl: string = 'dropdown/getalladvocate';
    getAllAdvocate() {
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getAdvocateUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response
                if (this.res.resdata.listAdvocate != '') {
                    var itemList = this.res.resdata.listAdvocate;
                    itemList.forEach(item => {
                        list.push({ id: item.advocateOid, text: item.advocateBnName })
                    })
                    this.advoacateList = list;
                }
            }, error => {
                console.log(error);
            })
    }

    getAllDeedByParam(event: any) {
        debugger
        this.onMouzaSelectionChange(event)//for mouza id
        // this.caseForm.controls.mouzaId.setValue(event);
        this.getAllDeedById();

    }

    public DeedList: any = [];
    public _getDeedUrl: string = 'case/getdeedbyid';
    getAllDeedById() {
        debugger
        this.landDeedIds = '';
        this.DeedList = ''
        debugger
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        //let list: { id: string, text: string }[] = [];

        var param = {
            strId: this.caseForm.controls.districtId.value, strId2: this.caseForm.controls.thanaId.value,
            strId3: this.caseForm.controls.mouzaId.value, strId4: this.dagValue, strId5: this.selectDagName
        };
        var apiUrl = this._getDeedUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response
                if (this.res.resdata.deedList != '') {
                    let parsed = JSON.parse(this.res.resdata.deedList);
                    let deedArray = JSON.parse(parsed[0].JSON_DOC);
                    // if (deedArray != null) {
                    //     var itemList = deedArray;
                    //     itemList.forEach(item => {
                    //         list.push({ id: item.deedId.toString(), text: item.deedNoDate })
                    //     })
                    //     this.DeedList = list;
                    //     console.log("this deed list is ", this.DeedList)
                    // }
                    if (deedArray && deedArray.length) {
                        // ONLY add actual deed data, no placeholder
                        this.DeedList = deedArray.map(item => ({
                            id: item.deedId.toString(),
                            text: item.deedNoDate
                        }));
                    }

                }

            }, error => {
                console.log(error);
            })
    }






    public landDeedIds: any = [];
    getAllDeed() {
        debugger
        this.caseForm.controls.deedIds.setValue(null);
        this.caseForm.controls.deedNos.setValue(null);
        if (!this.landDeedIds) {
            return;
        }
        let selectedIds = this.landDeedIds;
        if (!Array.isArray(selectedIds)) {
            selectedIds = [selectedIds];
        }
        let idList: string[] = [];
        let textList: string[] = [];
        selectedIds.forEach(id => {
            let found = this.DeedList.find(x => x.id == id);
            if (found) {
                idList.push(found.id);
                textList.push(found.text);
            }
        });

        this.caseForm.controls.deedIds.setValue(idList.join(','));
        this.caseForm.controls.deedNos.setValue(textList.join(','));
    }


    mouzaIdLst: any;
    onMouzaSelectionChange(event: any) {
        debugger
        this.caseForm.controls.mouzaId.setValue(null);
        if (!this.mouzaIdLst) { return }

        let selectedIds = event;
        if (!Array.isArray(selectedIds)) {
            selectedIds = [selectedIds];
        }
        let idList: string[] = [];
        let textList: string[] = [];
        selectedIds.forEach(id => {
            let found = this.mouzasList.find(x => x.id == id);
            if (found) {
                idList.push(found.id);

            }
        });
        this.caseForm.controls.mouzaId.setValue(idList.join(','));
        console.log(" this.caseForm.controls.mouzaId----", this.caseForm.controls.mouzaId)

    }















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
                    console.log("Service list is ", this.serveyList)
                }
            }, error => {
                console.log(error);
            });
    }


    public hearingEventList: any = [];
    public _gethrgEvntUrl: string = 'dropdown/getallhearingevent';
    getAllHearingEvent() {
        debugger;
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._gethrgEvntUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listHearingEvent != '') {
                    var itemList = this.res.resdata.listHearingEvent;
                    itemList.forEach(item => {
                        list.push({ id: item.hearingEventOid.toString(), text: item.eventBnName });
                    });
                    this.hearingEventList = list;
                    console.log("Service list is ", this.hearingEventList)
                }
            }, error => {
                console.log(error);
            });
    }



    public purcharsList: any = [];
    public _getpurchaseUrl: string = 'dropdown/getallpurchars';
    getAllPurchasers() {
        debugger;
        var list: Array<{ id, text }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন" }];
        var param = { strId: '' };
        var apiUrl = this._getpurchaseUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listPurcahrs != '') {
                    var itemList = this.res.resdata.listPurcahrs;
                    itemList.forEach(item => {
                        list.push({ id: item.purcharsOid.toString(), text: item.purcharsBnName });
                    });
                    this.purcharsList = list;
                    console.log("Service list is ", this.purcharsList)
                }
            }, error => {
                console.log(error);
            });
    }


    //start fromn here 
    public hearingList: any = [];
    createHearingRow() {
        return {
            caseOid: null,
            hearingOid: null,
            hearingDate: null,
            hearingNxtDate: null,
            reasonNxtHearing: null,
            remarks: null,
        };
    }

    addHearingList() {
        this.hearingList.push(this.createHearingRow())
    }



    removeHearing(index: number) {
        debugger
        const isConfirm = confirm("Are you shure you want to Delete this item ?")
        if (isConfirm) {
            this.hearingList.splice(index, 1);
        }
    }

    showHearing() {
        console.log("this.hearingList", this.hearingList)
    }

    public advHearingList: any = [];
    createAdvHearingRow() {
        return {
            caseOid: null,
            advHearingOid: null,
            caseStatus: null,
            advocateOid: null,
            hearingNotes: null,
            expense: null,
            indexData: null,
            docVirtualPath: null

        };
    }

    addAdvHearingList() {
        const row = this.createAdvHearingRow();
        row.indexData = this.advHearingList.length + 1;
        this.advHearingList.push(row);
    }


    removeAdvHearing(index: number) {
        debugger
        const isConfirm = confirm("Are you shure you want to Delete this item ?")
        if (isConfirm) {
            this.advHearingList.splice(index, 1);
        }
    }

    public selectDagName: any
    onSurveyChange(event: any) {
        debugger
        this.selectDagName = event.target.value;
        if (this.selectDagName == 1) {
            this.dagValue = this.caseForm.controls.dagCS.value;
            this.getAllDeedById();
        }
        if (this.selectDagName == 2) {
            this.dagValue = this.caseForm.controls.dagSA.value;
            this.getAllDeedById();
        }
        if (this.selectDagName == 3) {
            this.dagValue = this.caseForm.controls.dagDR.value;
            this.getAllDeedById();
        }
        if (this.selectDagName == 4) {
            this.dagValue = this.caseForm.controls.dagRS.value;
            this.getAllDeedById();
        }
        if (this.selectDagName == 5) {
            this.dagValue = this.caseForm.controls.dagBS.value;
            this.getAllDeedById();
        }

        this.caseForm.get('selectedSurvey')?.setValue(this.selectDagName);
        if (this.selectDagName == this.dagName) {
            this.getAllDeedById();
        }
    }

    // public selectDagName: any
    // onSurveyChange(event: any) {
    //     debugger
    //     this.selectDagName = event.target.value;
    //     if (this.selectDagName == 1) {
    //         this.dagValue = this.getFormData.dagCS;
    //         this.getAllDeedById();
    //     }
    //     if (this.selectDagName == 2) {
    //         this.dagValue = this.getFormData.dagSA;
    //         this.getAllDeedById();
    //     }
    //     if (this.selectDagName == 3) {
    //         this.dagValue = this.getFormData.dagDR;
    //         this.getAllDeedById();
    //     }
    //     if (this.selectDagName == 4) {
    //         this.dagValue = this.getFormData.dagRS;
    //         this.getAllDeedById();
    //     }
    //     if (this.selectDagName == 5) {
    //         this.dagValue = this.getFormData.dagBS;
    //         this.getAllDeedById();
    //     }

    //     this.caseForm.get('selectedSurvey')?.setValue(this.selectDagName);
    //     if (this.selectDagName == this.dagName) {
    //         this.getAllDeedById();
    //     }
    // }

    public dagName: any;
    public dagValue: any;
    getDagNo(event: any) {
        debugger
        this.dagName = event.target.name;
        this.dagValue = event.target.value;
        // this.dagValue=this.dagValue.split(',').map(x=>x.trim()).join('|')
        if (this.selectDagName == this.dagName) {
            this.getAllDeedById();
        }

    }






    public fileList: any[] = [];
    public advDocInfoList: any[] = [];
    onCertifiedFileChange(item: any, event: any, index: number): void {
        debugger
        const file = event.target.files[0] || null;
        const currentRow = index + 1;
        if (file) {
            this.advDocInfoList.push({ documentId: 0, ocId: item.certifiedCopyOid, row: currentRow, attachedfile: file })
            //this.advHearingList.at(index).get('document')?.setValue(file);
            console.log("this.fileList=>", this.fileList);
        } else {
            this.advDocInfoList[index] = null;
            this.advHearingList.at(index).get('document')?.setValue(null);
        }
    }




    //Document Upload
    private fileSrc: any;
    public docListCase: any = [];
    public docHoldList: any = [];
    public IsDocAddDisabled: boolean = true;
    public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf"];
    //public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "csv", "xls", "xlsx", "ppt", "pptx"];

    onFileChange() {
        debugger;
        this.IsDocAddDisabled = true;
        this.docHoldList = [];
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
                        referenceId: this.caseForm.controls.caseOid.value,
                        inputName: '',
                        inputNumber: '',
                        //inputTypeId: this.docTypeId.toString(),
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
            this.docListCase.push({
                documentId: item.documentId,
                referenceId: item.referenceId,
                inputName: item.inputName,
                inputNumber: item.inputNumber,
                //inputTypeId: item.inputTypeId,
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
            this.docListCase.splice(index, 1);
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










    //end here











    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }




    public responseTag: string = 'listCase';
    public caseList: any = [];
    public caseLists: any = [];
    public _listByPageUrl: string = 'case/getbypage';
    getListByPage(pageSize) {
        debugger
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);
            setTimeout(() => {
                this.setSringToBool();
            }, 300);
        }, 0);
    }

    setSringToBool() {
        debugger
        if (this.caseList.length > 0) {
            this.caseLists = this.caseList;
            console.log("this.caseLists this.caseLists", this.caseLists)
        }
    }

    sendToList(ev) {
        debugger
        this.caseList = ev;
        setTimeout(() => {
            this.setSringToBool();
        }, 300);
    }

    @ViewChild('modalTermsCondition') modalTermsCondition: TemplateRef<any>;
    private _tcDialogRef: MatDialogRef<TemplateRef<any>>;
    openTermsConditionModaDialog(): void {
        debugger
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '40%';
        _config.panelClass = 'modalTopPosition';
        //modaltype != '' ? this.createModalForm(modaltype) : null;
        // this.termsConditionList.length == 0 ? this.addTermsCondition() : null;
        this._tcDialogRef = this.dialog.open(this.modalTermsCondition, _config);
        this._tcDialogRef.afterClosed().subscribe(result => {
        });
    }


    @ViewChild('modalCort') modalCort: TemplateRef<any>;
    openAddCort(): void {
        debugger
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '40%';
        _config.panelClass = 'modalTopPosition';
        //modaltype != '' ? this.createModalForm(modaltype) : null;
        // this.termsConditionList.length == 0 ? this.addTermsCondition() : null;
        this._tcDialogRef = this.dialog.open(this.modalCort, _config);
        this._tcDialogRef.afterClosed().subscribe(result => {
        });
    }
    public trmConList: any = [];
    public termsConditionList: any = [];

    public caseHearingEvent: string = '';
    public _saveEventUrl: string = 'dropdown/saveupdatecaseevent';
    onSubmitCaseEvent() {
        debugger
        if (!confirm('Are you sure you want to save this item?')) {
            return;
        }
        if (!this.caseHearingEvent || this.caseHearingEvent.trim() === '') {
            this._msg.warning('Please enter Case event name');
            return;
        }
        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.caseHearingEvent];
        var apiUrl = this._saveEventUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.oid) {
                    this.caseHearingEvent = '';
                    this.getAllHearingEvent();
                    this._msg.success(this.resmessage);
                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }




    public caseCort: string = '';
    public _saveCortUrl: string = 'dropdown/saveupdatecasecourt';
    onSubmitAddCort() {
        debugger
        if (!confirm('Are you sure you want to save this item?')) {
            return;
        }
        if (!this.caseCort || this.caseCort.trim() === '') {
            this._msg.warning('Please enter Cort name');
            return;
        }
        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.caseCort];
        var apiUrl = this._saveCortUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.oid) {
                    this.caseCort = '';
                    this.getAllCourt();
                    this._msg.success(this.resmessage);
                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }







    public _saveUrl: string = 'case/saveupdateform';
    onSubmit() {
        debugger
        var formData = new FormData();
        if (this.advDocInfoList.length > 0) {
            this.advDocInfoList.forEach(item => {
                // formData.append('docFile', item.attachedfile);
                //  formData.append('Name', item.Name);
                formData.append(item.row, item.attachedfile);
            });
        }
        this.getAllDeed();
        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.caseForm.value, this.hearingList, this.advHearingList];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModelForm(apiUrl, ModelsArray, formData)
            .subscribe(response => {
                this.res = response;
                this.advDocInfoList = [];
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.referenceId = this.res.resdata.result
                    this.onSubmitDoc();

                    this.getListByPage(this.pageSize);
                    this._msg.success(this.resmessage);
                    this.reset();
                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }



    public _saveFormUrl: string = 'case/saveupdatedoc';
    public referenceId: string = '';
    public documentList: any;
    onSubmitDoc() {
        debugger;
        var formData = new FormData();
        this.docListCase.forEach(item => {
            item.referenceId = this.referenceId;
        });
        console.log('this.documentList', this.referenceId);
        var ModelsArray = [this.referenceId, this.loggedInfo, this.docListCase];
        this.docListCase.forEach(item => {
            formData.append('docFile', item.attachedfile);
        });
        var apiUrl = this._saveFormUrl;
        this._dataservice.postMultipleModelForm(apiUrl, ModelsArray, formData)//postMultipleModelForm_Sync
            .subscribe(response => {
                this.res = response;
                console.log("Doc Upload this.res", this.res)
                if (this.res.resdata.resstate) {
                    this.docListCase = [];
                }
            }, error => {
                console.log(error);
            });
    }



    getbyAdvocate(func: string, model: any) {
        const modelEvnt = {
            func: func,
            model: model
        };
        console.log("modelEvnt1----------", modelEvnt)
        this.cmnEntity.isShow = true
        this.cmnbtnAction(modelEvnt)
    }


    public docList: any;
    public _getbyIdUrl: string = 'case/getbyid';
    public getFormData: any;
    edit(modelEvnt) {
        debugger;

        this.reset();
        //modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.model.caseOid };
        console.log("modelEvnt----------", param)
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                console.log("modelEvnt----------this.res", this.res)
                this.docListCase = [];
                if (this.res.resdata.caseMaster != '') {
                    var cases = JSON.parse(this.res.resdata.caseMaster)[0];
                    this.getFormData = cases
                    this.caseForm.setValue({
                        caseOid: cases.caseOid,
                        caseNo: cases.caseNo,
                        refCaseNo: cases.refCaseNo,
                        caseType: cases.caseTypeId,
                        casePriorityId: cases.casePriorityId,
                        courtId: cases.CourtId,
                        caseDate: this._conversion.DateConvert(cases.caseDate),
                        districtId: cases.districtId,
                        thanaId: cases.thanaId,
                        mouzaId: cases.mouzaId,
                        badi: cases.badi,
                        bibadi: cases.bibadi,
                        company: cases.companyId,
                        deedIds: cases.deedId,
                        deedNos: cases.deedNo,
                        totalLand: cases.totalLand,
                        selectedSurvey: cases.survayType,
                        caseDetails: cases.caseDetails,
                        currentStatusId: cases.currentStatusId,
                        khatianCS: cases.khatianCS,
                        khatianSA: cases.khatianSA,
                        khatianDR: cases.khatianDR,
                        khatianRS: cases.khatianRS,
                        khatianBS: cases.khatianBS,
                        dagCS: cases.dagCS,
                        dagSA: cases.dagSA,
                        dagDR: cases.dagDR,
                        dagRS: cases.dagRS,
                        dagBS: cases.dagBS,
                        remarks: cases.ramarks,
                        isActive: cases.isActive == "1" ? true : false,
                    });

                    this.getThanasById(cases.districtId);
                    this.getMouzasById(cases.thanaId);
                    this.selectDagName = cases.survayType

                    switch (cases.survayType) {
                        case '1':
                            this.dagValue = cases.dagCS;
                            break;
                        case '2':
                            this.dagValue = cases.dagSA;
                            break;
                        case '3':
                            this.dagValue = cases.dagDR;
                            break;
                        case '4':
                            this.dagValue = cases.dagRS;
                            break;
                        case '5':
                            this.dagValue = cases.dagBS;
                            break;

                    }
                    this.getAllDeedById();

                    setTimeout(() => {
                        this.landDeedIds = [];
                        if (cases.deedId) {
                            let landId = cases.deedId
                            this.landDeedIds = landId.split(",")
                            console.log("final deed id is", this.landDeedIds)
                            this.getAllDeed();
                        }
                        //for mouza
                        this.mouzaIdLst = [];
                        let mouzaId = cases.mouzaId
                        this.mouzaIdLst = mouzaId.split(",")
                    });







                    if (this.res.resdata.hearingDairy != '') {
                        this.hearingList = []
                        var hearingDairy = JSON.parse(this.res.resdata.hearingDairy)
                        this.hearingList = hearingDairy.map(item => ({
                            caseOid: item.caseOid,
                            hearingOid: item.hearingOid,
                            hearingDate: this._conversion.DateConvert(item.hearingDate),
                            hearingNxtDate: this._conversion.DateConvert(item.hearingNxtDate),
                            reasonNxtHearing: item.reasonNxtHearing,
                            remarks: item.remarks,
                        }))
                    }

                    if (this.res.resdata.advhearingDairy != '') {
                        this.advHearingList = []
                        var advHearing = JSON.parse(this.res.resdata.advhearingDairy)
                        this.advHearingList = advHearing.map(item => ({
                            caseOid: item.caseOid,
                            advHearingOid: item.advHearingOid,
                            caseStatus: item.caseStatus,
                            advocateOid: item.advocateOid,
                            hearingNotes: item.hearingNotes,
                            expense: item.expense,
                            indexData: item.indexData,
                            docVirtualPath: item.docVirtualPath
                        }))
                    }


                    this.docListCase = [];
                    if (this.res.resdata.objDoc != '') {
                        var docLists = JSON.parse(this.res.resdata.objDoc);
                        docLists.forEach(item => {
                            item.isActive = item.isActive == '1' ? true : false;
                            item.isCancel = item.isCancel == '1' ? true : false;
                        });

                        this.docListCase = docLists;
                        console.log("doclist test for ", this.docListCase)
                    }


                }
            }, error => {
                console.log(error);
            });
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






    //Get by ID






    reset() {
        debugger
        this.caseForm = this.formBuilder.group({
            caseOid: new FormControl(null),
            caseNo: new FormControl(null),
            refCaseNo: new FormControl(null),
            caseType: new FormControl(null),
            casePriorityId: new FormControl(null),
            courtId: new FormControl(null),
            caseDate: new FormControl(this._conversion.Today(), Validators.required),
            districtId: new FormControl(null),
            thanaId: new FormControl(null),
            mouzaId: new FormControl(null),
            badi: new FormControl(null),
            bibadi: new FormControl(null),
            company: new FormControl(null),
            deedIds: new FormControl(null),
            deedNos: new FormControl(null),
            totalLand: new FormControl(null),
            selectedSurvey: new FormControl(null),
            caseDetails: new FormControl(null),
            currentStatusId: new FormControl(null),
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
            remarks: new FormControl(null),
            isActive: new FormControl(true),
        })
        this.hearingList = [];
        this.advHearingList = [];
        //this.landDeedIds = [];
        this.docListCase = [];
        this.mouzaIdLst = [];
        this.mouzasList = []
        this.thanasList = [];
        this.landDeedIds = '';



        this.dagValue = null;
        this.selectDagName = null;


    }






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


    //Set Deed Receiver








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


    }






    public allPazesize = 10000
    getCaseSearchByParam(district: any, thana: any, mouza: any, court: any) {
        debugger
        this.district = district;
        this.thana = thana
        this.mouza = mouza
        this.court = court
        this.getListByPage(this.allPazesize);
    }
    getByPagesClear() {
        this.district = '';
        this.thana = '';
        this.mouza = '';
        this.court = '';
        this.caseCstatus = '';
        this.casePriority = '';
        this.getListByPage(this.pageSize);
    }






}
