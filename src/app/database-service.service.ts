import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class DatabaseServiceService {

  firebase:AngularFire;

  constructor(af: AngularFire) { 
    this.firebase = af;
  }
  
  getList(path:String): FirebaseListObservable<any[]>{
    return this.firebase.database.list("/"+path);
  }

  getObject(path:String):FirebaseObjectObservable<any>{
    return this.firebase.database.object('/'+path);
  }

  setObject(path:String,value):Boolean{
    const itemObservable = this.firebase.database.object('/'+path);
    itemObservable.set(value);
    return true;
  }

    removeObject(path:String):Boolean{
    const itemObservable = this.firebase.database.object('/'+path);
    itemObservable.remove();
    return true;
  }
}
