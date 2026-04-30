import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { VoucherModel } from './voucherModel';
import { UpdateUser } from './updateUser'
import { MyMenu } from './my_menu';
import { UpcommingShipment } from './upcomming_shipment';


@Injectable()
export class ApiService {

  //private urlHeader = "http://192.168.61.210:8090/";
 // private urlHeader = "http://192.168.44.31:8030/";
 private urlHeader = "https://app.citygroupbd.com/JUBORAJ_WEB_API/LCMS/";

  public loginURL = "https://app.citygroupbd.com/acmsapi/api/usersetup/verifyuser";
  public updatePasswordURL = "https://app.citygroupbd.com/acmsapi/api/usersetup/changepassword";
  

  private menuUrlMonirVai = this.urlHeader + "api/UserAccess/GetMenuByUser/";

  private urlJournalVoucherMaster = this.urlHeader + "api/VoucherApproval/GetJournalVoucherList/";

  private urlJournalVoucherDetail = this.urlHeader + "api/VoucherApproval/GetJournalVoucherDetail/";
  private urlExpenseVoucherDetail = this.urlHeader + "api/VoucherApproval/GetLCExpenseVoucherDetail/";
  private urlVoucherApprove = this.urlHeader       + "api/VoucherApproval/ApprovalAction/";
 

  public shipmentUrl = this.urlHeader + "api/Dashboard/GetUpcomingShipment";
  private urlGetUpcommingShipment = this.urlHeader + "api/Dashboard/GetUpcomingShipmentJSON/";
  private urlGetCuntryWiseImport = this.urlHeader + "api/Dashboard/GetCountryWiseImport";
  private urlGetYearWiseImport = this.urlHeader + "api/Dashboard/GetYearWiseImport/";
  private urlLoadAllProduct = this.urlHeader + "api/Dashboard/GetLCItem";
  private urGetlProductLcOpen = this.urlHeader + "api/Dashboard/ProductLCOpen/";
  private urlGetYearlyImport = this.urlHeader + "api/Dashboard/GetYearlyImport/";

 

  private urlVoucherArchive = this.urlHeader + "api/VoucherApproval/GetVoucherArchive/" ;

  
  private urlVoucherExpenseMaster = this.urlHeader + "api/VoucherApproval/GetLCExpListVerify/";
  private urlVerifyVoucher = this.urlHeader + "api/VoucherApproval/ApprovalActionVerify/";

  private urlGetLCExpListApprove = this.urlHeader + "api/VoucherApproval/GetLCExpListApprove/";
  private urlApproveVoucher = this.urlHeader + "api/VoucherApproval/ApprovalActionApprove/";

  
  private urlGetRoleList = this.urlHeader + "api/RoleSetup/GetRoleList/";
  private urlInsertRole = this.urlHeader + "api/RoleSetup/SaveRole/";
  private urlUpdateRole = this.urlHeader + "api/RoleSetup/UpdateRole/";
  private urlDeleteRole = this.urlHeader + "api/RoleSetup/CancelRole/";

  private urlGetMenuList = this.urlHeader + "api/MenuSetup/GetMenuList/";
  private urlInsertMenu = this.urlHeader + "api/MenuSetup/SaveMenu/";
  private urlUpdateMenu = this.urlHeader + "api/MenuSetup/UpdateMenu/";
  private urlDeleteMenu = this.urlHeader + "api/MenuSetup/CancelMenu/";

  private urlRejectVoucher = this.urlHeader + "api/VoucherApproval/ApprovalActionReject";

  
  my_menu_list:MyMenu[];
  shipment_list: UpcommingShipment[];
  

  constructor(private http: HttpClient) { 

  }





  


  public loginUser(userParam : User){
    return this.http.post(this.loginURL, userParam);
   }
   public updateUserPassword(userParam : UpdateUser){
    return this.http.post(this.updatePasswordURL, userParam);
   }



  getShipment(){
    this.http.get(this.shipmentUrl)
    .toPromise().then(data=> 
      this.shipment_list = data as UpcommingShipment[]
      );

      return this.shipment_list;
  }






  public getMenuUrlMonirVai(userId: string){
    var url = this.menuUrlMonirVai + userId;
    return this.http.get(url);
  }


