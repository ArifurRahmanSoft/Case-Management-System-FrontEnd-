import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { 

  }

  public getBengaliDayName(englishDayName) {

    var bengaliDayName = "";
    if (englishDayName == "SATURDAY ") {

        bengaliDayName = "kwbevi";
        return bengaliDayName;

    } else if (englishDayName == "SUNDAY   ") {

        bengaliDayName = "iweevi";
        return bengaliDayName;

    } else if (englishDayName == "MONDAY   ") {

        bengaliDayName = "‡mvgevi";
        return bengaliDayName;

    } else if (englishDayName == "TUESDAY  ") {

        bengaliDayName = "g½jevi";
        return bengaliDayName;

    } else if (englishDayName == "WEDNESDAY") {

        bengaliDayName = "eyaevi";
        return bengaliDayName;

    } else if (englishDayName == "THURSDAY ") {

        bengaliDayName = "e…n¯úwZevi";
        return bengaliDayName;

    } else if (englishDayName == "FRIDAY   ") {

        bengaliDayName = "ïµevi";
        return bengaliDayName;

    }
}

public getBengaliMonthName(englishMonthName) {

    var bengaliMonthName = "";

    if (englishMonthName.includes("January")) {

        bengaliMonthName = "Rvbyqvwi";

    } else if (englishMonthName.includes("February")) {

        bengaliMonthName = "‡dwe«qvwi";

    } else if (englishMonthName.includes("March")) {

        bengaliMonthName = "gvP©";

    } else if (englishMonthName.includes("April")) {

        bengaliMonthName = "Gwc«j";

    } else if (englishMonthName.includes("May")) {

        bengaliMonthName = "‡g";

    } else if (englishMonthName.includes("June")) {

        bengaliMonthName = "Ryb";

    } else if (englishMonthName.includes("July")) {

        bengaliMonthName = "RyjvB";

    } else if (englishMonthName.includes("August")) {

        bengaliMonthName = "AvM÷";

    } else if (englishMonthName.includes("September")) {

        bengaliMonthName = "‡m‡Þ¤^i";

    } else if (englishMonthName.includes("October")) {

        bengaliMonthName = "A‡±vei";

    } else if (englishMonthName.includes("November")) {

        bengaliMonthName = "b‡f¤^i";

    } else if (englishMonthName.includes("December")) {

        bengaliMonthName = "wW‡m¤^i";

    }

    return bengaliMonthName;
}




public fixedPlace(x) {
    var numberString = x.toString();
    if(numberString.includes(".")){

      var intiger = parseFloat(x);
      var n = intiger.toFixed(2);
      return n;

    }else {
      return x;
    }
    
}

public numberWithCommas(x) {

    if(x == null || x == 0){

        return "-"

    }else {

        var million = x.toString();
        return this.tobdt(million) + "/-";
    }

    
}


public tobdt(nstr) {
    var totlength = nstr.length; var uptolac, crorepart, retstr;
    if (totlength > 7) {
        uptolac = nstr.substring(totlength - 7, totlength).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      //  console.log('lac:' + uptolac);
        crorepart = nstr.substring(0, totlength - 7); retstr = crorepart + "," + uptolac;
       // console.log('crore:' + crorepart);
    } else {
        retstr = nstr.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    }

    return retstr;

};

public numberWithCommasForTon(x) {

    if(x==0 || x == null){

        return "-"
    }else {

        var y = this.fixedPlace(x);
        var numberString = y.toString();
        if(numberString.includes(".")){
          return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }else {
           return this.tobdt(numberString) ;
        }
        
    }
   
}



public getCurrentYear() {

    var today = new Date();
    var yyyy = today.getFullYear();



    return yyyy;
}

public getCurrentMonth() {

    var today = new Date();
    var mm_string = "";
    let mm = today.getMonth() + 1; //January is 0!

    if (mm < 10) {
        mm_string = '0' + mm;
    }

    return mm_string;
}



public getCurrentDate() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var todayString = "";
    var dd_string = "";
    var mm_string = "";

    if (dd < 10) {
        dd_string = '0' + dd;
    }

    if (mm < 10) {
        mm_string = '0' + mm;
    }

    todayString = yyyy + '-' + mm_string + '-' + dd_string;
    return today;
}


public getCurrentDateInDDMMYYYYFormat() {

    var today = new Date();
    var todayString = "";
    var dd_string = "";
    var mm_string = "";
    var dd = today.getDate();
    var mm = today.getMonth() + 1; 
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd_string = '0' + dd;

    }else {
      dd_string = '' + dd;
    }

    if (mm < 10) {
        mm_string = '0' + mm;

    }else {
        mm_string = '' + mm;
    }

    todayString = dd_string + '-' + mm_string + '-' + yyyy;

    return todayString;
}



}
