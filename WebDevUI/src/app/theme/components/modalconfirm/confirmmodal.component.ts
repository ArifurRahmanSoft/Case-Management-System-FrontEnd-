import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { Conversion } from '../../../api/api.conversion.service';
@Component({
    selector: 'modal-confirm',
    templateUrl: './confirmmodal.component.html',
    providers: [Conversion]
})
export class ConfirmModal implements OnInit {
    //public funcName: string;
    //public custMessage: string = '';
    //public model: any;
    public funcName: string = '';
    public custMessage: string = '';
    public model: any = {};
    public isShowMsgOne: boolean = true;
    public isShowMsgTwo: boolean = true;
    public isDualAction: boolean = true;
    //public msgConfModal:string='';

    @Output() funcConfirm: EventEmitter<any> = new EventEmitter();

    constructor(public dialogRef: MatDialogRef<ConfirmModal>, @Inject(MAT_DIALOG_DATA) public data: any, private _conversion: Conversion) { //, public dialog: MatDialog
        this.funcName=data.funcName;
        this.custMessage=data.custMessage;
        this.isDualAction=data.isDualAction;
        this.model=data.model;
    }

    ngOnInit() { }
    


    executeConf(event, isConfirm) {
        //this.funcConfirm.emit({ modalEvent: event, funcName: this.funcName, model: this.model, isConfirm: isConfirm });
        this.dialogRef.close({ modalEvent: event, funcName: this.funcName, model: this.model, isConfirm: isConfirm });        
    }



    // executeConf(event, isConfirm) {
    //     this.funcConfirm.emit({ modalEvent: event, funcName: this.funcName, model: this.model, isConfirm: isConfirm });
    // }

    //showModal() {
        //this._conversion.ModalShowNoDrop('modalConfirm');
        // $('#modalConfirm').css('z-index', '0');
        // $('#modalConfirm').css('margin-left', '-50000');
        // $('#modalConfirm').css('margin-top', '-50000');
    //}

    // openDialog() {
    //     this.dialog.open();
    //   }
}