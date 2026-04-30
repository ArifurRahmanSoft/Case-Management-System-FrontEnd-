import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TruckStatusService {

  private urlHeader = "https://app.citygroupbd.com/JUBORAJ_WEB_API/SALES_DASHBOARD/TruckStatus/";

  private urlGetAllActiveProduct = this.urlHeader + "getAllActiveProduct?p_loc_oid=";
  private urlGetDetailsFromActiveProduct = this.urlHeader + "getDetailsWithProdId?p_product_group=";
  private urlGetTotalSummary = this.urlHeader + "getTotalSummaryWithLocId?p_loc_oid=";

  constructor(private http: HttpClient) { }



  public getAllActiveProduct(locationOID: string ){
    var url = this.urlGetAllActiveProduct + locationOID;
    return this.http.get(url);
  }

  public getDetailsWithActiveProduct(productOID: string, locationOID: string){
    var url = this.urlGetDetailsFromActiveProduct + productOID + "&p_loc_oid=" + locationOID;
    return this.http.get(url);
  }

  public getTotalSummary(locationOID: string ){
    var url = this.urlGetTotalSummary + locationOID;
    return this.http.get(url);
  }


}
