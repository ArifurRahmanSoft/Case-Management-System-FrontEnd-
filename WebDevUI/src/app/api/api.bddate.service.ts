declare var $: any;
export class BDDate {
    constructor() { }

    getDatebd(arg) {
        const dd = arg.getDate();
        const mm = arg.getMonth() + 1;
        const yy = arg.getFullYear();

        const rojAdd = ' রোজ ';
        const esheAdd = { e: ' ই', she: ' শে' }
        const kalAdd = ' কাল';
        const abodo = ' বঙ্গাব্দ';
        const monthName = [
            'বৈশাখ',//0
            'জ্যৈষ্ঠ',//1
            'আষাঢ়',//2
            'শ্রাবণ',//3
            'ভাদ্র',//4
            'আশ্বিন',//5
            'কার্তিক',//6
            'অগ্রহায়ণ',//7
            'পৌষ',//8
            'মাঘ',//9
            'ফাল্গুন',//10
            'চৈত্র'//11
        ];
        const dayName = [
            'বৃহস্পতিবার',
            'শুক্রবার',
            'শনিবার',
            'রবিবার',
            'সোমবার',
            'মঙ্গলবার',
            'বুধবার',

        ];
        const session = [
            'গ্রীষ্ম',
            'বর্ষা',
            'শরৎ',
            'হেমন্ত',
            'শীত',
            'বসন্ত',
        ];
        const numBd = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        const convertNumber = (n) => n.toString().split("").map(num => numBd[num]).join('');
        const addEe = n => {
            let x, y;
            x = n >= 10 && n < 20 ? esheAdd.e : ''; y = n >= 20 && n <= 31 ? esheAdd.she : ''; return x || y ? y + x : ''
        }



        //const getYear = (dmy) => dmy.getMonth()+1 <= 4 && dmy.getDate() <= 13 ? dmy.year - 594 : dmy.getFullYear() - 593;
        const getYear = () => (mm >= 4 && dd >= 14) || mm > 4 ? yy - 593 : yy - 594;
        // const getYear = () => {
        //     debugger;
        //     var yr = yy;
        //     if (mm >= 4 && dd >= 14) {
        //         yr = yy - 593;
        //     }
        //     else {
        //         yr = yy - 594;
        //     }

        //     return yr
        // }

        const getMonthDate = (d, m) => {
            switch (true) {
                case m == 1 && d <= 13: m = 8; d = d + 17;
                    break;
                case m == 1 && d > 13: m = 9; d = d - 13;
                    break;
                case m == 2 && d <= 12: m = 9; d = d + 18;
                    break;
                case m == 2 && d > 12: m = 10; d = d - 12;
                    break;
                case m == 3 && d <= 14: m = 10; d = d + 16;
                    break;
                case m == 3 && d > 14: m = 11; d = d - 14;
                    break;
                case m == 4 && d <= 13: m = 11; d = d + 17;
                    break;
                case m == 4 && d > 13: m = 0; d = d - 13;
                    break;
                case m == 5 && d <= 14: m = 0; d = d + 17;
                    break;
                case m == 5 && d > 14: m = 1; d = d - 14;
                    break;
                case m == 6 && d <= 14: m = 1; d = d + 17;
                    break;
                case m == 6 && d > 14: m = 2; d = d - 14;
                    break;
                case m == 7 && d <= 15: m = 2; d = d + 16;
                    break;
                case m == 7 && d > 15: m = 3; d = d - 15;
                    break;
                case m == 8 && d <= 15: m = 3; d = d + 16;
                    break;
                case m == 8 && d > 15: m = 4; d = d - 15;
                    break;
                case m == 9 && d <= 15: m = 4; d = d + 16;
                    break;
                case m == 9 && d > 15: m = 5; d = d - 15;
                    break;
                case m == 10 && d <= 15: m = 5; d = d + 15;
                    break;
                case m == 10 && d > 15: m = 6; d = d - 15;
                    break;
                case m == 11 && d <= 14: m = 6; d = d + 16;
                    break;
                case m == 11 && d > 14: m = 7; d = d - 14;
                    break;
                case m == 12 && d <= 14: m = 7; d = d + 16;
                    break;
                case m == 12 && d > 14: m = 8; d = d - 14;
                    break;
                default:
                    m = false,
                        d = false;
            }

            return { month: m, date: d };

        }

        debugger;
        var ndate=new Date(yy, mm, dd, 0, 0, 0, 0);

        var GetdayName = dayName[new Date(yy, mm, dd).getDay()];
        let daymon = getMonthDate(dd, mm);
        let getSession = session[Math.floor(daymon.month / 2)];
        let bdSession = getSession + kalAdd;
        let bdDate = convertNumber(daymon.date) + addEe(daymon.date)
        let yearBN = convertNumber(getYear());
        let yearEN = getYear();

        //------------------------------------
        let bdDay = rojAdd + GetdayName;
        let bdMonth = monthName[daymon.month];
        let bdYear = yearBN + abodo;

        let dateBDEn = yearEN + '-' + ('0' + (daymon.month + 1)).slice(-2) + '-' + ('0' + daymon.date).slice(-2);
        let fullDateBN = bdDate + ' ' + bdMonth + ' ' + bdDay + ', ' + bdYear;
        //------------------------------------
        return {
            day: bdDay,
            date: bdDate,
            month: bdMonth,
            session: bdSession,
            yearBN: bdYear,
            yearEN: yearEN,
            dateBDEn: dateBDEn,
            fullDateBD: fullDateBN
        }
    }
}
