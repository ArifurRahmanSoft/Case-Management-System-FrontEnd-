import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {ApiService} from '../../../api/api.service';

export interface DialogData {
  vNo: string;
  userId: string;
}

@Component({
  selector: 'app-reject-voucher',
  templateUrl: './reject-voucher.component.html',
  styleUrls: ['./reject-voucher.component.scss']
})
export class RejectVoucherComponent implements OnInit {

  public vNo;
  public userId;
  public reason = "";

  constructor(public dialogRef: MatDialogRef<RejectVoucherComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private api: ApiService, public dialog: MatDialog, ) { 
    this.vNo = data.vNo;
    this.userId = data.userId;
    
  }

  ngOnInit(): void {
  }

  public rejectVoucher(){
    this.dialogRef.close({data:this.reason});
  }

}
