import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessagesService } from './messages.service';
import { DataService } from '../../../api/api.dataservice.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { BDDate } from 'src/app/api/api.bddate.service';
import { Router } from '@angular/router';
import { Conversion } from 'src/app/api/api.conversion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Conversion, BDDate]
})
export class MessagesComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public selectedTab: number = 1;
  public messages: Array<Object>;
  public files: Array<Object>;
  public meetings: Array<Object>;
  public toYearBN: string = '';
  //public notiBnStDate: string = '';
  //public notiBnEnDate: string = '';
  //public toDateBD: string = '';
  //private stbd: string = '10-15';
  //private enbd: string = '12-30';
  private sten: string = '01-28';
  private enen: string = '04-13';
  private LoggedUserId = sessionStorage.getItem("userID");
  constructor(private _dataservice: DataService,
    public router: Router,
    private _bddate: BDDate,
    public dialog: MatDialog,
    private _conversion: Conversion,
    public snackBar: MatSnackBar
    //private messagesService: MessagesService
  ) {
    //this.messages = messagesService.getMessages();
    //this.files = messagesService.getFiles();
    //this.meetings = messagesService.getMeetings();
  }

  public dtToday: Date = null;
  public dtFrom: Date = null;
  public dtTo: Date = null;

  ngOnInit() {
    var toYear = this._conversion.TodayYear();
    var toDay = this._conversion.Today();
    this.dtToday = new Date(toDay);
    this.dtFrom = new Date(toYear.toString() + '-' + this.sten);
    this.dtTo = new Date(toYear.toString() + '-' + this.enen);
    this.toYearBN = this._bddate.getDatebd(new Date()).yearEN.toString();
    this.getNotification();
  }

  public notiCount: string = '0';
  public notiCountEn: number = 0;
  public notificationUrl: string = 'khajna/getduenewkhajnacount';
  getNotification() {
    var param = { yearBN: parseInt(this.toYearBN), LoggedUserId: this.LoggedUserId };
    var apiUrl = this.notificationUrl;
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(
        response => {
          var res = response;
          debugger;
          if (res.resdata != null) {
            this.notiCountEn = res.resdata.khajnaCount;
            this.notiCount = this._conversion.enNumToBnNum(this.notiCountEn);

            if (this.dtToday <= this.dtTo && this.dtToday >= this.dtFrom) {
              var messages = ' \n ***এ বছর ' + this.notiCount + ' টি খাজনা বকেয়া/নতুন পাওয়া গেছে। \n \n দয়া করে খাজনা পরিশোধ করুন।*** \n ';
              this.snackBar.open(messages, 'X', {
                duration: 2000000,
                verticalPosition: 'top',
                panelClass: ['infoNotification']
              });
            }
          }
        }, error => {
          console.log(error);
        });
  }

  clickToList() {
    debugger;
    if (this.notiCountEn > 0) {
      this.setMenu();
    }
  }

  setMenu() {
    debugger;
    var menuList = JSON.parse(sessionStorage.menuList);
    var pmenu = menuList.filter(x => x.menuId == 9)[0];
    var cmenu = pmenu.ChildMenues.filter(x => x.menuId == 16)[0];
    var menu = cmenu.ChildMenues.filter(x => x.menuId == 23)[0];
    sessionStorage.setItem('menu', JSON.stringify(menu));
    this.router.navigate([menu.menuPath]);
  }

  // openMessagesMenu() {
  //   this.trigger.openMenu();
  //   this.selectedTab = 0;
  // }

  // onMouseLeave() {
  //   this.trigger.closeMenu();
  // }

  // stopClickPropagate(event: any) {
  //   event.stopPropagation();
  //   event.preventDefault();
  // }

  // public notiCount:number=0;
  // public aprvMessages: any = [];
  // public dclnMessages: any = [];
  // public notificationUrl: string = 'ProcessFlow/getapprovalcommentsbyloggeduser';
  // getNotification() {
  //   var param = { LoggedUserId: this.LoggedUserId };
  //   var apiUrl = this.notificationUrl;
  //   this._dataservice.getWithMultipleModel(apiUrl, param)
  //     .subscribe(
  //       response => {
  //         var res = response;
  //         debugger;
  //         if (res.resdata.commentsList.length > 0) {
  //           var messageList = JSON.parse(res.resdata.commentsList);
  //           messageList.forEach(element => {
  //             element.isApproved=element.isApproved=='1'?true:false;
  //             element.isDeclined=element.isDeclined=='1'?true:false;
  //             element.name=element.fromUser;
  //             element.text=element.comment;
  //             element.time='1 min ago';
  //           })
  //           ;this.notiCount=messageList.length;
  //           this.aprvMessages = messageList.filter(x => x.isApproved == true);
  //           this.dclnMessages = messageList.filter(x => x.isDeclined == true);
  //         }
  //       }, error => {
  //         console.log(error);
  //       });
  // }

  // public appModel: any;
  //   public urlComment: string = 'ProcessFlow/getapprovalcomments';
  //   getCommentList(ev, model) {
  //       debugger;
  //       ev.preventDefault();
  //       var param = { loggedUserId: this.LoggedUserId, strId: model.quotationId, strId2: model.categoryId };
  //       var ModelsArray = [param];
  //       var apiUrl = this.urlComment;
  //       this._dataservice.getWithMultipleModel(apiUrl, ModelsArray)
  //           .subscribe(response => {
  //               var res = response;
  //               debugger;
  //               //this.resmessage = this.res.resdata.message;
  //               if (res.resdata.tranMstr != null) {
  //                   this.appModel = res.resdata.tranMstr;
  //                   this.appModel.commentList = JSON.parse(res.resdata.tranDtl);
  //                   //this.trigger.closeMenu();
  //                   this.openAppModaDialog();
  //               } //else {
  //               //this._msg.warning(this.resmessage);
  //               //}
  //           }, error => {
  //               console.log(error);
  //           });
  //   }

  // //Aproval Process
  // @ViewChild('modalApprovalProcessed') modalApprovalProcess: TemplateRef<any>;
  // private _appDialogRef: MatDialogRef<TemplateRef<any>>;
  // openAppModaDialog(): void {
  //     const _config = new MatDialogConfig();
  //     _config.restoreFocus = false;
  //     _config.autoFocus = false;
  //     _config.role = 'dialog';
  //     _config.width = '40%';
  //     _config.panelClass = 'modalTopPosition';

  //     //modaltype != '' ? this.createModalForm(modaltype) : null;

  //     this._appDialogRef = this.dialog.open(this.modalApprovalProcess, _config);

  //     this._appDialogRef.afterClosed().subscribe(result => {
  //         //this.resetModal();
  //         this.appModel = undefined;
  //         this.getNotification();
  //     });
  // }

  // public _urlForward: string = 'ProcessFlow/processforwardonly';
  // submitForward(model) {
  //     debugger;
  //     var dModel = this.appModel.commentList.filter(x => x.processFlowDetailId == model.processFlowDetailId && x.processTypeId == model.processTypeId && x.sequences == model.currentSequence && x.userId == model.userId)[0];
  //     var pModel = { transactionId: dModel.transactionId, transactionDetailId: dModel.transactionDetailId, quotationId: dModel.quotationId, categoryId: dModel.categoryId, processFlowId: dModel.processFlowId, processFlowDetailId: dModel.processFlowDetailId, processTypeId: dModel.processTypeId, sequences: dModel.sequences, fromUserId: dModel.fromUserId, toUserId: dModel.toUserId, userId: dModel.userId };
  //     var param = { loggedUserId: this.LoggedUserId, strId: model.quotationId, strId2: model.categoryId, values: this.appModel.comments };
  //     var ModelsArray = [param, pModel];
  //     var apiUrl = this._urlForward;
  //     this._dataservice.postMultipleModel(apiUrl, ModelsArray)
  //         .subscribe(response => {
  //             var res = response;
  //             var resmessage = res.resdata.message;
  //             if (res.resdata.resstate) {                  
  //                 this._msg.success(resmessage);                  
  //             } else {
  //                 this._msg.warning(resmessage);
  //             }
  //         }, error => {
  //             console.log(error);
  //         });
  // }

  // public _urlBackwar: string = 'ProcessFlow/processbackwardonly';
  // submitBackward(model) {
  //     debugger;
  //     var dModel = this.appModel.commentList.filter(x => x.processFlowDetailId == model.processFlowDetailId && x.processTypeId == model.processTypeId && x.sequences == model.currentSequence && x.userId == model.userId)[0];
  //     var pModel = { transactionId: dModel.transactionId, transactionDetailId: dModel.transactionDetailId, quotationId: dModel.quotationId, categoryId: dModel.categoryId, processFlowId: dModel.processFlowId, processFlowDetailId: dModel.processFlowDetailId, processTypeId: dModel.processTypeId, sequences: dModel.sequences, fromUserId: dModel.fromUserId, toUserId: dModel.toUserId, userId: dModel.userId };
  //     var param = { loggedUserId: this.LoggedUserId, strId: model.quotationId, strId2: model.categoryId, values: this.appModel.comments };
  //     var ModelsArray = [param, pModel];
  //     var apiUrl = this._urlBackwar;
  //     this._dataservice.postMultipleModel(apiUrl, ModelsArray)
  //         .subscribe(response => {
  //             var res = response;
  //             var resmessage = res.resdata.message;
  //             if (res.resdata.resstate) {
  //                 this._msg.success(resmessage);
  //             } else {
  //                 this._msg.warning(resmessage);
  //             }
  //         }, error => {
  //             console.log(error);
  //         });
  // }
  // //Aproval Process

}
