import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/api/api.dataservice.service';

@Injectable({
    providedIn: 'root'
})

export class pathValidation {
    public rowEntity: any = {};
    public resm: any;
    public _getUrl: string = 'menu/getmenubyparam';

    public userDefinedButton: any = [
        { btnId: 0, btnName: 'Reset', rbtnName: 'Reset', bClass: 'btn btn-danger btn-sm', rbClass: 'btn btn-danger btn-sm', iClass: 'fa fa-refresh', riClass: 'fa fa-refresh', btnFunc: 'reset', btnForm: '', isReverse: false, isShowBtn: true, message: '', isDual: false, isValid: false },
        { btnId: 1, btnName: 'Save', rbtnName: 'Save', bClass: 'btn btn-success btn-sm', rbClass: 'btn btn-success btn-sm', iClass: 'fa fa-save', riClass: 'fa fa-save', btnFunc: 'onSubmit', btnForm: 'subForm', isReverse: false, isShowBtn: true, message: 'You want to save new record(s)', isDual: false, isValid: false },
        { btnId: 2, btnName: 'Update', rbtnName: 'Update', bClass: 'btn btn-success btn-sm', rbClass: 'btn btn-success btn-sm', iClass: 'fa fa-edit', riClass: 'fa fa-edit', btnFunc: 'onSubmit', btnForm: 'subForm', isReverse: false, isShowBtn: true, message: 'You want to update these record(s)', isDual: false, isValid: false },
        { btnId: 3, btnName: 'View', rbtnName: 'View', bClass: 'btn btn-sm mr-2', rbClass: 'btn btn-sm mr-2', iClass: 'text-info fa fa-eye', riClass: 'text-info fa fa-eye', btnFunc: 'edit', btnForm: '', isReverse: false, isShowBtn: true, message: '', isDual: false, isValid: false },
        { btnId: 4, btnName: 'Edit', rbtnName: 'Edit', bClass: 'btn btn-sm mr-2', rbClass: 'btn btn-sm mr-2', iClass: 'text-warning fa fa-edit', riClass: 'text-warning fa fa-edit', btnFunc: 'edit', btnForm: '', isReverse: false, isShowBtn: true, message: '', isDual: false, isValid: false },
        { btnId: 5, btnName: 'Delete', rbtnName: 'Delete', bClass: 'btn btn-sm mr-2', rbClass: 'btn btn-sm mr-2', iClass: 'text-danger fa fa-trash-o', riClass: 'text-danger fa fa-trash-o', btnFunc: 'delete', btnForm: '', isReverse: false, isShowBtn: true, message: 'You want to delete', isDual: false, isValid: false },
        { btnId: 6, btnName: 'Show List', rbtnName: 'Create', bClass: 'btn btn-info btn-sm', rbClass: 'btn btn-info btn-sm', iClass: 'fa fa-list', riClass: 'fa fa-plus-circle', btnFunc: 'showHide', btnForm: '', isReverse: true, isShowBtn: true, message: '', isDual: false, isValid: false },
    ];

    constructor(private router: Router, private _dataservice: DataService) { }

