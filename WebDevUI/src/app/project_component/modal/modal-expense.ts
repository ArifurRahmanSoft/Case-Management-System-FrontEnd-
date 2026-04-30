import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import numWords from 'num-words';
import numWordsDirect from 'num-words';
import numWordsPaisa from 'num-words';
import { UtilService } from '../../util/util.service';
import {ApiService} from '../../api/api.service';
import {RejectVoucherComponent} from '../modal/reject-voucher/reject-voucher.component';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
    vNo: string;
    radioType: string;
    vDate : string;
    userId: string;
    status: string;
    flag: string;
    comesFrom: string;
  }

@Component({
    selector: 'modal',
    templateUrl: 'modal_expense.html',
  })
  export class ModalExpense implements OnInit{
  
    public isLoaded = false;
    public vNo;
    public vType;
    public userId;
    public flag;
    public voucherDate;
    public voucherDetailsList : any;
    public totalDebit = 0;
    public totalCredit = 0;
    public notes;
    public lcNo;
    public expenseGroup;
    public inWords;
    public numberString;
    public replyMessage;
    public send_data = "You didn't approved";
    public checkedBy;
    public approvedBy;
    public preparedBy;
    public status;
    public comesFrom;

    public voucherModel = {};
  
  
    constructor(public dialogRef: MatDialogRef<ModalExpense>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private api: ApiService, 
                    public dialog: MatDialog, private util: UtilService, private toastr: ToastrService) {
  
      this.vNo = data.vNo;
      this.vType = data.radioType;
      this.voucherDate = data.vDate;
      this.userId = data.userId;
      this.status = data.status;
      this.flag = data.flag;
      this.comesFrom = data.comesFrom;
    }
  
    ngOnInit(){
  
      this.getVoucherDetailsForExpense(this.vNo);
    }
  
  
     closeDialog() : void{
       
       this.dialogRef.close({data:this.send_data});
    }
  
    approveVoucher() : void{
  
      this.getVoucherApprovalMessage(this.vNo, this.userId);
  
    }
  
    public getVoucherDetailsForExpense(voucherNo){
  
      this.api.getExpenseVoucherDetails(voucherNo)
      .subscribe((res : any[])=>{
        res.forEach(obj =>{
          this.totalDebit += obj.DEBITAMOUNT;
          this.totalCredit += obj.CREDITAMOUNT;
          if(obj.NOTE == null || obj.NOTE == ""){
            this.notes = "";
          }else {
            this.notes = obj.NOTE;
          }
          this.lcNo = obj.LCNO;
          this.expenseGroup = obj.EXPENSEGROUP;
  
          this.checkedBy = obj.VERIFIEDBY;
          this.preparedBy = obj.PREPAREDBY;
          this.approvedBy = obj.APPROVEDBY;
  
        });
  
        this.voucherDetailsList = res;
        
  
        this.numberString = this.totalDebit.toString();
        if(this.numberString.includes(".")){
  
          var fristPart = this.numberString.substring(0, this.numberString.indexOf(".") + 1);
          var secondPart = this.numberString.substring(this.numberString.indexOf(".") + 1);
  
          var firstInWord = numWords(fristPart);
          var secondInWord = numWordsPaisa(secondPart);
  
          this.inWords = firstInWord + " And " + secondInWord + " Paisa Only" 
  
        }else {
  
          this.inWords = numWordsDirect(this.totalDebit) + " Taka Only";
        }
        
  
      });
  
    }
  
  
  
  public getVoucherApprovalMessage(voucherNo, userId) {

    if (this.comesFrom == "Verify") {

      this.getVoucherApprovalMessageForVarify(voucherNo, userId);

    } else {

      this.getVoucherApprovalMessageForApprove(voucherNo, userId);

    }


  }

    public getVoucherApprovalMessageForVarify(voucherNo, userId){

      this.api.getVerifyVoucher(voucherNo, userId)
      .subscribe((data: Response) => {
        this.replyMessage = data;
        this.dialogRef.close({data: this.replyMessage});
      });
  
      
    }


    public getVoucherApprovalMessageForApprove(voucherNo, userId){

      this.api.getApproveVoucher(voucherNo, userId)
      .subscribe((data: Response) => {
        this.replyMessage = data;
        this.dialogRef.close({data: this.replyMessage});
      });
  
      
    }

  
    public numberWithCommas(number){
      return this.util.numberWithCommasForTon(number);
    }



    public rejectVoucher(){
      const dialogRef = this.dialog.open(RejectVoucherComponent, {
        data: {vNo: this.vNo, userId: this.userId}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.data == "" || result.data == null){
          alert("NULL")
        }else {
          var voucherNo = this.vNo;
          var reason = result.data;
          var userId = this.userId;

          this.voucherModel = {
            "VOUCHERNO": voucherNo,
            "LOGGEDUSER": userId,
            "CAUSEOFREJECTION": reason
            }

            this.api.rejectVoucher(this.voucherModel)
            .subscribe(data => {
              if (data.toString().includes("The voucher rejected successfully")) {
                this.toastr.success(data.toString(), 'SUCCESS!'); // message , title     error, info, warning, success
                this.dialogRef.close({data: "Reject Success"});
              } else {
                this.toastr.error(data.toString(), 'OPPS!'); // message , title     error, info, warning, success
                this.dialogRef.close({data:this.send_data});
              }

              
    
          });

        }
       
      });


    }
  
  }