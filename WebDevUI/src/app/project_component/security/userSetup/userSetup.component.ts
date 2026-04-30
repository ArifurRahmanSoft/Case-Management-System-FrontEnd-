import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { DataService } from 'src/app/api/api.dataservice.service';
import { PagerService } from 'src/app/api/api.pager.service';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
declare var $: any;

@Component({
    selector: 'app-userSetup',
    templateUrl: './userSetup.component.html',
    styleUrls: ['./userSetup.component.scss'],
    providers: [PagerService]
})

export class UserSetupComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    //Pagination
    public pageNumber: number = 0;
    public pageSize: number = 10;
    public totalRows: number = 0;
    public pageStart: number = 0;
    public pageEnd: number = 0;
    public totalRowsInList: number = 0;
    // pager object
    public pager: any = {};
    // paged items
    public pagedItems: any = [];
    public pageSizeList: any = [];
    public searchUserList: any = [];

    private userID = sessionStorage.getItem("userID");
    dtOptions: DataTables.Settings = {};
    public displayStart = 0;
    public isLoaded: Object = true;
    //business variables
    public searchname: string = '';
    public userList: any;
    public isAddBtnDisabled = false;
    public isUpdateBtnDisabled = true;
    public isDeleteBtnDisabled = false;
    public userForm: FormGroup;

    public roleName;
    public remarks;
    public checkboxFlag = true;
    public status = true;
    public roleId;
    public empId: string = '';

    constructor(
        private _dataservice: DataService,
        private pagerService: PagerService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        //this._pathValidation.alterCmnBtn([{id:6,col:"isShowBtn",val:false}]);
        this._pathValidation.alterCmnBtn([{ id: 1, col: "btnName", val: 'Create User' }]);
        this._pathValidation.alterCmnBtn([{ id: 2, col: "btnName", val: 'Update User' }]);
        this.pageSizeList = this.pagerService.pageSize();
    }

    ngOnInit(): void {
        this.createForm();
        this.getByPage(0, true, this.pageSize);
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getByPage(0, true, this.pageSize);
    }

    createForm() {
        this.userForm = this.formBuilder.group({
            empId: new FormControl('', Validators.required)
        });
    }

    public _getEmpDtlUrl: string = 'users/getemployeedetailbyid';
    getEmployeeDetail() {
        debugger;
        var param = { strId: this.userForm.controls.empId.value };
        var apiUrl = this._getEmpDtlUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.empDetail.length > 0) {
                    this.searchUserList = JSON.parse(this.res.resdata.empDetail);
                }
            }, error => {
                console.log(error);
            });
    }

    public _getUrl: string = 'users/getbypage';
    getByPage(pageIndex: number, isPaging: boolean, pageSize: number) {
        this.pageNumber = pageIndex;
        var param = { pageNumber: pageIndex, pageSize: pageSize, IsPaging: isPaging };
        var apiUrl = this._getUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(
                response => {
                    this.res = response;
                    this.userList = [];

                    if (this.res.resdata.listUser.length > 0) {
                        this.userList = JSON.parse(this.res.resdata.listUser);
                    }

                    this.totalRowsInList = this.userList.length;
                    this.totalRows = this.userList.length > 0 ? this.userList[0].recordsTotal : 0;
                    this.isLoaded = true;
                    if (this.pageNumber == 0 || this.pageNumber == 1) {
                        this.pageStart = 1;
                        if (this.totalRowsInList < this.pageSize) {
                            this.pageEnd = this.totalRowsInList;
                        } else {
                            this.pageEnd = this.pageSize;
                        }
                    } else {
                        this.pageStart = (this.pageNumber - 1) * this.pageSize + 1;
                        this.pageEnd = (this.pageStart - 1) + this.totalRowsInList;
                    }
                    //paging info end
                    if (isPaging) {
                        this.setPagingToGetAll(pageIndex, false);
                    }
                    else
                        this.pagedItems = this.userList;

                }, error => {
                    console.log(error);
                }
            );
    }

    //Set Page
    setPagingToGetAll(page: number, isPaging: boolean) {
        this.pager = this.pagerService.getPager(this.totalRows, page, this.pageSize);
        if (isPaging) {
            this.getByPage(page, false, this.pager.pageSize);
        }
        else {
            this.pagedItems = this.userList;
        }
    }

    public _saveUrl: string = 'users/saveupdate';
    onSubmit() {
        if (this.userForm.invalid && this.searchUserList.length == 0) {
            return;
        }

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.searchUserList];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.getByPage(0, true, this.pageSize);
                    if (this.res.resdata.result == '-1') {
                        this._msg.info(this.resmessage);
                    }
                    else{
                        this._msg.success(this.resmessage);
                    }

                    this.reset();
                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }

    //Get by ID
    //public _getbyIdUrl: string = 'users/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        this.userForm.controls.empId.setValue(modelEvnt.model.empId);
        this.getEmployeeDetail();
    }

    //Delete
    public _deleteUrl: string = 'role/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, id: modelEvnt.model.roleId };
            var apiUrl = this._deleteUrl;
            this._dataservice.deleteWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    this.resmessage = this.res.resdata.message;
                    if (this.res.resdata.resstate) {
                        this.getByPage(0, true, this.pageSize);
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
        this.userForm.setValue({
            empId: '',
        });
        this.searchUserList = [];
        this.resmessage = null;
        //this._el.nativeElement.focus();
        $('#roleName').focus();
    }

}
