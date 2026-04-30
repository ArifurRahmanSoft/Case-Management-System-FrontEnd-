import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Options } from 'select2';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from 'src/app/api/api.dataservice.service';
import { PagerService } from 'src/app/api/api.pager.service';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
declare var $: any;

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    providers: [PagerService, Conversion]
})

export class MenuComponent implements OnInit {
    //Common
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    public options: Options;

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

    //@ViewChild('fromConfirmModal', null) _confirmmodal: ConfirmModal;
    //business variables
    public searchname: string = '';
    public menuList: any = [];
    public parentMenuList: any = [];
    public subParentMenuList: any = [];
    public roleList: any = [];
    public menuForm: FormGroup;
    public permissionForm: FormGroup;
    public isView: boolean = false;
    public isInsert: boolean = false;
    public isUpdate: boolean = false;
    public isDelete: boolean = false;
    public ModuleId: any;
    public RoleId: number = 0;
    public btnperm = true;

    //@ViewChild("MName") _el: ElementRef;

    private userID = sessionStorage.getItem("userID");
    dtOptions: DataTables.Settings = {};
    public displayStart = 0;
    public isLoaded: Object = true;
    //public menuList : any;
    public isAddBtnDisabled = false;
    public isUpdateBtnDisabled = true;
    public isDeleteBtnDisabled = false;
    public _branchUrl: any;

    public menuName;
    public menu_url;
    public checkboxFlag = true;
    public status = true;
    public menuId;

