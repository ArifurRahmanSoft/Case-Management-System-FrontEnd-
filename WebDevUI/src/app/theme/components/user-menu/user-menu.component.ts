import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/api/employee';
import { DataService } from 'src/app/api/api.dataservice.service';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent implements OnInit {
  public userImage = "assets/img/users/user.jpg";
  public cmnEntity: any = {};
  public res: any;
  public _conversion: any;
  public userID;
  public password;
  public loggedUser: any;
  public my_employee = new Employee("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");

  public exployeeName;
  public employeeDesignation;
  public employeeEmail;
  public employeePhoto;

  constructor(public router: Router, private _dataservice: DataService, private _pathValidation: pathValidation) {//private http: HttpClient, 
    this._pathValidation.validateLoggedUser();
    this.cmnEntity = this._pathValidation.rowEntities();
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
  }

  ngOnInit() {
    debugger;
    this.userID = sessionStorage.getItem('userID');
    this.password = sessionStorage.getItem('password');
    this.loadEmployeeDetails();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  public _getUrl: string = 'users/loggeduserdetails';
  loadEmployeeDetails() {
    var param = { UserId: this.cmnEntity.userId, IsTrue: this.loggedUser.isSys };
    var apiUrl = this._getUrl;
    this._dataservice.getWithMultipleModel_Sync(apiUrl, param)
      .then(response => {
        debugger;
        this.res = response;
        if (this.res.resdata.data.length > 0 && this.res.resdata.resstate) {
          var isByte: boolean = this.res.resdata.isByte;
          var datas = JSON.parse(this.res.resdata.data);
          this.my_employee = datas as Employee;
          this.exployeeName = this.my_employee.EMP_NAME;
          this.employeeDesignation = this.my_employee.EMP_DSIG;
          this.employeeEmail = this.my_employee.OFFICE_MAIL;
          this.employeePhoto = this.loggedUser.isSys || !isByte ? this.my_employee.EMP_PHOTO : 'data:image/png;base64,' + this.my_employee.EMP_PHOTO;
        }
      }, error => {
        console.log(error);
      }
      );
  }

}
