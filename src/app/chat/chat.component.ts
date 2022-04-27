import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ChatService} from "./shared/chat.service";
import {Observable, Subject, Subscription, take, takeUntil} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message = new FormControl('');
  nickNameFc = new FormControl('');
  messages: string[] = [];
  unsubscriber$ = new Subject()
  nickname: string | undefined ;
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  this.chatService.listenForMessages()
    .pipe(
      takeUntil(this.unsubscriber$)
    )
    .subscribe(message => {
      console.log('hellooo')
      this.messages.push(message)
    });
    this.chatService.getAllMessages()
      .pipe(
        take(1)
      )
      .subscribe(messages => {
        console.log('hellooo')
        this.messages = messages
      });
    this.chatService.connect()
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    // @ts-ignore
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.chatService.disconnect()
  }

  sendMessage() {
  console.log(this.message.value);
  this.chatService.sendMessage(this.message.value)
  }

  sendNickName(): void {
    if (this.nickNameFc.value){
      this.nickname = this.nickNameFc.value;
      this.chatService.sendNickName(this.nickNameFc.value)
    }
  }
}
