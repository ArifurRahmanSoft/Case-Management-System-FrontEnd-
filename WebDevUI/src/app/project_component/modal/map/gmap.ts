import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
//import { Conversion } from 'src/app/api/api.conversion.service';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.html',
  styleUrls: ['./gmap.scss']
})
export class GMapModal implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  @ViewChild('modalGmap') _modalGMap: TemplateRef<any>;
  private _gMapDialogRef: MatDialogRef<TemplateRef<any>>;
  load(latLong): void {
    const _config = new MatDialogConfig();
    _config.restoreFocus = false;
    _config.autoFocus = false;
    _config.role = 'dialog';
    _config.width = '70%';
    //_config.panelClass = 'modalTopPosition';
    debugger;
    this._gMapDialogRef = this.dialog.open(this._modalGMap, _config);
    //this._conversion.promtGMap(lat, lon);

    // var map = $("googleMap").val();
    // debugger;
    var lat = latLong.latitude;
    var lon = latLong.longitude;
    $("#_gapiloc").html("<iframe id='ifrm' src=\"https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=" + lat + ',' + lon + "&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed\" height=\"500\" style='width:100%' ></iframe>");

    this._gMapDialogRef.afterClosed().subscribe(result => {
    });
  }

}
