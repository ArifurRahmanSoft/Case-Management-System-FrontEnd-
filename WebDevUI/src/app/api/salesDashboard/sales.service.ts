import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private urlHeader = "https://app.citygroupbd.com/JUBORAJ_WEB_API/SALES_DASHBOARD/";

  private urlDateWiseSales = this.urlHeader + "api/Sales/getDateWiseSales?sel1=";
  private urlGetLocationWiseSales = this.urlHeader + "api/Sales/getLocationWiseSales?sel1=";
  private urlGetAdvanceSales = this.urlHeader + "api/Sales/getAdvanceSales?sel1=";
  private urlGetOtherSales = this.urlHeader + "api/Sales/getOtherSales?sel1=";
  private urlGetChequesInHand = this.urlHeader + "api/Collection/getChequesInHandNew?sel1=";
  private urlCollectionReport = this.urlHeader + "api/Collection/getCollectionWithDate?sel1=";
  private urlGetProductGroupWiseSales = this.urlHeader + "api/Sales/getGroupWiseTotalSalesWithIns?sel1=";
  private urlGetProductWiseTotalSales = this.urlHeader + "api/Sales/getItemTypeTotalSales?sel1=";

  constructor(private http: HttpClient) {

   }

   public getDateWiseSales(fromDate: string, toDate: string, userId: string){
     var url = this.urlDateWiseSales + fromDate + "&sel2=" + toDate + "&userid=" + userId;
     return this.http.get(url);
   }

   public getLocationWiseSales(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetLocationWiseSales + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getAdvanceSales(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetAdvanceSales + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getOtherSales(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetOtherSales + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getChequesInHand(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetChequesInHand + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getCollectionReport(fromDate: string, toDate: string, userId: string){
    var url = this.urlCollectionReport + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getProductGroupWiseSales(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetProductGroupWiseSales + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getProductWiseTotalSales(fromDate: string, toDate: string, userId: string, prodGroupOID: string, typs: string){
    var url = this.urlGetProductWiseTotalSales + fromDate + "&sel2=" + toDate + "&sel3=" + prodGroupOID + "&typs=" + typs + "&userid=" + userId;
    return this.http.get(url);
  }


}
