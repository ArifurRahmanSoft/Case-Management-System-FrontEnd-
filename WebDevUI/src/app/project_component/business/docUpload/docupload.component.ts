import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
import { Options } from 'select2';
declare var $: any;

@Component({
    selector: 'app-docupload',
    templateUrl: './docupload.component.html',
    styleUrls: ['./docupload.component.scss'],
    providers: [Conversion]
})

export class DocUploadComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
    @ViewChild('fileInput') _fileInput: ElementRef;
    private userID = sessionStorage.getItem("userID");
    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    public pageSize: number = 10;
    //public displayStart = 0;
    public isLoaded: Object = true;
    public docUpForm: FormGroup;
    public options: Options;
    public mouzaId: string='';
    public documentid:number=0;
    //public roleIds: [];
    constructor(
        private _conversion: Conversion,
        private _dataservice: DataService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        this.options = this._pathValidation.ngSelect2Option();
        this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: false }]);
    }

    ngOnInit(): void {
        this.createForm();
        $('#typeName').focus();
        this.getAllMouza();
        this.getListByPage(this.pageSize);
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.docUpForm = this.formBuilder.group({
            mouzaId: new FormControl(0),
            isActive: true
        });
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listDocUpload';
    public docUploadList: any = [];
    public _listByPageUrl: string = 'docupload/getbypage';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize);
        }, 0);
    }

    public _saveUrl: string = 'docupload/saveupdateform';
    // public _saveUrl: string = 'docupload/saveupdatedform';
    onSubmit() {

        if(this.docUpForm.invalid || this.documentList.length==0){            
            this._msg.info('Please select an excel file to upload!!!');
            return;
        }

        var formData = new FormData();
        if (this.documentList.length > 0) {
            this.documentList[0].referenceId=this.docUpForm.controls.mouzaId.value;
            this.documentList[0].documentId=this.documentid;
            formData.append('docFile', this.documentList[0].attachedfile);
        }

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.documentList];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModelForm(apiUrl, ModelsArray, formData)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.getListByPage(this.pageSize);
                    this._msg.success(this.resmessage);
                    this.reset();
                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }

    //Get by ID
    public _getbyIdUrl: string = 'docupload/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { id: parseInt(modelEvnt.model.documentId) };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.objDoc != '') {

                    var docUpload = JSON.parse(this.res.resdata.objDoc)[0];
                    this.documentid=docUpload.documentId;
                    this.docUpForm.setValue({
                        mouzaId: docUpload.referenceId,
                        isActive: true
                    });

                }
            }, error => {
                console.log(error);
            });
    }

    //Delete
    public _deleteUrl: string = 'docupload/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, id: modelEvnt.model.documentId };
            var apiUrl = this._deleteUrl;
            this._dataservice.deleteWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    this.resmessage = this.res.resdata.message;
                    if (this.res.resdata.resstate) {
                        this.getListByPage(this.pageSize);
                        this._msg.success(this.resmessage);
                    }
                    else {
                        this._msg.warning(this.resmessage);
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

    reset() {
        this.documentid=0;
        this.docUpForm.setValue({
            mouzaId: 0,
            isActive: true
        });

        this.mouzaId='';
        if (this._fileInput != undefined) {
            this._fileInput.nativeElement.value = "";
        }

        //this.roleIds = [];
        this.resmessage = null;        
        $('#typeName').focus();
    }

    //Get Mouza
    public mouzaList: any = [];
    public _getMouzaUrl: string = 'dropdown/getallmouza';
    getAllMouza() {
        var list: Array<{ id, text, nameEn }> = [{ id: '', text: "অনুগ্রহ করে নির্বাচন করুন", nameEn: '' }];
        var param = { strId: 0 };
        var apiUrl = this._getMouzaUrl;
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.listMouza != '') {
                    var itemList = this.res.resdata.listMouza;
                    itemList.forEach(item => {
                        list.push({ id: item.id, text: item.nameBn, nameEn: item.nameEn });
                    });

                    this.mouzaList = list;
                }
            }, error => {
                console.log(error);
            });
    }
    //Get Mouza

    //Filter Master List


    clickOnBtnFile() {
        this._fileInput.nativeElement.value = "";
        $('#attachedSingleFile').click();
    }

    public imageSrc;
    public documentList: any = [];
    onFileChange() {
        debugger;
        //var fileInfo=this._fileInput;
        this.documentList = [];
        //let reader = new FileReader();
        if (this._fileInput.nativeElement.files.length > 0) {
            let file = this._fileInput.nativeElement.files[0];
            var arryext = file.name.split(".");
            var ext = arryext[arryext.length - 1];
            var extlwr = ext.toLowerCase();
            var fileIndex = this.fileTypes.indexOf(extlwr);
            var fileSize = file.size / 1024 / 1024; // in MB
            //var fileType = file.type;
            if (fileSize > 50) {
                this._fileInput.nativeElement.value = "";
                this._msg.error('File size exceeds 15 MB');
            } else if (fileIndex === -1) {
                this._fileInput.nativeElement.value = "";
                this._msg.error('File type not supported. Valid file types are ' + this.fileTypes);
            } else {
                this.imageSrc = this._conversion.openSanitizedReportByFile(file);
                this.documentList.push({
                    documentId: 0,
                    referenceId: 0,
                    originalDocName: file.name,
                    documentName: file.name,
                    documentType: extlwr,
                    documentSize: fileSize,
                    attachedfile: file,
                    documentPath: this.cmnEntity.menuPath,
                    basePath: this.cmnEntity.menuPath,
                    documentFullPath: '',
                    virtualPath: '',
                    isActive: true,
                    isDelete: false,
                    createBy: this.userID
                });
            }
        }
    }

    public fileTypes: any = ["pdf","doc","docx","xlsx", "xls"];

}