import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {ApiService} from '../api/api.service';
import { DataService } from 'src/app/api/api.dataservice.service';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService implements OnInit {

  //public userID = sessionStorage.getItem("userID");
  public cmnEntity: any = {};
  public res: any;

  constructor(private http: HttpClient, 
    private _router: Router, 
    private api: ApiService,
    private _dataservice:DataService
    ) {}

  ngOnInit(){

  }

  // getMenu() {  
  //   return this.api.getMenuUrlMonirVai(this.userID);
  // }

  getMenu(model, menuPath){
    return this.getVMenu(model,menuPath);
  }
  public listMenues:any=[];
  //public _getUrl: string = 'menu/getmenubyparam';
  public _getUrl: string = 'menu/checkmenuifexist';
  getVMenu(model, menuPath){
    var param = { UserId: model.userId, id: model.roleId, values:menuPath};
    var apiUrl=this._getUrl;    
    return this._dataservice.getWithMultipleModel_Sync(apiUrl, param);
  }
}

