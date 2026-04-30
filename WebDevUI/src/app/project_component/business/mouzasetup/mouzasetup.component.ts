import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
import { Options } from 'select2';
//import { Options } from 'ngx-bootstrap/positioning/models';
declare var $: any;

@Component({
    selector: 'app-mouzasetup',
    templateUrl: './mouzasetup.component.html',
    styleUrls: ['./mouzasetup.component.scss'],
    providers: [Conversion]
})

export class MouzaSetupComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
    @ViewChild('divState', { static: false }) _divState: ElementRef;
    @ViewChild('distState', { static: false }) _distState: ElementRef;
    @ViewChild('thanaState', { static: false }) _thanaState: ElementRef;
    @ViewChild('fileInput') _fileInput: ElementRef;
    private userID = sessionStorage.getItem("userID");
    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    public pageSize: number = 10;
    public options: Options;
    //public displayStart = 0;
    public isLoaded: Object = true;
    public mouzaForm: FormGroup;

    constructor(
        private _conversion: Conversion,
        private _dataservice: DataService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        this.options = this._pathValidation.ngSelect2Option();
        //this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: true }]);
    }

    ngOnInit(): void {
        this.createForm();
        this.getAllDivision();
        this.getAllDistrict();
        $('#mouzaName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.mouzaForm = this.formBuilder.group({
            id: new FormControl(null),
            nameEn: new FormControl(null, Validators.required),
            nameBn: new FormControl(null, Validators.required),
            divisionId: new FormControl(null, Validators.required),
            districtId: new FormControl(null, Validators.required),
            thanaId: new FormControl(null, Validators.required),
            latitude: new FormControl(null),
            longitude: new FormControl(null),
            basePath: new FormControl(this.cmnEntity.menuPath),
            docPath: new FormControl(null),
            docVpath: new FormControl(null),
            isActive: true
        });
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }


    public responseTag: string = 'listMouza';
    public mouzaList: any = [];
    public _listByPageUrl: string = 'mouzaSetup/getbypage';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);
        }, 0);
    }

    public _saveUrl: string = 'mouzaSetup/saveupdateform';
    onSubmit() {

        var formData = new FormData();
        if (this.documentList.length > 0) {
            formData.append('docFile', this.documentList[0].attachedfile);
        }

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.mouzaForm.value];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModelForm(apiUrl, ModelsArray, formData)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
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

    //Get by ID
    public _getbyIdUrl: string = 'mouzaSetup/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.model.id };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.objMouza != '') {
                    var mouza = JSON.parse(this.res.resdata.objMouza)[0];

                    this.mouzaForm.setValue({
                        id: mouza.id,
                        nameEn: mouza.nameEn,
                        nameBn: mouza.nameBn,
                        divisionId: mouza.divisionId,
                        districtId: mouza.districtId,
                        thanaId: mouza.thanaId,
                        latitude: mouza.latitude,
                        longitude: mouza.longitude,
                        basePath: this.cmnEntity.menuPath,
                        docPath: mouza.docPath,
                        docVpath: mouza.docVpath,

                        isActive: mouza.isActive == '1' ? true : false
                    });

                    this.imageSrc = mouza.docVpath;

                    if (mouza.divisionId != undefined && mouza.divisionId != undefined && mouza.divisionId != '') {
                        this.getDistrictById(mouza.divisionId);
                    }

                    if (mouza.districtId != undefined && mouza.districtId != undefined && mouza.districtId != '') {
                        this.getThanaById(mouza.districtId);
                    }
                }
            }, error => {
                console.log(error);
            });
    }

    //Delete
    public _deleteUrl: string = 'mouzaSetup/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, strId: modelEvnt.model.mouzaId };
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
        this.mouzaForm.setValue({
            id: null,
            nameEn: null,
            nameBn: null,
            divisionId: '',
            districtId: '',
            thanaId: '',
            latitude: null,
            longitude: null,
            basePath: this.cmnEntity.menuPath,
            docPath: null,
            docVpath: null,
            isActive: true
        });

        this.districtsId='';
        this.thanasId='';
        this._fileInput.nativeElement.value = "";
        this.imageSrc=undefined;
        this.resmessage = null;
        //this._el.nativeElement.focus();
        $('#mouzaName').focus();
    }

    //Get Division
    public divisionList: any = [];
    public _getDivisionUrl: string = 'dropdown/getalldivision';
    getAllDivision() {
        // var divstt: any = this._divState;
        // var tasksMode: boolean = divstt.zone.hasPendingMacrotasks;
        // if (!tasksMode) {
        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "AbyMÖn K‡i wbe©vPb Kiæb", nameEn: '' }];
        var param = { id: 0 };
        var apiUrl = this._getDivisionUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listDivisions != '') {
                    var itemList = this.res.resdata.listDivisions;
                    itemList.forEach(item => {
                        list.push({ id: item.id, text: item.nameBn, nameEn: item.name_En });
                    });

                    this.divisionList = list;
                }
            }, error => {
                console.log(error);
            });
        // }
    }
    //Get Division
    //Get District
    public districtList: any = [];
    public _getDistrictUrl: string = 'dropdown/getdistrictbyid';
    getDistrictById(divisionId) {
        var diststt: any = this._distState;
        var tasksMode: boolean = diststt.zone.hasPendingMacrotasks;
        var nestingCount: number = diststt.zone._nesting;
        if (nestingCount == 1) {
            var list: Array<{ id, text, nameEn }> = [{ id: '', text: "AbyMÖn K‡i wbe©vPb Kiæb", nameEn: '' }];
            var param = { strId: divisionId };
            var apiUrl = this._getDistrictUrl;
            this._dataservice.getWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    if (this.res.resdata.listDistricts != '') {
                        var itemList = this.res.resdata.listDistricts;
                        itemList.forEach(item => {
                            list.push({ id: item.id, text: item.nameBn, nameEn: item.name_En });
                        });

                        this.districtList = list;
                    }
                }, error => {
                    console.log(error);
                });
        }
    }
    //Get District

    //Get Thana
    public thanaList: any = [];
    public _getThanaUrl: string = 'dropdown/getthanabyid';
    getThanaById(districtId) {
        var thanastt: any = this._thanaState;
        var tasksMode: boolean = thanastt.zone.hasPendingMacrotasks;
        var nestingCount: number = thanastt.zone._nesting;
        if (nestingCount == 1) {
            var list: Array<{ id, text, nameEn }> = [{ id: '', text: "AbyMÖn K‡i wbe©vPb Kiæb", nameEn: '' }];
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

    //Filter Master List
    //Get District
    public districtsId:string='';
    public districtsList: any = [];
    public _getDistrictsUrl: string = 'dropdown/getalldistrict';
    getAllDistrict() {
        var list: Array<{ id, divisionId, text, nameEn }> = [{ id: '', divisionId: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: '' };
        var apiUrl = this._getDistrictsUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listDistricts != '') {
                    var itemList = this.res.resdata.listDistricts;
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
    public thanasId:string='';
    public thanasList: any = [];
    public _getThanasUrl: string = 'dropdown/getthanabyid';
    getThanasById(districtsId) {
            var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
            var param = { strId: districtsId };
            var apiUrl = this._getThanasUrl;
            this._dataservice.getWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    if (this.res.resdata.listThanas != '') {
                        var itemList = this.res.resdata.listThanas;
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
    //Filter Master List


    clickOnBtnFile() {
        this._fileInput.nativeElement.value = "";
        $('#attachedSingleFile').click();
    }

    public imageSrc;
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
                this.imageSrc = this._conversion.openSanitizedReportByFile(file);
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

    public fileTypes: any = ["jpg", "jpeg", "png", "gif"];

}
