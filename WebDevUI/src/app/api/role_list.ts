export class RoleList {
    public ROLEID: string;
    public ROLENAME: string;
    public REMARKS: string;
    public ISACTIVE: string;
    public ISCANCEL: string;

    constructor(ROLEID, ROLENAME, REMARKS, ISACTIVE, ISCANCEL) {
        this.ROLEID = ROLEID;
        this.ROLENAME = ROLENAME;
        this.REMARKS = REMARKS;
        this.ISACTIVE = ISACTIVE;
        this.ISCANCEL = ISCANCEL;
        
    }


}