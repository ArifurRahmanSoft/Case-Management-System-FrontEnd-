import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { LcDutyService } from '../../../api/lc-duty/lc-duty.service'

export interface DialogData {
  lcNo: string;
  transNo: string;
  transDate : string;
  userId: string;
  motherVessel: string;
  status: string;
}

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit {
  public allTransList : Array<{lcNo, transNo, transDate, userId, motherVessel, status, lcOID}> = [];
  dtOptions: DataTables.Settings = {};
  public displayStart = 0;

  public userId;
  public status;
  public send_data = "NULL";

  constructor(public dialogRef: MatDialogRef<AdvanceSearchComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public api : LcDutyService) {
    
    this.userId = data.userId;
    this.dtOptions = {
      // pagingType: 'full_numbers',
      order: [[0, 'null']],
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      'displayStart': this.displayStart,
      paging: true
    };
    this.advanceSearch();
    
   
    
    


   }


  ngOnInit(): void {

    
    
    
  }

  public closeDialog(transNo, lcNo, lcOID){
    this.dialogRef.close({trns:transNo, lcNumber: lcNo, lc_oid: lcOID});
  }


  public advanceSearch(){
    var list : Array<{lcNo, transNo, transDate, userId, motherVessel, status, lcOID}> = [];
    this.api.getTransactionListForAdvanceSearchWithUserId(this.userId)
    .subscribe((data: Response) => {
      let test = data as Object;
      for (let i = 0; i < Object.keys(data).length; i++) {
        list.push({lcNo: test[i].LTRNM_LCNO, transNo: test[i].TRNS_NO, transDate: test[i].TRNS_DATE, userId: test[i].IUSER, motherVessel: test[i].LMVSL_NAME, status: test[i].DEPT_APPROVE_STATUS, lcOID: test[i].LC_OID});
      }
      this.allTransList = list;
    });
  
  }


  public getStatusFromStatusCode(statusCode){
    if(statusCode.includes("0")){
      return "PENDING";
    }else if (statusCode == '-1') {
      return "REJECTED";
    }else {
      return "FORWARDED";
    }
  }

}
