import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { ApiService } from '../../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/pages/login/login_user_model';
import { DataService } from 'src/app/api/api.dataservice.service';
import { UrlBranch } from 'src/app/api/api.urlbranch.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ["./login.component.scss"]
})

export class LoginComponent {

  //common
  public res: any;

  public userID;
  public userPassword;
  public user = {};
  public showPassword: boolean = false;

  public form: FormGroup;
  public settings: Settings;

  userModel = new User('', '');

  constructor(public appSettings: AppSettings,
    public fb: FormBuilder,
    public router: Router,
    public _apiService: ApiService,
    private toastr: ToastrService,
    private _dataservice: DataService,
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      'password': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'userid': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      'rememberMe': false
    });

    //  // 'email': [null, Validators.compose([Validators.required, emailValidator])],
  }

  ngOnInit() {

  }

  public login: string = 'users/login';
  public onSubmit(values: Object): void {
    sessionStorage.clear();
    if (this.form.valid) {
      this.userID = this.form.value.userid;
      this.userPassword = this.form.value.password;
      this.user = {
        "EmpID": this.userID,
        "UserPassw": this.userPassword
      }

      var apiUrl = this.login;
      this._dataservice.postMultipleModel(apiUrl, this.user)
        .subscribe(response => {
          debugger;
          this.res = response;
          var resMessage = this.res.resdata.message;
          if (this.res.resdata.resstate) {
            sessionStorage.clear();
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('loggedUser', JSON.stringify(this.res.resdata.loggeduser));

            sessionStorage.setItem('userID', this.userID);
            sessionStorage.setItem('password', this.userPassword);

            this.toastr.success(resMessage, 'Success!'); // message , title     error, info, warning, success
            this.router.navigate(['/home']);
          } else {
            this.toastr.error(resMessage, 'OPPS!'); // message , title     error, info, warning, success
          }
        });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.settings.loadingSpinner = false;
    });
  }
}