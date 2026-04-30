import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { DataService } from 'src/app/api/api.dataservice.service';
import { PagerService } from 'src/app/api/api.pager.service';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
declare var $: any;

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
    providers: [PagerService]
})

export class RoleComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', {static: false}) _msg: CommonService;
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

    private userID = sessionStorage.getItem("userID");
    dtOptions: DataTables.Settings = {};
    public displayStart = 0;
    public isLoaded: Object = true;
    //business variables
    public searchname:string='';
    public roleList: any;
    public isAddBtnDisabled = false;
    public isUpdateBtnDisabled = true;
    public isDeleteBtnDisabled = false;
    public roleForm: FormGroup;

    public roleName;
    public remarks;
    public checkboxFlag = true;
    public status = true;
    public roleId;


    constructor(
        private _dataservice: DataService,
        private pagerService: PagerService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        this._pathValidation.alterCmnBtn([{id:6,col:"isShowBtn",val:false}]);
        this.pageSizeList = this.pagerService.pageSize();
    }

    ngOnInit(): void {
        this.createForm();
        this.getRoleByPage(0, true, this.pageSize);
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.roleForm = this.formBuilder.group({
            roleId: 0,
            roleName: new FormControl('', Validators.required),
            remarks: new FormControl(''),
            isActive: true
        });
    }

    public _getUrl: string = 'role/getbypage';
    getRoleByPage(pageIndex: number, isPaging: boolean, pageSize: number) {
        this.pageNumber = pageIndex;
        var param = { pageNumber: pageIndex, pageSize: pageSize, IsPaging: isPaging };
        var apiUrl = this._getUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(
                response => {
                    this.res = response;
                    this.roleList = [];

                    if (this.res.resdata.rolePagy !== undefined) {
                        this.roleList = this.res.resdata.rolePagy;
                    }

                    this.totalRowsInList = this.roleList.length;
                    this.totalRows = this.roleList.length > 0 ? this.res.resdata.recordsTotal : 0;
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
                        this.pagedItems = this.roleList;

                }, error => {
                    console.log(error);
                }
            );
    }

    //Set Page
    setPagingToGetAll(page: number, isPaging: boolean) {
        this.pager = this.pagerService.getPager(this.totalRows, page, this.pageSize);
        if (isPaging) {
            this.getRoleByPage(page, false, this.pager.pageSize);
        }
        else {
            this.pagedItems = this.roleList;
        }
    }

    public _saveUrl: string = 'role/saveupdate';
    onSubmit() {
        if (this.roleForm.invalid) {
            return;
        }

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.roleForm.value];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.getRoleByPage(0, true, this.pageSize); 
                    this._msg.success(this.resmessage );
                    this.reset();
                } else {
                    this._msg.warning(this.resmessage );
                }
            }, error => {
                console.log(error);
            });
    }

    //Get by ID
    public _getbyIdUrl: string = 'role/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { id: modelEvnt.model.roleId };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res !== null) {
                    this.roleForm.setValue({
                        roleId: this.res.resdata.objRole.roleId,
                        roleName: this.res.resdata.objRole.roleName,
                        remarks: this.res.resdata.objRole.remarks,
                        isActive: this.res.resdata.objRole.isActive
                    });
                }
            }, error => {
                console.log(error);
            });
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
                        this.getRoleByPage(0, true, this.pageSize);
                        this._msg.success(this.resmessage );
                    }
                    else {
                        this._msg.warning(this.resmessage );
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

    reset() {
        this.roleForm.setValue({
            roleId: 0,
            roleName: '',
            remarks: '',
            isActive: true
        });

        this.resmessage = null;
        //this._el.nativeElement.focus();
        $('#roleName').focus();
    }

}
