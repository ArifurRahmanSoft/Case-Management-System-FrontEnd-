export class CompanyWiseImport {
    public LTRNM_SPDT: string;
    public LITEM_NAME: string;
    public SCUNTRY_NAME: string;
    public SCOMP_NAME: string;
    public LTRND_QNTY: string;

    constructor(LTRNM_SPDT, LITEM_NAME, SCUNTRY_NAME, SCOMP_NAME, LTRND_QNTY) {
        this.LTRNM_SPDT = LTRNM_SPDT;
        this.LITEM_NAME = LITEM_NAME;
        this.SCUNTRY_NAME = SCUNTRY_NAME;
        this.SCOMP_NAME = SCOMP_NAME;
        this.LTRND_QNTY = LTRND_QNTY;
    }


}