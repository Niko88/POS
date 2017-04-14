//Firebase cloud functions to manage data as it is added to the database
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.pricer = functions.database.ref('/products/{productName}/recipe/{ingredient}')//Pricer function works out the price for each ingredient
    .onWrite(event => {
      var rootref = event.data.ref.root;//Reference to the root of the database
      rootref.child('stock/'+event.params.ingredient+'/price').once('value',function(snapshot){//get the cost for the ingredient
        var ingredientPrice = snapshot.val();
        var ingredientCost = event.data.val();
        return rootref.child('/products/'+event.params.productName+'/ingredientsCost/'+event.params.ingredient).set(ingredientCost*ingredientPrice);//set cost
        });
    });

exports.costWorker = functions.database.ref('/products/{productName}/ingredientsCost/{ingredient}')//costWorker calculate the cost for a recipe
    .onWrite(event => {
      var rootref = event.data.ref.root;
        rootref.child('products/'+event.params.productName+'/CostProfit/Cost').once('value',function(snapshot){//Get the cost for the recipe
          if(snapshot == null)//If the entry does not exist set it to the price of the current ingredient
            return rootref.child('products/'+event.params.productName+'/CostProfit/Cost').set(event.data.val());
        var cost = snapshot.val();//else add the price of the ingredient to the total
        var total = event.data.val()+cost;
        return rootref.child('products/'+event.params.productName+'/CostProfit/Cost').set(total);
        });
    });

exports.profitWorker = functions.database.ref('/products/{productName}/CostProfit/{value}')//profit worker works out the Gross profit along with cost and profit percentages
    .onWrite(event => {
      var rootref = event.data.ref.parent;
      var percentage,costPercentage;
      if (event.params.value == 'Cost'){//If cost for the product has been added/modified
        var cost = event.data.val();
        rootref.child('Price').once('value',function(snapshot){
        if(snapshot==null){
          return rootref.child('GrossProfit').set(0);}//If no price has been yet added set Gross Profit to 0
          else {//else Gross profit is Price-Cost
              rootref.child('GrossProfit').set(snapshot.val()-cost);
              costPercentage = (cost/snapshot.val())*100;//cost percentage is cost/price *100
              percentage = (100-costPercentage);//profit percentage is 100 - cost percentage
              rootref.child('Cost Percentage').set(costPercentage.toFixed(2)+'%');//Set the values to the database with 2 floating points
              return rootref.child('Profit Percentage').set(percentage.toFixed(2)+'%');
          }
        });
        }
       else if(event.params.value == 'Price'){//If price has been added/modified
            var price = event.data.val();//Do the same as previously described with formulas related to the value changed
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
  
