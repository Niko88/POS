import { Component} from '@angular/core';
import { DatabaseServiceService } from './database-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatabaseServiceService]
})
export class AppComponent {

  items;
  recipes;
  ingName = "Choose ingredient";
  ingQuantity;
  numberIngredients = 0;
  menuitemName = '';
  ingredients = [];
  addIngredients = false;
  itemPrice = null;
  quantity = 0;

  constructor(private database:DatabaseServiceService) { //Constructor initialise the webApp by getting an Observable list of recipes saved
    this.items = database.getList('products/flat white/recipe');
    this.recipes = database.getList('products');
  }

  addOne(){//add one ingredient to the recipe in the database
    var used = false;//check if the ingredient was previously added with a boolean variable to use as flag
    if(this.ingName == "Choose ingredient")//check an ingredient has been entered
      alert("please choose one ingredient")
    else if (this.ingQuantity == 0 || this.ingQuantity == null || this.ingQuantity == NaN)//check quantity has been entered as a number
      alert("please enter a valid quantity")
      else{
            this.ingredients.forEach(element => {//check ingredient was not preciously added
              if(element.name == this.ingName)
              used = true;//if it was flag used as true
              });
              if(used)
               alert("Ingredient already added!")
               else{//If ingredient was not previously added
                  this.quantity = parseInt(this.ingQuantity)/1000;//Convert the quantity from grams to KG
                  this.database.setObject('products/'+this.menuitemName+'/recipe/'+this.ingName,this.quantity);//Add the ingredient to the database
                  this.ingredients[this.numberIngredients]=({name:this.ingName,quantity:this.quantity});//Add the ingredient to the current list
                  this.numberIngredients++;//Increase the number of ingredients used (used as index for the list)
                  this.ingName = "Choose ingredient";//reset ingredient name for next item
                  this.ingQuantity = null;//reset ingredient quantity for next item
            }
      }
  }

  start(){ //Register the new entry to the database recipes
    if(this.menuitemName != '')//Check a name for the recipe has been entered
    { 
      this.addIngredients = true;//show the ingredient entry field if a recipe has started 
      this.database.setObject('products/'+this.menuitemName+'/recipe/firstIng',0);}//Uplooad a first empty ingredient to the recipe
    else
    alert("Enter product name");
  }
  addRecipe(){//close the recipe by adding the price, and empty the current list of ingredients 
    if(this.ingName != 'Choose ingredient' || this.ingQuantity!= null)//Check the last ingredient has been registered
    alert("please add the last ingredient by clicking on 'Add Ingredient' ")
    else{
      if(this.itemPrice==0 || this.itemPrice == NaN || this.itemPrice == null ){//Check a price has been entered
        alert("please add a price for the item")
      }else{
          this.database.setObject('products/'+this.menuitemName+'/CostProfit/Price',this.itemPrice);//Set the price for the item
          this.database.removeObject('products/'+this.menuitemName+'/recipe/firstIng');//Erase the first placeholder ingredient
          this.itemPrice = null;//reset everything and empty ingredients list
          this.ingredients.length = 0;
          this.numberIngredients = 0;
          this.menuitemName = '';
          this.ingName = "Choose ingredient";
          this.ingQuantity = null;
          this.addIngredients = false;
      }
    }
  }


}
