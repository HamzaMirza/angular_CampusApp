import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import {FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class NotifcationsListService {
 notifications$: FirebaseListObservable<any[]>;

  constructor(private af:AngularFireDatabase)  {
        this.notifications$ = this.af.list('/notification');

   }

}
