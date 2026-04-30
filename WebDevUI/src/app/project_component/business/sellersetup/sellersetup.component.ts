import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
declare var $: any;

@Component({
    selector: 'app-sellersetup',
    templateUrl: './sellersetup.component.html',
    styleUrls: ['./sellersetup.component.scss'],
    providers: [Conversion]
})

export class SellerSetupComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
    private userID = sessionStorage.getItem("userID");
    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    public pageSize: number = 10;
    //public displayStart = 0;
    public isLoaded: Object = true;
    public sellerForm: FormGroup;

    constructor(
        private _conversion: Conversion,
        private _dataservice: DataService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        //this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: true }]);
    }

    ngOnInit(): void {
        this.createForm();
        $('#sellerName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.sellerForm = this.formBuilder.group({
            id: new FormControl(null),
            nameEn: new FormControl(null, Validators.required),
            nameBn: new FormControl(null, Validators.required),
            fatherName: new FormControl(null),
            motherName: new FormControl(null),
            spouseName: new FormControl(null),
            nidNo: new FormControl(null),
            addressEn: new FormControl(null),
            addressBn: new FormControl(null),
            isGong: false,
            isActive: true
        });
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listSeller';
    public sellerList: any = [];
    public _listByPageUrl: string = 'sellerSetup/getbypage';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);
        }, 0);
    }

    public _saveUrl: string = 'sellerSetup/saveupdate';
    onSubmit() {

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.sellerForm.value];
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
    public _getbyIdUrl: string = 'sellerSetup/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.model.sellerId };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.objSeller != '') {
                    var seller = JSON.parse(this.res.resdata.objSeller)[0];

                    this.sellerForm.setValue({
                        id: seller.id,
                        nameEn: seller.nameEn,
                        nameBn: seller.nameBn,
                        fatherName: seller.fatherName,
                        motherName: seller.motherName,
                        spouseName: seller.spouseName,
                        nidNo: seller.nidNo,
                        addressEn: seller.addressEn,
                        addressBn: seller.addressBn,
                        isGong: seller.isGong == '1' ? true : false,
                        isActive: seller.isActive == '1' ? true : false
                    });

                }
            }, error => {
                console.log(error);
            });
    }

    //Delete
    public _deleteUrl: string = 'sellerSetup/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, strId: modelEvnt.model.sellerId };
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
        this.sellerForm.setValue({
            id: null,
            nameEn: null,
            nameBn: null,
            fatherName: null,
            motherName: null,
            spouseName: null,
            nidNo: null,
            addressEn: null,
            addressBn: null,
            isGong: false,
            isActive: true
        });

        this.resmessage = null;
        //this._el.nativeElement.focus();
        $('#sellerName').focus();
    }

}