    constructor(
        private _dataservice: DataService,
        private pagerService: PagerService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        private _conversion: Conversion,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: false }]);
        this.pageSizeList = this.pagerService.pageSize();
        this.options = this._pathValidation.ngSelect2Option();

    }

    ngOnInit(): void {
        this.createForm();
        this.getParentMenus(false);
        this.getRoles();
        this.getRoleWiseMenu(0, true, this.pageSize, this.RoleId);
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.menuForm = this.formBuilder.group({
            menuId: 0,
            menuName: new FormControl(null, Validators.required),
            menuIcon: new FormControl(null),
            parentId: new FormControl(null),
            subParentId: new FormControl(null),
            menuPath: new FormControl(null, Validators.required),
            menuSequence: new FormControl(null),
            moduleId: new FormControl(1),
            companyId: new FormControl(1),
            isActive: true,
            isSubparent: false
        });
    }

    //Form Create
    // createPermForm() {
    //   this.permissionForm = this.formBuilder.group({
    //       RoleId: new FormControl('', Validators.required),
    //       ModuleId: new FormControl('')
    //   });
    // }

    // public getMenuBak(){
    //     this.api.getMenuList()
    //      .subscribe((data: Response) => {
    //       this.menuList = data;
    //       this.isLoaded = true;
    //      });

    //  }

    public getMenu() {
        var param = { RoleIDs: 0, pageNumber: 1, pageSize: 10 }
        var apiUrl = this._getRWMenuUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                debugger;
                this.res = response;
                if (this.res.resdata.listRoleMenu !== '') {
                    this.menuList = JSON.parse(this.res.resdata.listRoleMenu);
                    this.isLoaded = true;
                }

                // this.menuList = response;
                // this.isLoaded = true;
            });
    }


    //Get All Role
    public _getRoleUrl: string = 'dropdown/getallrole';
    getRoles() {
        var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
        var apiUrl = this._getRoleUrl;
        this._dataservice.getall(apiUrl)
            .subscribe(
                response => {
                    this.res = response;
                    if (this.res.resdata.listUsrRole.length > 0) {
                        var itemList = JSON.parse(this.res.resdata.listUsrRole);
                        itemList.forEach(item => {
                            list.push({ id: item.roleId, text: item.roleName });
                        });

                        this.roleList = list;
                    }

                    this.resetprmsn(0);
                }, error => {
                    console.log(error);
                });
    }
    // getRoles() {
    //    var apiUrl=this._getRoleUrl;
    //   this._dataservice.getall(apiUrl)
    //       .subscribe(
    //           response => {
    //               this.res = response;
    //               this.roleList = this.res.resdata.listUsrRole;
    //               this.resetprmsn(0);
    //           }, error => {
    //               console.log(error);
    //           }
    //       );
    // }

    //load parent menu on module change
    public _getPmenuUrl: string = 'menu/getparentmenu';
    getParentMenus(IsEdit: boolean) {
        this.parentMenuList = [];
        var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
        var param = { id: 0 };
        var apiUrl = this._getPmenuUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(
                response => {
                    this.res = response;

                    if (IsEdit === false) {
                        this.subParentMenuList = [];
                        this.menuForm.controls.parentId.setValue('');
                        this.menuForm.controls.subParentId.setValue('');
                    }

                    if (this.res.resdata.listMenues.length > 0) {
                        var itemList = JSON.parse(this.res.resdata.listMenues);
                        itemList.forEach(item => {
                            list.push({ id: item.menuId, text: item.menuName });
                        });

                        this.parentMenuList = list;
                    }
                }, error => {
                    console.log(error);
                }
            );
        // }
        // else {
        //     this.parentMenuList = [];
        //     this.subParentMenuList = [];
        //     this.menuForm.controls.parentId.setValue('');
        //     this.menuForm.controls.subParentId.setValue('');
        // }
    }

    //load sub parent menu on module change
    public _getSubPmenuUrl: string = 'menu/getsubparentmenu';
    getSubParentMenus(event, value, IsEdit) {
        //this.menuForm.controls.parentId.setValue(value);
        if (value !== '') {
            this.subParentMenuList = [];
            var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
            var param = { id: value };
            var apiUrl = this._getSubPmenuUrl;
            this._dataservice.getWithMultipleModel(apiUrl, param)
                .subscribe(
                    response => {
                        this.res = response;

                        if (IsEdit === false) {
                            this.menuForm.controls.subParentId.setValue('');
                        }

                        if (this.res.resdata.listMenues.length > 0) {
                            var itemList = JSON.parse(this.res.resdata.listMenues);
                            itemList.forEach(item => {
                                list.push({ id: item.menuId, text: item.menuName });
                            });

                            this.subParentMenuList = list;
                        }
                    }, error => {
                        console.log(error);
                    }
                );
        }
        else {
            this.subParentMenuList = [];
            this.menuForm.controls.subParentId.setValue('');
        }
    }

    //Get by ID
    public _getbyIdUrl: string = 'menu/getbyid';
    edit(modelEvnt) {
        modelEvnt.event.preventDefault();
        var param = { id: modelEvnt.model.menuId };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.objMenu.length > 0) {
                    var menu = JSON.parse(this.res.resdata.objMenu)[0];
                    this.menuForm.setValue({
                        menuId: menu.menuId,
                        menuName: menu.menuName,
                        menuIcon: menu.menuIcon === null ? '' : menu.menuIcon,
                        parentId: menu.parentId === null || menu.parentId === 0 ? '' : menu.parentId,
                        subParentId: menu.subParentId === null || menu.subParentId === 0 ? '' : menu.subParentId,
                        menuPath: menu.menuPath,
                        menuSequence: menu.menuSequence,
                        moduleId: menu.moduleId,
                        companyId: menu.companyId,
                        isActive: menu.isActive == '1' ? true : false,
                        isSubparent: menu.isSubParent == '1' ? true : false
                    });

                    this.getSubParentMenus(modelEvnt.event, this.menuForm.value.parentId, true);
                }
            }, error => {
                console.log(error);
            });
    }

    //Check all list item
    checkAll(event) {
        var model_id = event.currentTarget.id;
        var ischecked = event.currentTarget.checked;
        if (model_id === 'isView') {
            this.menuList.forEach((item, index) => {
                item.isView = ischecked;
            });
        }
        else if (model_id === 'isInsert') {
            this.menuList.forEach((item, index) => {
                item.isInsert = ischecked;
            });
        }
        else if (model_id === 'isUpdate') {
            this.menuList.forEach((item, index) => {
                item.isUpdate = ischecked;
            });
        }
        else if (model_id === 'isDelete') {
            this.menuList.forEach((item, index) => {
                item.isDelete = ischecked;
            });
        }
    }

    setCheckAll(event, model) {
        var model_id = event.currentTarget.id;
        var ischecked = event.currentTarget.checked;
        var splitId = model_id.split('_');
        var split_Id = splitId[0];
        if (split_Id === 'isView') {
            model.isView = ischecked;
            var fmodel = this.menuList.filter(x => x.isView === false)[0];
            if (fmodel !== undefined && fmodel.isView === false) {
                this.isView = false;
            }
            else {
                this.isView = true
            }
        }
        else if (split_Id === 'isInsert') {
            model.isInsert = ischecked;
            var fmodel = this.menuList.filter(x => x.isInsert === false)[0];
            if (fmodel !== undefined && fmodel.isInsert === false) {
                this.isInsert = false;
            }
            else {
                this.isInsert = true
            }
        }
        else if (split_Id === 'isUpdate') {
            model.isUpdate = ischecked;
            var fmodel = this.menuList.filter(x => x.isUpdate === false)[0];
            if (fmodel !== undefined && fmodel.isUpdate === false) {
                this.isUpdate = false;
            }
            else {
                this.isUpdate = true
            }
        }
        else if (split_Id === 'isDelete') {
            model.isDelete = ischecked;
            var fmodel = this.menuList.filter(x => x.isDelete === false)[0];
            if (fmodel !== undefined && fmodel.isDelete === false) {
                this.isDelete = false;
            }
            else {
                this.isDelete = true
            }
        }
    }

    setCheckAllOnEdit() {
        if (this.menuList.length > 0) {
            this.isView = this.menuList.filter(x => x.isView === false)[0] !== undefined && this.menuList.filter(x => x.isView === false)[0].isView === false ? false : true;
            this.isInsert = this.menuList.filter(x => x.isInsert === false)[0] !== undefined && this.menuList.filter(x => x.isInsert === false)[0].isInsert === false ? false : true;
            this.isUpdate = this.menuList.filter(x => x.isUpdate === false)[0] !== undefined && this.menuList.filter(x => x.isUpdate === false)[0].isUpdate === false ? false : true;
            this.isDelete = this.menuList.filter(x => x.isDelete === false)[0] !== undefined && this.menuList.filter(x => x.isDelete === false)[0].isDelete === false ? false : true;
        }
    }

    public _saveUrl: string = 'menu/saveupdate';
    onSubmit() {
        if (this.menuForm.invalid) {
            return;
        }

        var FrmMenu = {
            menuId: this.menuForm.controls.menuId.value,
            menuName: this.menuForm.controls.menuName.value,
            menuIcon: this.menuForm.controls.menuIcon.value,
            parentId: this.menuForm.controls.parentId.value,
            subParentId: this.menuForm.controls.subParentId.value,
            menuPath: this.menuForm.controls.menuPath.value,
            menuSequence: this.menuForm.controls.menuSequence.value,
            moduleId: this.menuForm.controls.moduleId.value,
            companyId: this.menuForm.controls.companyId.value,
            isActive: this.menuForm.controls.isActive.value,
            isSubparent: this.menuForm.controls.isSubparent.value
        };

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, FrmMenu];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this._msg.success(this.resmessage);
                    this.getRoleWiseMenu(0, true, this.pageSize, 0);
                    this.reset();
                }
                else {
                    this._msg.warning(this.resmessage);
                }

            }, error => {
                console.log(error);
            });
    }

    //Create
    public _savePrmsnUrl: string = 'menu/saveupdatepermission';
    onSubmitPrmsn() {
        if (this.RoleId === undefined || this.RoleId === null || this.RoleId === 0 || this.RoleId.toString() === '0') {
            return;
        }

        var setMenuList = this.menuList.filter(x => x.isView === true || x.isInsert === true || x.isUpdate === true || x.isDelete === true || x.isEdit === true);
        if (setMenuList === undefined || setMenuList.length === 0) {
            return;
        }
        var param = { loggedUserId: this.userID, id: this.RoleId };
        var ModelsArray = [param, setMenuList];
        var apiUrl = this._savePrmsnUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this._msg.success(this.resmessage );
                    this.resetprmsn(1);
                }
                else {
                    this._msg.warning(this.resmessage );
                }

            }, error => {
                console.log(error);
            });
    }

    resetprmsn(cd) {
        this.RoleId = 0;

        this.setthhead();
        if (cd == 1) {
            this.pageSize = 10;
            this.getRoleWiseMenu(0, true, this.pageSize, 0);
        }
    }

    setthhead() {
        this.isView = false;
        this.isInsert = false;
        this.isUpdate = false;
        this.isDelete = false;
    }

    public _getRWMenuUrl: string = 'menu/getoramenubyrole';
    getRoleWiseMenu(pageIndex: number, isPaging: boolean, pageSize: number, RoleID: number) {
        if (RoleID !== undefined && RoleID !== null) {
            this.pageNumber = pageIndex;
            var param = { pageNumber: pageIndex, pageSize: pageSize, IsPaging: isPaging, id: RoleID === undefined ? 0 : RoleID };
            var apiUrl = this._getRWMenuUrl;
            this._dataservice.getWithMultipleModel(apiUrl, param)
                .subscribe(
                    response => {
                        this.res = response;
                        if (this.res.resdata.listRoleMenu != '') {
                            var modelList = JSON.parse(this.res.resdata.listRoleMenu);
                            this.menuList = this.setBooleanType(modelList);
                        }

                        this.totalRowsInList = this.menuList.length;
                        this.totalRows = this.menuList.length > 0 ? this.menuList[0].recordsTotal : 0;
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
                            this.pagedItems = this.menuList;

                        this.setCheckAllOnEdit();

                    }, error => {
                        console.log(error);
                    }
                );
        }
    }

    //Set Page
    setPagingToGetAll(page: number, isPaging: boolean) {
        this.pager = this.pagerService.getPager(this.totalRows, page, this.pageSize);
        if (isPaging) {
            this.getRoleWiseMenu(page, false, this.pager.pageSize, this.RoleId);
        }
        else {
            this.pagedItems = this.menuList;
        }
    }

    setBooleanType(modelList: any = []) {
        modelList.forEach(item => {
            item.isView = item.isView == '1' ? true : false;
            item.isInsert = item.isInsert == '1' ? true : false;
            item.isUpdate = item.isUpdate == '1' ? true : false;
            item.isDelete = item.isDelete == '1' ? true : false;
            item.isEdit = item.isEdit == '1' ? true : false;
            item.hasChild = item.hasChild == '1' ? true : false;
            item.isSubParent = item.isSubParent == '1' ? true : false;
            item.isActive = item.isActive == '1' ? true : false;
        });

        return modelList;
    }


    //Delete
    public _deleteUrl: string = 'menu/delete';
    delete(modelEvnt) {
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, id: modelEvnt.model.menuId };
            var apiUrl = this._deleteUrl;
            this._dataservice.deleteWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    this.resmessage = this.res.resdata.message;
                    if (this.res.resdata.resstate) {
                        this._msg.success(this.resmessage);
                        this.reset();
                        this.resetprmsn(1);
                    }
                    else {
                        this._msg.success(this.resmessage);
                    }

                }, error => {
                    console.log(error);
                });
        }
    }

    // Clear Form
    reset() {
        this.menuForm.setValue({
            menuId: 0,
            menuName: null,
            menuIcon: null,
            parentId: null,
            subParentId: null,
            menuPath: null,
            menuSequence: null,
            moduleId: 1,
            companyId: 1,
            isActive: true,
            isSubparent: false
        });

        this.resmessage = null;
        //this.parentMenuList = [];
        //this._el.nativeElement.focus();
        $('#menuName').focus();
    }

    // public confFunc:string='';
    // confModal(event, funcName:string, message:string, isDual:boolean) {
    //     var el = document.getElementById('custMessage');       
    //     this.confFunc = funcName;
    //     el.innerHTML = message;
    //     this._confirmmodal.isDualAction = isDual;
    //     this._confirmmodal.showModal();
    // }

}

