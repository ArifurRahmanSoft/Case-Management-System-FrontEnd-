import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { UpdatePasswordComponent } from './project_component/update-password/update-password.component';
import { HomeComponent } from './project_component/home/home.component';

import { DashboardComponent } from './project_component/dashboard/dashboard.component';

import { AuthGuard } from '../app/guard/auth.guard';
import { RoleGuard } from '../app/guard/role.guard';
import { RoleComponent } from './project_component/security/role/role.component';
import { MenuComponent } from './project_component/security/menu/menu.component';
import { UserRoleComponent } from './project_component/security/user-role/user-role.component';
import { DeedReportComponent } from './project_component/business/reports/deedreport.component';
import { UserSetupComponent } from './project_component/security/userSetup/userSetup.component';
import { UploadTypeSetupComponent } from './project_component/business/uploadtypesetup/uploadtypesetup.component';
import { DeedDocumentComponent } from './project_component/business/deeddocument/deeddocument.component';
import { OwnerSetupComponent } from './project_component/business/ownersetup/ownersetup.component';
import { SellerSetupComponent } from './project_component/business/sellersetup/sellersetup.component';
import { MouzaSetupComponent } from './project_component/business/mouzasetup/mouzasetup.component';
import { ThanaSetupComponent } from './project_component/business/thanasetup/thanasetup.component';
import { MutationDocumentComponent } from './project_component/business/mutationdocument/mutationdocument.component';
import { KhajnaEntryComponent } from './project_component/business/khajnaentry/khajnaentry.component';
import { DocUploadComponent } from './project_component/business/docupload/docupload.component';
import { UserDashboardComponent } from './project_component/business/userdashboard/userdashboard.component';
import { CaseManagementComponent } from './project_component/business/casemanagementsystem/casemanagement/casemanagement.component';
import { CaseDashbordComponent } from './project_component/business/casemanagementsystem/casedashbord/casedashbord.component';
//import { CaseManagementComponent } from './project_component/caseManagementSystem/casemanagement/casemanagement.component';

export const routes: Routes = [
    { 
        path: '', 
        component: PagesComponent, children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'icons', loadChildren: () => import('./pages/icons/icons.module').then(m => m.IconsModule), data: { breadcrumb: 'Material Icons' } },
            { path: 'updatePassword', component: UpdatePasswordComponent, canActivate: [AuthGuard] },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

            { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/dashboard']} },//, RoleGuard            

            { path: 'business/userdash', component: UserDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/userdash']} },//, RoleGuard            
            { path: 'business/docupload', component: DocUploadComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/docupload']} },//, RoleGuard            
            { path: 'business/khajna', component: KhajnaEntryComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/khajna']} },//, RoleGuard
            { path: 'business/mutation', component: MutationDocumentComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/mutation']} },//, RoleGuard
            { path: 'business/thanasetup', component: ThanaSetupComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/thanasetup']} },//, RoleGuard
            { path: 'business/mouzasetup', component: MouzaSetupComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/mouzasetup']} },//, RoleGuard
            { path: 'business/seller', component: SellerSetupComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/seller']} },//, RoleGuard
            { path: 'business/owner', component: OwnerSetupComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/owner']} },//, RoleGuard
            { path: 'business/deed', component: DeedDocumentComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/deed']} },//, RoleGuard
            { path: 'business/uploadtype', component: UploadTypeSetupComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/uploadtype']} },//, RoleGuard            
            { path: 'business/deedreport', component: DeedReportComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/deedreport']} },//, RoleGuard
            { path: 'security/role', component: RoleComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/security/role']} },//, RoleGuard
            { path: 'security/menu', component: MenuComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/security/menu']} },//, RoleGuard            
            { path: 'security/userRoleAssign', component: UserRoleComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/security/userRoleAssign']} },//, RoleGuard 
            { path: 'security/userSetup', component: UserSetupComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/security/userSetup']} },//, RoleGuard  
            
             { path: 'business/casemanagementsystem/casemanagement', component: CaseManagementComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/casemanagementsystem/casemanagement']} },//, RoleGuard
            { path: 'business/casemanagementsystem/casedashbord', component: CaseDashbordComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/business/casemanagementsystem/casedashbord']} },//, RoleGuard
        ]
    },
    { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
    { path: '**', component: NotFoundComponent }
];
 

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
            useHash: true
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }