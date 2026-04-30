import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Options } from 'select2';
import { DataService } from 'src/app/api/api.dataservice.service';
import { PagerService } from 'src/app/api/api.pager.service';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
declare var $: any;

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
  providers: [PagerService]
})
export class UserRoleComponent implements OnInit {
  //Common
  @ViewChild('cmnsrv', {static: false}) _msg: CommonService;
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

  //business variables
  public searchname:string='';
  public userRoleForm: FormGroup;
  public userRoleList: any = [];
  public roleList: any = [];
  public userList: any = [];
  public isLoaded: Object = true;
  public userCompanyID: string = 'ACMPx10105';

  private userID = sessionStorage.getItem("userID");

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
    this.options = this._pathValidation.ngSelect2Option();
  }

  ngOnInit(): void {
    this.createForm();
    this.getRoles();
    this.getUsers(this.userCompanyID);
    this.getUserRoleByPage(0, true, this.pageSize, this.userCompanyID);
  }

  cmnbtnAction(evmodel) {
    debugger;
    this[evmodel.func](evmodel);
  }

  createForm() {
    this.userRoleForm = this.formBuilder.group({
      userRoleId: 0,
      userId: new FormControl('', Validators.required),
      roleId: new FormControl('', Validators.required),
      isActive: true
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
        }, error => {
          console.log(error);
        });
  }

  //Get All Role
  public _getUserUrl: string = 'dropdown/getalluserbycompany';
  getUsers(companyId) {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var param = { values: companyId };
    var apiUrl = this._getUserUrl;
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listUser.length > 0) {
            var itemList = JSON.parse(this.res.resdata.listUser);
            itemList.forEach(item => {
              list.push({ id: item.userId, text: item.userName });
            });

            this.userList = list;

          }
        }, error => {
          console.log(error);
        }
      );
  }

  public _getUrl: string = 'userRole/getbypage';
  getUserRoleByPage(pageIndex: number, isPaging: boolean, pageSize: number, companyId) {
    this.pageNumber = pageIndex;
    var param = { pageNumber: pageIndex, pageSize: pageSize, IsPaging: isPaging, values: companyId };
    var apiUrl = this._getUrl;
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          this.userRoleList = [];

          if (this.res.resdata.listUserRole.length > 0) {
            this.userRoleList = JSON.parse(this.res.resdata.listUserRole);
          }

          this.totalRowsInList = this.userRoleList.length;
          this.totalRows = this.userRoleList.length > 0 ? this.userRoleList[0].recordsTotal : 0;
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
            this.pagedItems = this.userRoleList;

        }, error => {
          console.log(error);
        }
      );
  }

  //Set Page
  setPagingToGetAll(page: number, isPaging: boolean) {
    this.pager = this.pagerService.getPager(this.totalRows, page, this.pageSize);
    if (isPaging) {
      this.getUserRoleByPage(page, false, this.pager.pageSize, this.userCompanyID);
    }
    else {
      this.pagedItems = this.userRoleList;
    }
  }

  public _saveUrl: string = 'userRole/saveupdate';
  onSubmit() {
    if (this.userRoleForm.invalid) {
      return;
    }

    var param = { loggedUserId: this.userID };
    var ModelsArray = [param, this.userRoleForm.value];
    var apiUrl = this._saveUrl;
    this._dataservice.postMultipleModel(apiUrl, ModelsArray)
      .subscribe(response => {
        this.res = response;
        this.resmessage = this.res.resdata.message;
        if (this.res.resdata.resstate) {
          this.getUserRoleByPage(0, true, this.pageSize, this.userCompanyID);
          this._msg.success(this.resmessage );
          this.reset();
        }
        else {
          this._msg.warning(this.resmessage );
        }


      }, error => {
        console.log(error);
      });
  }

  //Get by ID
  public _getbyIdUrl: string = 'userRole/getbyid';
  edit(modelEvnt) {
    modelEvnt.event.preventDefault();
    var param = { id: modelEvnt.model.userRoleId };
    var apiUrl = this._getbyIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        if (this.res.resdata.userRole !== '') {
          this.userRoleForm.setValue({
            userRoleId: this.res.resdata.userRole.userRoleId,
            roleId: this.res.resdata.userRole.roleId,
            userId: this.res.resdata.userRole.userId,
            isActive: this.res.resdata.userRole.isActive
          });
        }
      }, error => {
        console.log(error);
      });
  }

  //Delete
  public _deleteUrl: string = 'userRole/delete';
  delete(modelEvnt) {
    modelEvnt.event.preventDefault();
    if (modelEvnt.isConfirm) {
      var param = { loggedUserId: this.userID, id: modelEvnt.model.userRoleId };
      var apiUrl = this._deleteUrl;
      this._dataservice.deleteWithMultipleModel(apiUrl, param)
        .subscribe(response => {
          this.res = response;
          this.resmessage = this.res.resdata.message;
          if (this.res.resdata.resstate) {
            this.getUserRoleByPage(0, true, this.pageSize, this.userCompanyID);
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
    this.userRoleForm.setValue({
      userRoleId: 0,
      roleId: '',
      userId: '',
      isActive: true
    });

    this.resmessage = null;
  }

}
