export class ReportModel {
    reportPath: string;
    reportName: string;
    reportType: string='';
    reportHeight: number = 500;
    constructor(reportPath: string, reportName: string, reportHeight?: number) {
        this.reportPath = reportPath;
        this.reportName = reportName;
        this.reportType=this.reportType;
        this.reportHeight = reportHeight == undefined ? this.reportHeight : reportHeight;
    }
}