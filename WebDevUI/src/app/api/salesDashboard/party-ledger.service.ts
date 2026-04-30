import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PartyLedgerService {

  private urlHeader = "https://app.citygroupbd.com/JUBORAJ_WEB_API/SALES_DASHBOARD/";

  private urlGetBulkPartyLedger = this.urlHeader + "api/PartyLedger/getOnlyBulkPartyLedger?sel1=";
  private urlGetConsumerPartyLedger = this.urlHeader + "api/PartyLedger/getOnlyConsumerPartyLedger?sel1=";
  private urlGetInstitutionalPartyLedger = this.urlHeader + "api/PartyLedger/getOnlyInstitutionalPartyLedger?sel1=";

  constructor(private http: HttpClient) { 

  }

  public getBulkPartyLedger(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetBulkPartyLedger + fromDate + "&sel2=" + toDate + "&sl=2&userid=" + userId;
    return this.http.get(url);
  }

  public getConsumerPartyLedger(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetConsumerPartyLedger + fromDate + "&sel2=" + toDate + "&sl=3&userid=" + userId;
    return this.http.get(url);
  }

  public getInstitutionalPartyLedger(fromDate: string, toDate: string, userId: string){
    var url = this.urlGetInstitutionalPartyLedger + fromDate + "&sel2=" + toDate + "&sl=3&userid=" + userId;
    return this.http.get(url);
  }



}
