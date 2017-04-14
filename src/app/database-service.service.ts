import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class DatabaseServiceService {

  firebase:AngularFire;

  constructor(af: AngularFire) { //Reference to the AngularFire class in the npm module angularfire2
    this.firebase = af;
  }
  
  getList(path:String): FirebaseListObservable<any[]>{//Get a list of JSON objects from firebase
    return this.firebase.database.list("/"+path);
  }

  getObject(path:String):FirebaseObjectObservable<any>{//Get a single JSON object from Firebase
    return this.firebase.database.object('/'+path);
  }

  setObject(path:String,value):Boolean{//Set a value to a Firebase object given its path
    const itemObservable = this.firebase.database.object('/'+path);
    itemObservable.set(value);
    return true;
  }

    removeObject(path:String):Boolean{//Remove a value from Firebase given its path
    const itemObservable = this.firebase.database.object('/'+path);
    itemObservable.remove();
    return true;
  }
}
