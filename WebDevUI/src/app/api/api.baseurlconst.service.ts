export class ApiConst {
  constructor() { }
  IsLive: boolean =false;
  autohost(location) {
    var apiHost = '';
    if (this.IsLive) {
      apiHost = 'https://app.citygroupbd.com/lms_api/api/';//Real Live
    }
    else {
      apiHost = 'http://localhost:49946/api/'; //Local
      //apiHost='http://192.168.61.246:92/api/'; //Live(local)
    }
    //var apiHost='http://192.168.61.246:81/api/'; //Live
    return apiHost;
  }
}
