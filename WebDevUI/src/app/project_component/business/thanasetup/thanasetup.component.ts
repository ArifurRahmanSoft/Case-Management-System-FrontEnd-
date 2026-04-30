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
    selector: 'app-thanasetup',
    templateUrl: './thanasetup.component.html',
    styleUrls: ['./thanasetup.component.scss'],
    providers: [Conversion]
})

export class ThanaSetupComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
    @ViewChild('divState', { static: false }) _divState: ElementRef;
    @ViewChild('distState', { static: false }) _distState: ElementRef;
    private userID = sessionStorage.getItem("userID");
    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    public pageSize: number = 10;
    public options: Options;
    //public displayStart = 0;
    public isLoaded: Object = true;
    public thanaForm: FormGroup;

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
        $('#thanaName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.thanaForm = this.formBuilder.group({
            id: new FormControl(null),
            nameEn: new FormControl(null, Validators.required),
            nameBn: new FormControl(null, Validators.required),
            divisionId: new FormControl(null, Validators.required),
            districtId: new FormControl(null, Validators.required),
            latitude: new FormControl(null),
            longitude: new FormControl(null),
            isActive: true
        });
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public nDistrictId: number = 0;
    public districtsId: string = '';
    public responseTag: string = 'listThana';
    public thanaList: any = [];
    public _listByPageUrl: string = 'thanaSetup/getbypage';
    getListByPage(pageSize) {
        this.nDistrictId = this.districtsId == '' ? 0 : parseInt(this.districtsId);
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);
        }, 0);
    }

    public _saveUrl: string = 'thanaSetup/saveupdate';
    onSubmit() {

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.thanaForm.value];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
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
    public _getbyIdUrl: string = 'thanaSetup/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.model.id };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.objThana != '') {
                    var thana = JSON.parse(this.res.resdata.objThana)[0];

                    this.thanaForm.setValue({
                        id: thana.id,
                        nameEn: thana.nameEn,
                        nameBn: thana.nameBn,
                        divisionId: thana.divisionId,
                        districtId: thana.districtId,
                        latitude: thana.latitude,
                        longitude: thana.longitude,
                        isActive: thana.isActive == '1' ? true : false
                    });

                    if (thana.divisionId != undefined && thana.divisionId != undefined && thana.divisionId != '') {
                        this.getDistrictById(thana.divisionId);
                    }
                }
            }, error => {
                console.log(error);
            });
    }

    //Delete
    public _deleteUrl: string = 'thanaSetup/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, strId: modelEvnt.model.id };
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
        this.thanaForm.setValue({
            id: null,
            nameEn: null,
            nameBn: null,
            divisionId: '',
            districtId: '',
            latitude: null,
            longitude: null,
            isActive: true
        });

        this.resmessage = null;
        this.nDistrictId = 0;
        this.districtsId = '';
        //this._el.nativeElement.focus();
        $('#thanaName').focus();
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

    //Get District
    public districtLists: any = [];
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

                    this.districtLists = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get District
}