    validate(location) {
        //var pathname = location.pathname == '/' ? location.hash : location.pathname;
        var pathname = location.hash;
        if (pathname.includes('#')) {
            pathname = pathname.replace('#', '');
        }
        debugger;
        this.rowEntity = {};
        if (sessionStorage.getItem('isLoggedIn')) {
            var ctity = JSON.parse(sessionStorage.getItem('menu'));
            if (ctity !== null && ctity.menuPath === pathname) {
                this.rowEntity = ctity;
            }
            else {
                var loggedMenu = sessionStorage.getItem('menuList');
                var strLoggedInfo = sessionStorage.getItem('loggedUser');
                if (loggedMenu.includes(pathname)) {
                    var loggedMenuList = JSON.parse(loggedMenu);
                    var loggedUser = JSON.parse(strLoggedInfo);
                    var tmenu = loggedMenuList.filter(x => x.menuPath === pathname && x.userId === loggedUser.userId)[0];
                    if (tmenu == undefined) {
                        debugger;
                        var childList = [];
                        childList = loggedMenuList.filter(x => x.ChildMenues.length > 0);
                        if (childList.length > 0) {
                            debugger;
                            var isFound = false;
                            childList.forEach(item => {
                                debugger;
                                if (isFound) { return; }
                                var strChild = JSON.stringify(item.ChildMenues);
                                if (strChild.includes(pathname)) {
                                    var cmenu = item.ChildMenues.filter(x => x.menuPath === pathname && x.userId === loggedUser.userId)[0];
                                    if (cmenu == undefined) {
                                        debugger;
                                        var schildList = [];
                                        schildList = item.ChildMenues.filter(x => x.ChildMenues.length > 0);
                                        if (schildList.length > 0) {
                                            schildList.forEach(items => {
                                                if (isFound) { return; }
                                                var scmenu = items.ChildMenues.filter(x => x.menuPath === pathname && x.userId === loggedUser.userId)[0]
                                                if (scmenu !== undefined) {
                                                    this.rowEntity = scmenu;
                                                    if (this.rowEntity !== undefined) {
                                                        sessionStorage.setItem('menu', JSON.stringify(this.rowEntity));
                                                        isFound = true;
                                                        return;
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        debugger;
                                        if (isFound) { return; }
                                        this.rowEntity = cmenu;
                                        if (this.rowEntity !== undefined) {
                                            sessionStorage.setItem('menu', JSON.stringify(this.rowEntity));
                                            isFound = true;
                                            return;
                                        }
                                    }
                                }
                            });

                            if (!isFound) {
                                debugger;
                                sessionStorage.clear();
                                this.router.navigate(['/login']);
                            }
                        }
                        else {
                            sessionStorage.clear();
                            this.router.navigate(['/login']);
                        }
                    }
                    else {
                        debugger;
                        this.rowEntity = tmenu;
                        if (this.rowEntity !== undefined) {
                            sessionStorage.setItem('menu', JSON.stringify(this.rowEntity));
                        }
                        else {
                            sessionStorage.clear();
                            this.router.navigate(['/login']);
                        }
                    }
                }
                else {
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                }
            }
        }
        else {
            sessionStorage.clear();
            this.router.navigate(['/login']);
        }

        //this.alterCmnBtn([{id:6,col:"isShowBtn",val:true}]);
    }

    rowEntities() {
        debugger;
        var btnRow=[];
        this.userDefinedButton.forEach(item => {
            btnRow.push(
                { btnId: item.btnId, btnName: item.btnName, rbtnName: item.rbtnName, bClass: item.bClass, rbClass: item.rbClass, iClass: item.iClass, riClass: item.riClass, btnFunc: item.btnFunc, btnForm: item.btnForm, isReverse: item.isReverse, isShowBtn: item.isShowBtn, message: item.message, isDual: item.isDual, isValid: item.isValid }
            );
        });

        this.rowEntity.cmnBtn = btnRow;
        return this.rowEntity;

    }

    alterCmnBtn(values: any = []) {
        if (values.length > 0) {
            debugger;
            values.forEach(item => {
                debugger;
                this.rowEntity.cmnBtn.filter(x => x.btnId == item.id)[0][item.col] = item.val;
            });
        }

    };

    // validate(pathname) {
    //     debugger;
    //     this.rowEntity = {};
    //     if (sessionStorage.getItem('isLoggedIn')) {
    //         var loggedUsers=JSON.parse(sessionStorage.getItem('loggedUser'));
    //         var param = { UserId: loggedUsers.userId, id: loggedUsers.roleId, values:pathname};
    //         var apiUrl=this._getUrl;    
    //         this._dataservice.getWithMultipleModel_Sync(apiUrl, param)
    //         .then(response=>{

    //             this.resm=response;
    //             if(this.resm.resdata.userMenu!=null){
    //               var routerLink=this.resm.resdata.userMenu.menuPath;
    //               if (pathname == routerLink) {
    //                     this.rowEntity = this.resm.resdata.userMenu;
    //                     if (this.rowEntity !== undefined) {
    //                         sessionStorage.setItem('menu', JSON.stringify(this.rowEntity));
    //                     }
    //                     else {
    //                         sessionStorage.clear();
    //                         this.router.navigate(['/home']);
    //                     }       
    //               }
    //             }

    //           });
    //     }
    //     else {
    //         sessionStorage.clear();
    //         this.router.navigate(['/login']);
    //     }
    // }

    validateLoggedUser() {
        this.rowEntity = {};
        if (sessionStorage.getItem('isLoggedIn')) {
            this.rowEntity = JSON.parse(sessionStorage.getItem('loggedUser'));
        }
        else {
            sessionStorage.clear();
            this.router.navigate(['/login']);
        }
    }

    ngSelect2Option() {
        return {
            allowClear: true
            , theme: 'default'
            , closeOnSelect: true
            , templateSelection: (object: any) => {
                return object && object.text;
            }
            , templateResult: (object: any) => {
                return object && object.text;
            }
        };
    }

    ngSelect2MultiOption() {
        return {
            multiple: true
            , allowClear: true
            , tags: true
            , closeOnSelect: false
            , templateSelection: (object: any) => {
                return object && object.text;
            }
            , templateResult: (object: any) => {
                return object && object.text;
            }
        };
    }
}