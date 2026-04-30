import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessagesServiceBak } from './messagesbak.service';

@Component({
  selector: 'app-messagesbak',
  templateUrl: './messagesbak.component.html',
  styleUrls: ['./messagesbak.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MessagesServiceBak ]
})
export class MessagesBakComponent implements OnInit {  
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public selectedTab:number=1;
  public messages:Array<Object>;
  public files:Array<Object>;
  public meetings:Array<Object>;  
  constructor(private messagesService:MessagesServiceBak) { 
    this.messages = messagesService.getMessages();
    this.files = messagesService.getFiles();
    this.meetings = messagesService.getMeetings();    
  }

  ngOnInit() {
  }

  openMessagesMenu() {
    this.trigger.openMenu();
    this.selectedTab = 0;
  }

  onMouseLeave(){
    this.trigger.closeMenu();
  }

  stopClickPropagate(event: any){
    event.stopPropagation();
    event.preventDefault();
  }

}
