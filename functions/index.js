const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.adder = functions.database.ref('/numbers/current')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      var current = event.data.val();
      var total; 
      event.data.adminRef.getRoot().ref('/numbers/total').then(function(snapshot){
        total = snapshot.val();
      });
      console.log('adder',total);
      current = 3 + current;
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return event.data.ref.parent.child('total').set(current);
    });

  
