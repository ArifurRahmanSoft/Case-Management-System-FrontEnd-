import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'City Group',   //theme name
        true,       //loadingSpinner
        false,       //loadingSpinnerOnAction
        true,       //fixedHeader
        true,       //fixedSidenav
        false,      //fixedSidenavUserContent
        false,      //fixedFooter
        true,       //sidenavIsOpened
        true,       //sidenavIsPinned  
        'vertical', //horizontal , vertical
        'default',  //default, compact, mini
        'indigo-light',   //indigo-light, teal-light, red-light, gray-light, blue-dark, green-dark, pink-dark, gray-dark
        false       // true = rtl, false = ltr
    )
}

