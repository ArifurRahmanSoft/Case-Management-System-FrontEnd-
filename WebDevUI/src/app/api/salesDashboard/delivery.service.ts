import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private urlHeader = "https://app.citygroupbd.com/JUBORAJ_WEB_API/SALES_DASHBOARD/";

  private urlGetDateWiseDelivery = this.urlHeader + "api/Delivery/getDateWiseTotalDelivery?sel1=";
  private urlGetTypeWiseDelivery = this.urlHeader + "api/Delivery/getAllDeliverySummery?sel1=";
  private urlGetGroupAndTypeWiseDelivery = this.urlHeader + "api/Delivery/getGroupAndTypeWiseDelivery?sel1=";
  private urlGetProductWiseDelivery = this.urlHeader + "api/Delivery/getProductWiseDelivery?sel1=";

  private urlGetGroupAndTypeWiseUndelivered = this.urlHeader + "api/Undelivered/getGroupAndTypeUndelivered?sel1=";
  private urlGetProductWiseUndelivered = this.urlHeader + "api/Undelivered/getProductWiseUndelivered?sel1=";


  constructor(private http: HttpClient) { 

  }

  public getDateWiseDelivery(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetDateWiseDelivery + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getTypeWiseDelivery(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetTypeWiseDelivery + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getGroupAndTypetWiseDelivery(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetGroupAndTypeWiseDelivery + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getProductWiseDelivery(fromDate: string, toDate: string, master: string, sl: string){
    var url = this.urlGetProductWiseDelivery + fromDate + "&sel2=" + toDate + "&sel3="+ master + "&typs="  + sl;
    return this.http.get(url);
  }


  public getGroupAndTypeWiseUndelivered(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetGroupAndTypeWiseUndelivered + fromDate + "&sel2=" + toDate + "&userid=" + userId;
    return this.http.get(url);
  }

  public getProductWiseUndelivered(fromDate: string, toDate: string, master: string, sl: string){
    var url = this.urlGetProductWiseUndelivered + fromDate + "&sel2=" + toDate + "&sel3="+ master + "&sl="  + sl;
    return this.http.get(url);
  }


}
