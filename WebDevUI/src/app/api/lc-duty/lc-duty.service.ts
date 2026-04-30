import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()

export class LcDutyService {

 // private urlHeader = "http://192.168.44.31:180/lcduty.api/";
  private urlHeader = "https://app.citygroupbd.com/JUBORAJ_WEB_API/LC_DUTY/";

  private urlGetAllLC = this.urlHeader + "value/getAllLCNumber";
  private urlGetAllCompanyName = this.urlHeader + "value/getAllCompanyName";
  private urlGetAllItem = this.urlHeader + "value/getAllItem";
  private urlGetAllExpenseHead = this.urlHeader + "value/getAllExpenseHead";
  private urlGetAllFavouring = this.urlHeader + "value/getAllFav";

  private urlGetCompanyAndItemFromLC = this.urlHeader + "value/getCompAndItemFromLc?p_lc_oid=";
  private urlGetOnlyQtyFromLC = this.urlHeader + "value/getOnlyQtyFromLC?p_lc_oid=";
  private urlGetAlreadyExbondFromLC = this.urlHeader + "value/getQtyFromLC?p_lc_oid=";
  private urlGetShipmentListFromLC = this.urlHeader + "value/getShipmentFromLcOid?p_lc_oid=";

  private urlGetShipmentQtyFromShipmentOID = this.urlHeader + "value/getShipmentQtyFromShipmentOid?p_shp_oid=";

  private urlInsertDuty = this.urlHeader + "value/insertIntoCityn?P_TRANS_ID=";

  private urlGetAllTransactionWithUserId = this.urlHeader + "value/getTransAndLcWithUserid?p_u_id=";
  private urlGetDetailsFromTransNo = this.urlHeader + "value/getFullDetailsDuty?p_trns_no=";
  private urlGetLcWithCompanyAndItem = this.urlHeader + "value/getLcNumberWithCompAndItem?compId=";

  private urlInsertFavouring = this.urlHeader + "value/insertFav?F_OID="

  constructor(private http: HttpClient) { 

  }



  public getAllLc(){
    var url = this.urlGetAllLC;
    return this.http.get(url);
  }

  public getAllCompanyName(){
    var url = this.urlGetAllCompanyName;
    return this.http.get(url);
  }

  public getAllIteam(){
    var url = this.urlGetAllItem;
    return this.http.get(url);
  }

  public getAllExpenseHead(){
    var url = this.urlGetAllExpenseHead;
    return this.http.get(url);
  }

  public getAllFavouring(){
    var url = this.urlGetAllFavouring;
    return this.http.get(url);
  }




  public getCompanyAndItemFromLC(lcOid: string){
    var url = this.urlGetCompanyAndItemFromLC + lcOid;
    return this.http.get(url);
    
    
  }

  public loadOnlyQntyFromLc(lcOid: string){
    var url = this.urlGetOnlyQtyFromLC + lcOid;
    return this.http.get(url);
  }

  public loadAlreadyExbondFromLC(lcOid: string){
    var url = this.urlGetAlreadyExbondFromLC + lcOid;
    return this.http.get(url);
  }

  public loadShipmentFromLC(lcOid: string){
    var url = this.urlGetShipmentListFromLC + lcOid;
    return this.http.get(url);
  }


  public loadShipmentQtyFromShipmentOID(shipmentOID : string){
    var url = this.urlGetShipmentQtyFromShipmentOID + shipmentOID;
    return this.http.get(url);
  }



  public insertDuty(P_TRANS_ID, P_SHIPMENT_OID, P_LC_OID, P_PAYEE_OID, P_BILL_NO, P_BILL_DATE, P_BL_REFF_NO, P_B_OF_ENTRY_REFF_NO, P_EXP_TYPE, 
    P_BDT_EX_RATE, P_LC_QTY, P_SHIPMENT_QTY, P_EXBOND_QTY, P_REMARKS, P_REQ_BY, P_REQ_DATE, P_PROD_OID, p_det_string){

      var url = this.urlInsertDuty + P_TRANS_ID 
      +"&P_SHIPMENT_OID=" + P_SHIPMENT_OID
      +"&P_LC_OID=" + P_LC_OID
      +"&P_PAYEE_OID=" + P_PAYEE_OID

      +"&P_BILL_NO=" + P_BILL_NO
      +"&P_BILL_DATE=" + P_BILL_DATE

      +"&P_BL_REFF_NO=" + P_BL_REFF_NO
      +"&P_B_OF_ENTRY_REFF_NO=" + P_B_OF_ENTRY_REFF_NO
      +"&P_EXP_TYPE=" + P_EXP_TYPE
      +"&P_BDT_EX_RATE=" + P_BDT_EX_RATE
      +"&P_LC_QTY=" + P_LC_QTY
      +"&P_SHIPMENT_QTY=" + P_SHIPMENT_QTY
      +"&P_EXBOND_QTY=" + P_EXBOND_QTY
      +"&P_REMARKS=" + P_REMARKS
      +"&P_REQ_BY=" + P_REQ_BY
      +"&P_REQ_DATE=" + P_REQ_DATE
      +"&P_PROD_OID=" + P_PROD_OID
      +"&p_det_string=" + p_det_string;
      return this.http.get(url);
  }



  public getTransactionListForAdvanceSearchWithUserId(userId : string){
    var url = this.urlGetAllTransactionWithUserId + userId;
    return this.http.get(url);
  }

  public getDetailsFromTransNo(transNo : string){
    var url = this.urlGetDetailsFromTransNo + transNo;
    return this.http.get(url);
  }

  public getLcWithCompanyAndItem(companyOid: string, itemOid: string){
    var url = this.urlGetLcWithCompanyAndItem + companyOid + "&itemId=" + itemOid;
    return this.http.get(url);
  }




  public insertFavouring(favOID, favName, favAddress, contactNumber, email, date, status,  userID, mode){

      
      var compOID = "NULL";
      var acc = "null";
      var EUSER = "null";
      var EDAT = "null";

      console.log("Name: " + favName + "\nAddress: " + favAddress + "\nContact: " + contactNumber + "\nEmail: " + email);

        var url = this.urlInsertFavouring + favOID
           + "&FAV_COMPANY=" + compOID
           + "&FAV_ACC=" + acc
           + "&FAV_NAME=" + favName
           + "&FAV_ADDRESS=" + favAddress
           + "&FAV_EMAIL=" + email
           + "&IUSER=" + userID
           + "&IDAT=" + date
           + "&CONTACT_NUMBER=" + contactNumber
           + "&EUSER=" + EUSER
           + "&EDAT=" + EDAT
           + "&P_MODE=" + mode
           + "&IS_ACTIVE=" + status

      
      return this.http.get(url);
  }


 

}
