/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , poolObject=require('ConnectionPool');
var session=require('express-session');
var app = express();
var cookieParser = require('cookie-parser');
var dbObject = require('./routes/DatabaseController');
app.use(cookieParser());
// all environments
app.set('port', process.env.PORT || 3003);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(session({secret: 'invisible', resave:'true', saveUninitialized:'true' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());

poolObject.initializepool(10);

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/login', routes.login);
app.get('/logout',routes.logout);
app.get('/product_details', routes.product_details);
app.get('/bidproduct_details', routes.bidproduct_details);
app.get('/product_summary', routes.product_summary);
app.get('/products', routes.products);
app.get('/register', routes.register);
app.get('/productTypeFromCategory', routes.productTypeFromCategory);
app.get('/showPurchased',routes.showPurchased);
app.get('/addToCart',routes.addToCart);
app.get('/showCart',routes.showCart);
app.get('/deleteFromCart',routes.deleteFromCart);
app.get('/sellItem', routes.sellItem);
app.get('/updateItem', routes.listProductsBySeller);
app.get('/listSpecificItem', routes.listSpecificProduct);
app.get('/deleteSpecificItem', routes.deleteSpecificProduct);
app.get('/searchproductname',routes.searchproductname);
app.get('/searchperson',routes.searchperson);
app.get('/buyFromCart',routes.buyFromCart);
app.get('/updatePersonalInfo',routes.updatePersonalInfo);
app.get('/listSellers',routes.listSellers);
app.get('/deleteSeller',routes.deleteSeller);
app.get('/deleteAccount',routes.deleteAccount);
app.get('/admin',routes.admin);
app.get('/sellerLogin', routes.sellerLogin);
app.get('/sellerregistration', routes.sellerregistration);
app.get('/listAllTypeOfProduct ', routes.listAllTypeOfProduct );
app.get('/adminHome',routes.adminHome);


app.post('/bid_product', routes.bid_product);
app.post('/purchase', routes.purchase);
app.post('/checkout',routes.checkout);
app.post('/postLogin', routes.postLogin);
app.post('/postRegister', routes.postRegister);
app.post('/postUpdate',routes.postUpdate);
app.post('/createNewProduct', routes.createNewProduct);
app.post('/updateProduct', routes.updateProduct);
app.post('/adminLogin',routes.adminLogin);




http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	var updateBid="call updatebid();";
	dbObject.fireQuery(updateBid, function(err, result) {
	console.log("Update Bid : " + result);
	});
});
