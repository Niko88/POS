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

  constructor(private database:DatabaseServiceService) { 
    this.items = database.getList('products/flat white/recipe');
    this.recipes = database.getList('products');
  }

  addOne(){
    var used = false;
    if(this.ingName == "Choose ingredient")
      alert("please choose one ingredient")
    else if (this.ingQuantity == 0 || this.ingQuantity == null || this.ingQuantity == NaN)
      alert("please enter a valid quantity")
      else{
            this.ingredients.forEach(element => {
              if(element.name == this.ingName)
              used = true;
              });
              if(used)
               alert("Ingredient already added!")
               else{
                  this.quantity = parseInt(this.ingQuantity)/1000;
                  this.database.setObject('products/'+this.menuitemName+'/recipe/'+this.ingName,this.quantity);
                  this.ingredients[this.numberIngredients]=({name:this.ingName,quantity:this.quantity});
                  this.numberIngredients++;
                  this.ingName = "Choose ingredient";
                  this.ingQuantity = null;
            }
      }
    console.log(this.ingredients);
  }

  start(){
    if(this.menuitemName != '')
    { 
      this.addIngredients = true;
      this.database.setObject('products/'+this.menuitemName+'/recipe/firstIng',0);}
    else
    alert("Enter product name");
  }
  // valuechange($event){
  //   if(this.numberIngredients==NaN || this.numberIngredients!=parseInt(this.numberIngredients,10))
  //     alert("The number of ingredients must be an integer number")
  //   else
  //   for (let i = 0; i< this.numberIngredients;i++){
  //     this.ingredients[i]=({name:'Choose ingredient',quantity:0});
  //   }
  // }
  addRecipe(){
    if(this.ingName != 'Choose ingredient' || this.ingQuantity!= null)
    alert("please add the last ingredient by clicking on 'Add Ingredient' ")
    else{
      if(this.itemPrice==0 || this.itemPrice == NaN || this.itemPrice == null ){
        alert("please add a price for the item")
      }else{
          this.database.setObject('products/'+this.menuitemName+'/CostProfit/Price',this.itemPrice);
          this.database.removeObject('products/'+this.menuitemName+'/recipe/firstIng');
          this.itemPrice = null;
          this.ingredients = [];
          this.numberIngredients = 0;
          this.database.removeObject('products/'+this.menuitemName+'/ingredientsCost/firstIng');
          this.menuitemName = '';
          this.ingName = "Choose ingredient";
          this.ingQuantity = null;
          this.addIngredients = false;
      }
    }
  }


}
