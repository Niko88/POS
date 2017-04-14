const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.pricer = functions.database.ref('/products/{productName}/recipe/{ingredient}')
    .onWrite(event => {
      var rootref = event.data.ref.root;
      rootref.child('stock/'+event.params.ingredient+'/price').once('value',function(snapshot){
        var ingredientPrice = snapshot.val();
        var ingredientCost = event.data.val();
        return rootref.child('/products/'+event.params.productName+'/ingredientsCost/'+event.params.ingredient).set(ingredientCost*ingredientPrice);
        });
    });

exports.costWorker = functions.database.ref('/products/{productName}/ingredientsCost/{ingredient}')
    .onWrite(event => {
      var rootref = event.data.ref.root;
        rootref.child('products/'+event.params.productName+'/CostProfit/Cost').once('value',function(snapshot){
          if(snapshot == null)
            return rootref.child('products/'+event.params.productName+'/CostProfit/Cost').set(event.data.val());
        var cost = snapshot.val();
        var total = event.data.val()+cost;
        return rootref.child('products/'+event.params.productName+'/CostProfit/Cost').set(total);
        });
    });

exports.profitWorker = functions.database.ref('/products/{productName}/CostProfit/{value}')
    .onWrite(event => {
      var rootref = event.data.ref.parent;
      var percentage,costPercentage;
      if (event.params.value == 'Cost'){
        var cost = event.data.val();
        rootref.child('Price').once('value',function(snapshot){
        if(snapshot==null){
          return rootref.child('GrossProfit').set(0);}
          else {
              rootref.child('GrossProfit').set(snapshot.val()-cost);
              costPercentage = (cost/snapshot.val())*100;
              percentage = (100-costPercentage);
              rootref.child('Cost Percentage').set(costPercentage.toFixed(2)+'%');
              return rootref.child('Profit Percentage').set(percentage.toFixed(2)+'%');
          }
        });
        }
       else if(event.params.value == 'Price'){
            var price = event.data.val();
            rootref.child('Cost').once('value',function(snapshot){
            if(snapshot==null){
            return rootref.child('GrossProfit').set(0);}
              else {
              rootref.child('GrossProfit').set(price - snapshot.val());
              costPercentage = (snapshot.val()/price)*100;
              percentage = (100-costPercentage);
              rootref.child('Cost Percentage').set(costPercentage.toFixed(2)+'%');
              return rootref.child('Profit Percentage').set(percentage.toFixed(2)+'%');
              }
        });
           }      
    });
  
