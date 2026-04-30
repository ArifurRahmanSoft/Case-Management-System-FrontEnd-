import { Component, OnInit, ElementRef, ViewChild, Input, forwardRef, ChangeDetectorRef, AfterViewInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../app.settings';
import {ApiService} from '../../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(public appSettings:AppSettings,  public router:Router, public _apiService : ApiService, private toastr: ToastrService, private http: HttpClient,) {

    

   }

  ngOnInit(): void {
    debugger;
  }

   
    

} 


  



















