import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
import { Options } from 'select2';
declare var $: any;

@Component({
    selector: 'app-uploadtypesetup',
    templateUrl: './uploadtypesetup.component.html',
    styleUrls: ['./uploadtypesetup.component.scss'],
    providers: [Conversion]
})

export class UploadTypeSetupComponent implements OnInit {
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
    public uploadTypeForm: FormGroup;
    public options: Options;
    //public roleIds: [];
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
        $('#typeName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.uploadTypeForm = this.formBuilder.group({
            typeId: new FormControl(0),
            typeName: new FormControl(null, Validators.required),
            isActive: true
        });
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listUploadType';
    public uploadTypeList: any = [];
    public _listByPageUrl: string = 'uploadtype/getbypage';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);
        }, 0);
    }

    public _saveUrl: string = 'uploadtype/saveupdate';
    onSubmit() {

        // if (this.roleIds.length > 0) {
        //     var strRoleIds = JSON.stringify(this.roleIds);
        //     this.uploadTypeForm.controls.roleIds.setValue(strRoleIds);
        // }

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.uploadTypeForm.value];
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
    public _getbyIdUrl: string = 'uploadtype/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { id: parseInt(modelEvnt.model.typeId) };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.objUploadType != '') {
                    var uploadType = this.res.resdata.objUploadType;

                    this.uploadTypeForm.setValue({
                        typeId: uploadType.typeId,
                        typeName: uploadType.typeName,
                        isActive: uploadType.isActive
                    });

                }
            }, error => {
                console.log(error);
            });
    }

    //Delete
    public _deleteUrl: string = 'uploadtype/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, id: modelEvnt.model.typeId };
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
        this.uploadTypeForm.setValue({
            typeId: 0,
            typeName: null,
            isActive: true
        });

        //this.roleIds = [];
        this.resmessage = null;
        //this._el.nativeElement.focus();
        $('#typeName').focus();
    }
    
}
