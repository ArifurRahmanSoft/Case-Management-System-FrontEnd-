import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { UpdateUser } from './update_password_model';
import { ApiService } from '../../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/api/api.dataservice.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  public form : FormGroup;
  public settings: Settings;
  public res:any;
  public resmessage:string='';
  public loggedUser:any;

  public newPassword;
  public confPassword; 
  public pattern;
  public user = {};
  public userID;
  public userPassword;
  public oldPassword;


  topics = ['Angular', 'React', 'Vue'];
 // userModel = new User('Rob', 'rob@test.com', 5556665566, 'default', 'morning', true);

  userModel = new UpdateUser('', '', '');
  topicHasError = true;
  submitted = false;
  errorMsg = '';



  public fruitList = 
  [
    "Select Fruits",
    "Mango",
    "Banana",
    "Apple",
    "Multa"
  ];

   

  constructor(public appSettings:AppSettings, public fb: FormBuilder , public _apiService : ApiService, private toastr: ToastrService, private _dataservice:DataService) {

    this.settings = this.appSettings.settings; 

    this.userID = sessionStorage.getItem("userID");
    this.oldPassword = sessionStorage.getItem("password");
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));    
    this.form = this.fb.group({
      'password': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'confPassword': [null, Validators.compose([Validators.required, Validators.minLength(4)])]     
    });

   }

  ngOnInit(): void {

    
    
  }


  ngAfterViewInit() {
    
    

  }  



  public onSubmits(values:any):void {
    
    
    this.newPassword = values.confPassword;

    this.user = {
      "EmpID" : this.userID,
      "UserPassw" : this.newPassword,
      "UserPrevPass" : this.oldPassword
      }
    
      this._apiService.updateUserPassword(this.user)
        .subscribe(data => {

          if (data.toString().includes("1")) {
            sessionStorage.setItem('password', this.newPassword);
            this.toastr.success('Password change successful', 'SUCCESS!'); // message , title     error, info, warning, success
            this.userModel = new UpdateUser('', '', '');
           
          }else {
            this.toastr.warning(data.toString(), 'WARNING!'); // message , title     error, info, warning, success
          }

      });

    
  }

  public updatePassUrl:string='users/updatepassword';
  public onSubmit(values:any):void {    
    
    this.newPassword = values.confPassword;

    this.user = {
      "EmpID" : this.userID,
      "UserPassw" : this.newPassword,
      "UserPrevPass" : this.oldPassword
      }
    
      var param={loggedUserId:this.userID, IsSys:this.loggedUser.isSys};
      var ModelsArray = [param, this.user];
      var apiUrl=this.updatePassUrl;
      this._dataservice.postMultipleModel(apiUrl, ModelsArray)
          .subscribe(response => {
              this.res = response;
              this.resmessage = this.res.resdata.message;
              if (this.res.resdata.resstate) {
                this.toastr.success(this.resmessage, 'Success!');
                sessionStorage.setItem('password', this.newPassword);   
                this.userModel = new UpdateUser('', '', '');                
              }
              else{
                this.toastr.warning(this.resmessage, 'Warning!');
              }
              
          }, error => {
              console.log(error);
          });    
  }
  
}
