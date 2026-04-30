export class UrlBranch {

  constructor() { }

  public listUrlBranch:any=[
                            {id:'LCMS', name:'JUBORAJ_WEB_API/LCMS/'},
                            {id:'Login', name:'acmsapi/'}
                           ];
  branch(id:string) {
    debugger;
    var br:string='';
    var branch=this.listUrlBranch.filter(x=> x.id==id)[0];
    if(branch!=undefined)
    {
      br=branch.name; 
    }
    
    return br;
  }
}
