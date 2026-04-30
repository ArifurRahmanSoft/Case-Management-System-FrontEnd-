import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ConfirmModal } from '../modalconfirm/confirmmodal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'common-button-top',    
    templateUrl: './commonbutton-top.component.html'    
})

export class CommonService implements OnInit {
//    @ViewChild('fromConfirmModal', {static: false}) _confirmmodal: ConfirmModal;
    
    @Input() cmnEntity:any;
    @Input() btnForm:any;
    @Input() model: any;
    @Input() itemName:string='';
    public modelIndex:number;
    public dialogConfig:any;

    @Output() executeSubmit: EventEmitter<any> = new EventEmitter();

    constructor(
        public dialog: MatDialog,
        private toastr: ToastrService
        //, public dialogConfigs:MatDialogConfig
        ) {
        //this.dialog= new MatDialog();
        this.dialogConfig=new MatDialogConfig();
        // var btnInfo=this.userDefinedButton.filter(x=> x.btnId==6)[0];
        // btnInfo.btnName=this.cmnEntity.isShow?'Create':'Show List';
    }

    ngOnInit() { }

    execute(event, funcName, isConfirm) {
        this.executeSubmit.emit({ event: event, model: this.model, func: funcName, isConfirm:isConfirm});
    }
    
    openModal(index){
        this.cmnEntity.funcIndex=index;
        //this.dialogConfig.backdropClass='backdropBackground';
        //this.dialogConfig.width='30%';        
        this.dialogConfig.data={funcName:this.cmnEntity.cmnBtn[index].btnFunc
            , custMessage:this.cmnEntity.cmnBtn[index].message+' '+this.itemName.toString()
            , isDualAction:this.cmnEntity.cmnBtn[index].isDual
            , model:this.model
        };

        this.dialogConfig.hasBackdrop=true;
        this.dialogConfig.disableClose=true;
        this.dialogConfig.panelClass='confirm-modal';

        const dialogRef=this.dialog.open(ConfirmModal,this.dialogConfig );

        dialogRef.afterClosed().subscribe(result => {
            debugger;
            if(result!='' && result!=undefined){
                var rs=result;            
                this.execute(rs.modalEvent, rs.funcName, rs.isConfirm);

                // if(this.modelIndex==1 || this.modelIndex==2){
                //     this.cmnEntity.isEdit=false; this.cmnEntity.isViewOnly=false; 
                // }
            }
        });

        // dialogRef.backdropClick().subscribe(result=>{
        //     debugger;
        //     this.dialog.closeAll();
        // });
    }

    success(msg){        
        this.toastr.success(msg, 'Success!');
        if(this.cmnEntity.funcIndex==1 || this.cmnEntity.funcIndex==2)
        {
            this.cmnEntity.isEdit=false; this.cmnEntity.isViewOnly=false; 
            this.cmnEntity.funcIndex=0;
        }
    }
    info(msg){
        this.toastr.info(msg, 'Information!');
    }
    warning(msg){
        this.toastr.warning(msg, 'Warning!');
    }
    error(msg){
        this.toastr.error(msg, 'Error!');
    }

    setOption(){
        return {
            allowClear: true, theme: 'default', closeOnSelect: true, templateSelection: (object: any) => {
                return object && object.text;
            },
            templateResult: (object: any) => {
                return object && object.text;
            }
        };
    }
}

// @Component({
//     selector: 'common-button-top',
//     templateUrl: './commonbutton-top.component.html'
// })

// export class CommonButtonTop extends CommonService {}

@Component({
    selector: 'common-button-option',
    templateUrl: './commonbutton-option.component.html'
})

export class CommonButtonOption extends CommonService {}
