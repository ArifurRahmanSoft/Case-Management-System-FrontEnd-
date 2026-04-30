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
    var intiger = parseFloat(x);
    var n = intiger.toFixed(2);
    return n;
}

public fixedPlaceIntiger(x){
    var int = parseInt(x);
    return int;
}

public numberWithCommas(x) {

    if(x == null || x == 0){

        return "-"

    }else {

        var million = x.toString();
        return this.tobdt(million) + "/-";
    }

    
}


public numberWithCommasWithoutSign(x) {

    if(x == null || x == 0){

        return "-"

    }else {

        var million = x.toString();
        return this.tobdt(million) ;
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
        return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Ub";
    }
   
}



public getCurrentDateInDDMMYYYY(){
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var dateString = dd + '/' + mm + '/' + yyyy;
return dateString;
}


}
