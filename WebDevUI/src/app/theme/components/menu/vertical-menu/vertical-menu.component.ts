import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { DataService } from 'src/app/api/api.dataservice.service';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalMenuComponent implements OnInit {
  public cmnEntity: any = {};
  public res: any;
  parentMenu: Array<any>;
  public finalMenuList = [];
  public myCustomMenu = [];
  public counter = 0;
  public settings: Settings;

  public userID;
  public password;

  public listMenues: any = [];

  constructor(private appSettings: AppSettings, private _dataservice: DataService, private _pathValidation: pathValidation) {//, private _apiService : ApiService, private menuService:MenuService, will be off
    this.settings = this.appSettings.settings;
    this._pathValidation.validateLoggedUser();
    this.cmnEntity = this._pathValidation.rowEntities();
  }

  ngOnInit() {
    this.userID = sessionStorage.getItem('userID');
    this.password = sessionStorage.getItem('password');
    this.getMenues(this.userID);
  }

  toggleParentChildMenu(pmenu, menu, pmel, cmel) {
    debugger
    var ppmel = pmel + menu.menuId.toString();
    var pcmel = cmel + menu.menuId.toString();
    let menuItem = document.getElementById(ppmel);
    let subMenu = document.getElementById(pcmel);
    if (subMenu) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }

    this.closeOtherChildMenus(pmenu, menu.menuId, pmel, cmel);
  }

  closeOtherChildMenus(menuList, menuId, pmel, cmel) {
    debugger
    var hasChildList = menuList.filter(x => x.ChildMenues.length > 0 && x.menuId != menuId);
    if (hasChildList) {
      hasChildList.forEach(item => {
        var ppmel = pmel + item.menuId.toString();
        var pcmel = cmel + item.menuId.toString();
        let menuItem = document.getElementById(ppmel);
        let subMenu = document.getElementById(pcmel);
        if (subMenu) {
          if (subMenu.classList.contains('show')) {
            subMenu.classList.remove('show');
            menuItem.classList.remove('expanded');
          }
        }
      });
    }
  }


  //Get Side Menu
  public _getSideMenuUrl: string = 'menu/getmenu';
  getMenues(userId) {
    debugger;
    var param = { UserId: userId, id: this.cmnEntity.roleId };
    var apiUrl = this._getSideMenuUrl;
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .toPromise().then(
        response => {
          debugger;
          this.res = response;
          var parentMenues = [];
          var childMenues = [];
          var subChildMenues = [];
          if (this.res.resdata.mainMenues != '') {
            debugger;
            parentMenues = JSON.parse(this.res.resdata.mainMenues);
            if (this.res.resdata.childMenues != '') {
              childMenues = JSON.parse(this.res.resdata.childMenues);
              if (this.res.resdata.subChildMenues != '') {
                subChildMenues = JSON.parse(this.res.resdata.subChildMenues);
                childMenues.forEach((item, index) => {
                  var scmodel = subChildMenues.filter(x => x.subParentId == item.menuId);
                  item.ChildMenues=scmodel;
                });
              }

              parentMenues.forEach((item, index) => {
                var cmodel = childMenues.filter(x => x.parentId == item.menuId);
                item.ChildMenues=cmodel;
              });

            }

            //var menuList = JSON.parse(this.res.resdata.menues);
            this.listMenues = this.setBooleanType(parentMenues);
            sessionStorage.setItem('menuList', JSON.stringify(this.listMenues));
          }
        }, error => {
          console.log(error);
        }
      );
  }
  //Get Side Menu



  // public _getUrl: string = 'menu/getmenu';
  // getSideMenues(userId) {
  //   var param = { UserId: userId, id: this.cmnEntity.roleId };
  //   var apiUrl = this._getUrl;
  //   this._dataservice.getWithMultipleModel(apiUrl, param)
  //     .toPromise().then(
  //       response => {
  //         debugger;
  //         this.res = response;
  //         this.listMenues = [];
  //         if (this.res.resdata.menues.length > 0) {
  //           var menuList = JSON.parse(this.res.resdata.menues);
  //           this.listMenues = this.setBooleanType(menuList);
  //           sessionStorage.setItem('menuList', JSON.stringify(this.listMenues));
  //         }
  //       }, error => {
  //         console.log(error);
  //       }
  //     );
  // }

  setBooleanType(modelList: any = []) {
    modelList.forEach(item => {
      item.isView = item.isView == '1' ? true : false;
      item.isInsert = item.isInsert == '1' ? true : false;
      item.isUpdate = item.isUpdate == '1' ? true : false;
      item.isDelete = item.isDelete == '1' ? true : false;
      item.isEdit = item.isEdit == '1' ? true : false;
      item.isViewOnly = item.isViewOnly == '1' ? true : false;
      item.isShow = item.isShow == '1' ? true : false;
      item.hasChild = item.hasChild == '1' ? true : false;
      if (item.ChildMenues.length > 0) {
        item.ChildMenues = this.setChildBooleanType(item.ChildMenues);
      }
    });

    return modelList;
  }

  setChildBooleanType(modelList: any = []) {
    modelList.forEach(item => {
      item.isView = item.isView == '1' ? true : false;
      item.isInsert = item.isInsert == '1' ? true : false;
      item.isUpdate = item.isUpdate == '1' ? true : false;
      item.isDelete = item.isDelete == '1' ? true : false;
      item.isEdit = item.isEdit == '1' ? true : false;
      item.isViewOnly = item.isViewOnly == '1' ? true : false;
      item.isShow = item.isShow == '1' ? true : false;
      item.isSubParent = item.isSubParent == '1' ? true : false;
      item.hasChild = item.hasChild == '1' ? true : false;
      if (item.ChildMenues.length > 0) {
        item.ChildMenues = this.setSubChildBooleanType(item.ChildMenues);
      }
    });

    return modelList;
  }

  setSubChildBooleanType(modelList: any = []) {
    modelList.forEach(item => {
      item.isView = item.isView == '1' ? true : false;
      item.isInsert = item.isInsert == '1' ? true : false;
      item.isUpdate = item.isUpdate == '1' ? true : false;
      item.isDelete = item.isDelete == '1' ? true : false;
      item.isEdit = item.isEdit == '1' ? true : false;
      item.isViewOnly = item.isViewOnly == '1' ? true : false;
      item.isShow = item.isShow == '1' ? true : false;
      item.hasChild = item.hasChild == '1' ? true : false;
    });

    return modelList;
  }

  setMenu(event, menu) {
    event.stopPropagation();
    sessionStorage.setItem('menu', JSON.stringify(menu));
  }

}
