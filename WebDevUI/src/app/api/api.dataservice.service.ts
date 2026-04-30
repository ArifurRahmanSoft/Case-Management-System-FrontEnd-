import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { map, catchError } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiConst } from './api.baseurlconst.service';
import { Conversion } from './api.conversion.service';

import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { Observable } from 'rxjs';

@Injectable({
     providedIn: 'root'
})
export class DataService {
     public appSettings: any;
     public _apiHost: any;
     public apiHost: string;
     public _conversion: any;
     public _userId: any;
     private _domSanitizer: DomSanitizer;
     constructor(private _http: HttpClient, @Inject(DOCUMENT) private document: any) {
          this.appSettings = new AppSettings();
          this._conversion = new Conversion(this.appSettings, this._domSanitizer);
          this._apiHost = new ApiConst();
          this.apiHost = this._apiHost.autohost(this.document.location);
          var loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
          this._userId = loggedUser != null ? loggedUser.userId : '0000';
     }

     getall(_apiRout: string) {
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     getbyid(_apiRout: string, id: string) {
          _apiRout = this.apiHost + _apiRout + '?id=' + id;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     delete(_apiRout: string, id: string) {
          _apiRout = this.apiHost + _apiRout + '?id=' + id
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.delete(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     getWithMultipleModel(_apiRout: string, model: any) {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     postMultipleModel(_apiRout: string, model: any) {
          let body = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.post(_apiRout, body, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     postMultipleModelForm(_apiRout: string, model: any, formModel: any) {
          let body = this._conversion.JsonStringify(model);
          formModel.append('data', body);
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('userId', this._userId);
          return this._http.post(_apiRout, formModel, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }



     

     postForm(_apiRout: string, formModel: any) {
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('userId', this._userId);
          return this._http.post(_apiRout, formModel, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     deleteWithMultipleModel(_apiRout: string, model: any) {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.delete(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     getWithMultipleModelPDF(_apiRout: string, model: any): any {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers, responseType: 'blob' })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     //Synchronous request
     getall_Sync(_apiRout: string) {
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     getbyid_Sync(_apiRout: string, id: string) {
          _apiRout = this.apiHost + _apiRout + '?id=' + id;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     delete_Sync(_apiRout: string, id: string) {
          _apiRout = this.apiHost + _apiRout + '?id=' + id
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.delete(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     getWithMultipleModel_Sync(_apiRout: string, model: any) {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     postMultipleModel_Sync(_apiRout: string, model: any) {
          let body = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.post(_apiRout, body, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     deleteWithMultipleModel_Sync(_apiRout: string, model: any) {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.delete(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     getWithMultipleModelPDF_Sync(_apiRout: string, model: any): any {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers, responseType: 'blob' })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     postMultipleModelForm_Sync(_apiRout: string, model: any, formModel: any) {
          let body = this._conversion.JsonStringify(model);
          formModel.append('data', body);
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('userId', this._userId);
          return this._http.post(_apiRout, formModel, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     postForm_Sync(_apiRout: string, formModel: any) {
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('userId', this._userId);
          return this._http.post(_apiRout, formModel, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     private handleError(error: Response) {
          return (error.toString() || 'Opps!! Server error');
     }

     getLocation(): Observable<any> {
          return new Observable((observer) => {
               if (!navigator.geolocation) {
                    observer.error("Geolocation not supported");
                    return;
               }

               navigator.geolocation.getCurrentPosition(
                    (position) => {
                         observer.next(position);
                         observer.complete();
                    },
                    (error) => observer.error(error)
               );
          });
     }

}

export class LocationService {
     getLocation(): Observable<any> {
          return new Observable((observer) => {
               if (!navigator.geolocation) {
                    observer.error("Geolocation not supported");
                    return;
               }

               navigator.geolocation.getCurrentPosition(
                    (position) => {
                         observer.next(position);
                         observer.complete();
                    },
                    (error) => observer.error(error)
               );
          });
     }
}

