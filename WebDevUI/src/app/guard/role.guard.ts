import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RoleService } from '../service/role.service';

@Injectable()

export class RoleGuard implements CanActivate {
  
  public userID = sessionStorage.getItem("userID");
  public canNavigate = false;  
  public res:any;
  public loggedUser:any;
  constructor( private router: Router, 
    private http: HttpClient, 
    private role: RoleService
    ) {
      this.loggedUser=JSON.parse(sessionStorage.getItem('loggedUser'));
    }

  // canActivate(route: ActivatedRouteSnapshot) : boolean {

  //   let currentPage = route.data.roles[0] ;
    


  //   this.role.getMenu().subscribe((res : any[])=>{
  //     res.forEach(obj =>{
  //       var routerLink = obj.MENUPATH;

  //       if (currentPage == routerLink) {
  //         this.router.navigate([currentPage]);
  //         this.canNavigate = true;
          
  //       }
  //     })

  //     if (! this.canNavigate) {

  //       this.router.navigate(['/home']);
  //       this.canNavigate = false;

  //     }

  //   });

  //   return this.canNavigate;
  // }

  // canActivate(route: ActivatedRouteSnapshot) : boolean {

  //     let currentPage = route.data.roles[0] ;
  //     if(this.loggedUser!==null){
  //       this.role.getMenu(this.loggedUser, currentPage).then(response=>{
          
  //         this.res=response;
  //         if(this.res.resdata.userMenu!=null){
  //           var routerLink=this.res.resdata.userMenu.menuPath;
  //           if (currentPage == routerLink) {
  //             this.router.navigate([currentPage]);
  //             this.canNavigate = true;          
  //           }
  //           else{
  //             this.router.navigate(['/home']);
  //           this.canNavigate = false;
  //           }
  //         }
  //         else{
  //           this.router.navigate(['/home']);
  //           this.canNavigate = false;
  //         }

  //       });
  //   }
  //   return this.canNavigate;
  // }

  canActivate(route: ActivatedRouteSnapshot) : boolean {

    let currentPage = route.data.roles[0] ;
    if(this.loggedUser!==null){
      this.role.getMenu(this.loggedUser, currentPage).then(response=>{
        
        this.res=response;
        if(this.res.resdata.canNavigate){          
            this.router.navigate([currentPage]);
            this.canNavigate = true;  
        }
        else{
          this.router.navigate(['/home']);
          this.canNavigate = false;
        }

      });
  }
  return this.canNavigate;
}

}