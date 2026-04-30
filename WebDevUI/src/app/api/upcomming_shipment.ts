export class UpcommingShipment {
    public LTRNM_SPDT: string;
    public SCUNTRY_NAME: string;
    public SCOMP_NAME: string;
    public COUNTRYOFORIGIN: string;
    public LTRND_QNTY: string;

    constructor(LTRNM_SPDT, SCUNTRY_NAME, SCOMP_NAME, COUNTRYOFORIGIN, LTRND_QNTY) {
        this.LTRNM_SPDT = LTRNM_SPDT;
        this.SCUNTRY_NAME = SCUNTRY_NAME;
        this.SCOMP_NAME = SCOMP_NAME;
        this.COUNTRYOFORIGIN = COUNTRYOFORIGIN;
        this.LTRND_QNTY = LTRND_QNTY;
    }


}