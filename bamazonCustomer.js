var mysql = require("mysql");
var inquirer = require('inquirer');



var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Lionking25!",
  database: "bamazon"
});

var item_id = 0;
var price = 0;

inquirer.prompt([
    {
        message: "Enter the product ID of the product you would like to purchase",
        type: "input",
        name: "product_id",
    }
    

]).then(answers => {
    
    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT * FROM products", function (err, result) {
          if (err) throw err;
          

            for(i=0;i<result.length;i++) {

                
                
                if (result[i].item_id == answers.product_id) {
                    item_id = answers.product_id;
                    var item_name = result[i].product_name;
                    price = result[i].price;
                    
                    howMany(item_name);
                    break;
                    
                    
                }
                else {
                    item_id = 0;
                }
            }
          
        });
      });
});


howMany = function(item_name) {
    inquirer.prompt([
        {
            message: "How Many "+ item_name +"'s would you like to purchase?",
            type: "input",
            name: "amount",
        }
        
    
    ]).then(answers => {
        
        var sql = 'SELECT * FROM products WHERE item_id = ?';
        connection.query(sql, [item_id], function (err, result) {
            if (err) throw err;
            answers.amount = parseInt(answers.amount);
            if(parseInt(answers.amount) <= parseInt(result[0].stock_quantity)) {

                var update_stock = result[0].stock_quantity - answers.amount;
                
                var update = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
                connection.query(update, [update_stock,item_id], function (err, result) {
                if (err) throw err;
                console.log('Thanks for purchasing ' + item_name + '! Your total cost is $' + (price *answers.amount) + '.');
                process.exit();
  });
            
            }
            else {                
            console.log("Sorry, we don't have enough in stock!");
            process.exit();
            }
            
            });
              
              
        });
        
}

/*
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
    var values = [
      ['Playstation 4', 'Electronics', 299, 50],
      ['Umbrella', 'Travel', 8, 25],
      ['Piano Keyboard', 'Musical Instruments', 350, 8],
      ['Umbrella', 'Travel', 8, 25],
      ['Blender', 'Electronics', 30, 15],
      ['iPhone', 'Phone', 400, 35],
      ['backpack', 'Travel', 40, 50],
      ['Violin', 'Musical Instruments', 360, 14],
      ['Shirt', 'Clothing', 20, 56],
      ['Pants', 'Clothing', 25, 45]
    ];
    connection.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });


*/