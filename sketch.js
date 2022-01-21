var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood;
var foodObj;
var fedTime, lastFed, feed;
//create feed and lastFed variable here


function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //create feed the dog button here

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);


}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  //write code to read fedtime value from the database 
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  })

  //write code to display text lastFed time here
  textSize(15);
  fill("black");
  if (lastFed >= 12) {
    text("last fed = " + lastFed % 12 + " PM ", 350, 30);
  }
  else if (lastFed == 0) {
    text("last fed =12 AM ", 350, 30);
  }
  else {
    text("last fed = " + lastFed % 12 + " AM ", 350, 30);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog() {
  dog.addImage(happyDog);
  var val = foodObj.getFoodStock();
  if (val <= 0) {
    foodObj.updateFoodStock(val * 0);
  }
  else {
    foodObj.updateFoodStock(val - 1);

  }
  //write code here to update food stock and last fed time
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