  public getJournalVoucherMaster(userId: string){
    var url = this.urlJournalVoucherMaster + userId;
    return this.http.get(url);
  }


  public getJournalVoucherDetails(voucherNo: string){
    var url = this.urlJournalVoucherDetail + voucherNo;
    return this.http.get(url);
  }

  public getExpenseVoucherDetails(voucherNo: string){
    var url = this.urlExpenseVoucherDetail + voucherNo;
    return this.http.get(url);
  }

  public getVoucherApprove(voucherNo: string, userId: string){
    var url = this.urlVoucherApprove + voucherNo + "/" + userId;
    return this.http.get(url);
  }


  public getVoucherArchive(fromDate: string, toDate: string, type: string, voucherNo: string, userId: string){
    var url = this.urlVoucherArchive + fromDate + "/" + toDate + "/" + voucherNo + "/" + type + "/" + userId;
    return this.http.get(url);
  }


  public getRoleListUrl(){
    return this.urlGetRoleList;
  }

  public getRoleList(){
    var url = this.urlGetRoleList ;
    return this.http.get(url);
  }

  public insertRole(roleName: string, remarks: string, userId: string,  status: string){
    var url = this.urlInsertRole + roleName + "/" + remarks + "/" + userId + "/"  + status;
    return this.http.get(url);
  }

   public updateRole(roleId: string, roleName: string, remarks: string, userId: string,  status: string){
    var url = this.urlUpdateRole + roleId + "/" + roleName + "/" + remarks + "/" + userId + "/"  + status;
    return this.http.get(url);
  }

  public deleteRole(roleId: string,  userId: string){
    var url = this.urlDeleteRole + roleId + "/"  + userId ;
    return this.http.get(url);
  }





  public getMenuList(){
    var url = this.urlGetMenuList ;
    return this.http.get(url);
  }

  public insertMenu(menuName: string, menuPath: string, userId: string,  status: string){
    var url = this.urlInsertMenu + menuName + "/" + menuPath + "/" + userId + "/"  + status;
    return this.http.get(url);
  }

  public updateMenu(menuId: string, menuName: string, menuPath: string, userId: string,  status: string){
    var url = this.urlUpdateMenu + menuId + "/" + menuName + "/" + menuPath + "/" + userId + "/"  + status;
    return this.http.get(url);
  }

  public deleteMenu(menuId: string,  userId: string){
    var url = this.urlDeleteMenu + menuId + "/"  + userId ;
    return this.http.get(url);
  }













  
  public getExpenseVoucherMaster(userId: string){
    var url = this.urlVoucherExpenseMaster + userId;
    return this.http.get(url);
  }

  public getVerifyVoucher(voucherNo: string, userId: string){
    var url = this.urlVerifyVoucher + voucherNo + "/" + userId;
    return this.http.get(url);
  }




  
  public getLCExpListApprove(userId: string){
    var url = this.urlGetLCExpListApprove + userId;
    return this.http.get(url);
  }

  public getApproveVoucher(voucherNo: string, userId: string){
    var url = this.urlApproveVoucher + voucherNo + "/" + userId;
    return this.http.get(url);
  }









  public rejectVoucher(voucherModel : VoucherModel){
    return this.http.post(this.urlRejectVoucher, voucherModel);
   }






   public getUpcommingShipment(fromDate: string, toDate: string){
    var url = this.urlGetUpcommingShipment + fromDate + '/' + toDate;
    return this.http.get(url);
  }

  public getCountryWiseImport(){
    var url = this.urlGetCuntryWiseImport ;
    return this.http.get(url);
  }

  public getYearWiseImport(year: string){
    var url = this.urlGetYearWiseImport + year;
    return this.http.get(url);
  }

  public getLoadAllProduct(){
    var url = this.urlLoadAllProduct ;
    return this.http.get(url);
  }

  public getProductLcOpen(fromDate: string, toDate: string){
    var url = this.urGetlProductLcOpen + fromDate + '/' + toDate;
    return this.http.get(url);
  }

  public getYearlyImport(fromYear: string, toYear: string, oid: string){
    var url = this.urlGetYearlyImport + fromYear + '/' + toYear + "/" + oid;
    return this.http.get(url);
  }

}
