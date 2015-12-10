var ejs = require('ejs');
var dbObject = require('./DatabaseController');
//var dbObject = require("../modules/mysqlcontroller");
var validate=require('./Validate');
var session = require('express-session');
var moment = require('moment');
var sessions = null;
var cart = null;
var allcategories = null;
var selected_productType = [];
var selectedType = null;
var tempProductInfo = null;

var country = "United States";

//=====================================================================================ANKUSH=====================================================================================

//=============================================================================================================================================================================
//Author : Ankush Singh(All Selling list, auction List & All categories) & Vikram Sai
exports.index = function(request, response) {
	//Vinay start
	//Update bid
	var updateBid="call updatebid();";
	//Vinay end
	var name = null;
	var lastLogin = null;
	if (sessions !== null) {
		name = request.session.fname + " " + request.session.lname;
		lastLogin = request.session.lastlogin;
	}

	//Ankush's query
	var sellingTypeProduct = "select * from ebay.product where p_is_bidding=1 ; ";
	var auctionTypeProduct = "select * from ebay.product where p_is_bidding=0 ;" ;

	//fetch distinct categories list
	var fetchCategories = "SELECT distinct(p_category) FROM ebay.product";
	var query = "SELECT * FROM ebay.seller S, ebay.product P where S.p_id=P.p_id;";
	console.log(query);
	var countRows = "SELECT COUNT(distinct p_category) FROM ebay.product";

	// check user already exists
	var p_type = request.param("ptype19");

	console.log("selected type is " + query);
	var pname = "";
	var category;
	var selectedCategory = new Array(8);
	var product_Type = new Array(50);

	//vinay **
	dbObject.fireQuery(updateBid, function(err, pRows){
		if(err)
		{
			//console.log("error");
			ejs.renderFile("./views/index.ejs", {message:"Error in Update bid"}, function(err, res){
				if(err){
					console.log(err);
					response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					
				}
				response.end(res);
			});
		}

	});

	//vinay **

	dbObject.fireQuery(auctionTypeProduct, function(err, pRows){
		if(err)
		{
			ejs.renderFile("./views/index.ejs", {message:"Error in deleting product",name: name, lastLogin: lastLogin, productRows: "",products:"",categories:"",
				selectedType:selected_productType,productInAuction:"",productInSell:""}, function(err, res){
					if(err){
						response.end(res);
					}
				});
		}
		else
		{
			productInAuction=pRows;
			console.log(">>>>>>>>>>"+productInAuction);

		}
	});
	dbObject.fireQuery(sellingTypeProduct, function(err, pRows){
		if(err)
		{
			ejs.renderFile("./views/index.ejs", {message:"Error in deleting product",name: name, lastLogin: lastLogin, productRows: "",products:"",
				categories:"",selectedType:selected_productType,productInAuction:"",productInSell:""}, function(err, res){
					if(err){
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
		}
		else
		{
			productInSell=pRows;
		}
	});

	dbObject.fireQuery(fetchCategories, function(err, pRows) {
		if (err) {
			console.log(err);
			response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
		} else {
			category = pRows;
			if (pRows.length > 0) {
				product_Type = "Select distinct p_type, p_category from ebay.product";
			}
			dbObject.fireQuery(product_Type, function(err, results) {
				if (err) {
					console.log(err);
					response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
				} else {
					selected_productType = results;
				}
			});

		}
	});
	dbObject.fireQuery(query, function(err, pRows) {
		dbObject.fireQuery(fetchCategories, function(err, categories) {
			if (err) {
				console.log("error");
				ejs.renderFile("./views/index.ejs", {
					message: "",
					name: name,
					lastLogin: lastLogin,
					products: pRows,
					categories: categories,
					selectedType: selected_productType
				}, function(err, res) {
					if (err) {
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			} else {
				allcategories = categories;
				ejs.renderFile('./views/index.ejs', {
					message: "",
					name: name,
					lastLogin: lastLogin,
					products: pRows,
					categories: categories,
					selectedType: selected_productType
				}, function(err, res) {
					if (err) {
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			}
		});
	});

};



//Author : Ankush Singh
exports.productTypeFromCategory = function(request, response) {

	var name = null;
	var lastLogin = null;
	if (sessions !== null) {
		name = request.session.fname + " " + request.session.lname;
		lastLogin = request.session.lastlogin;
	}


	var fetchCategories = "SELECT distinct(p_category) FROM ebay.product";
	var countRows = "SELECT COUNT(distinct p_category) FROM ebay.product";
	// check user already exists
	var p_type = request.param("ptype19");
	var select_category = request.param("category");
	var query = "SELECT * from ebay.product where p_type='" + p_type + "'" + "AND p_category='" + select_category + "';";
	console.log("selected type is " + query);
	var pname = "";
	var category;
	var selectedCategory = new Array(8);
	var product_Type = new Array(50);

	dbObject.fireQuery(fetchCategories, function(err, pRows) {
		if (err) {
			ejs.renderFile("./views/product.ejs", {
				message: "Error in deleting product",
				name: name,
				lastLogin: lastLogin,
				productRows: "",
				products: "",
				categories: "",
				selectedType: selected_productType
			}, function(err, res) {
				if (err) {
					console.log(err);
					response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
				}
				response.end(res);
			});
		} else {
			console.log(pRows);
			category = pRows;

		}
	});

	dbObject.fireQuery(query, function(err, pRows) {
		if (err) {
			ejs.renderFile("./views/products.ejs", {
				message: "Error in fetching products",
				name: name,
				lastLogin: lastLogin,
				products: pRows,
				categories: "",
				selectedType: selected_productType
			}, function(err, res) {
				if (err) {
					console.log(err);
					response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
				}
				response.end(res);
			});
		} else {
			//Vinay changes start inside
			console.log("Query executed Successfully" + query);
			if (pRows.length > 0) {
				console.log("result " + pRows[0].p_name);
				ejs.renderFile("./views/products.ejs", {
					message: "",
					name: name,
					lastLogin: lastLogin,
					products: pRows,
					categories: allcategories,
					selectedType: selected_productType
				}, function(err, res) {
					if (err) {
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			} else {
				response.send("<script>{ if(!alert('Sorry searched type not found!!')) document.location = '/';}</script>Not Found <a href='/'>Redirecting to Home page!!</a>!.");
			}
			//Vinay changes ends here
		}
	});

};


//Author :Ankush Singh 
exports.sellerLogin =function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var first_name = request.session.fname;
		var last_name =   request.session.lname;
		var email = request.session.email;
		var name= first_name+" "+last_name;
		var lastLogin = request.session.lastlogin;
		var checkSeller = "SELECT  * FROM ebay.person WHERE email=" + "'"+email+"';";

		dbObject.fireQuery(checkSeller, function(err, pRows){
			if(err)
			{
				console.log(err);
				response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
			}
			else
			{
				if(pRows[0].ssn==="" || pRows[0].ssn==="na" || pRows[0].ssn==="000000000"){
					response.send("<script>{ if(!alert('SSN is Must Before Selling any Product!!')) document.location = '/updatePersonalInfo';}</script>SSN is Must Before Selling any Product!!!! Click to <a href='/updatePersonalInfo'>Update Info!! Click here</a>!.");
				}
				else
				{

					ejs.renderFile("./views/SellItem.ejs", {message:"", name: name, lastLogin: lastLogin, categories: allcategories}, function(err, res){
						if(err){
							console.log(err);
							response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
						}
						response.end(res);
					});

				}

			}
		});
	}
};


//Author :Ankush Singh 
exports.selectState =function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var first_name = request.session.fname;
		var last_name =   request.session.lname;
		var name = first_name + " " + last_name;
		var email = request.session.email;
		var password = "first1";
		var selectCountry ="select distinct state from ebay.person where country= "+ "'"+ request.param("country")+ "'";

		dbObject.fireQuery(selectCountry, function(err, pRows){
			if(err)
			{
				ejs.renderFile("./views/SellItem.ejs", {message:"Something Wrong",name: "", lastLogin: "",country :country,count:"abc"}, function(err, res){
					if(err){
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			}
			else
			{
				country=pRows;
				console.log(country);
				ejs.renderFile("./views/SellItem.ejs", {message:"",name: name,country :country,count:"abc"}, function(err, res){
					if(err){
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			}
		});
	}
};
//Author :Ankush Singh 
exports.sellerregistration =function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var first_name = request.session.fname;
		var last_name =   request.session.lname;
		var name = first_name + " " + last_name;
		var email = request.session.email;
		var lastLogin = session.request.lastLogin;
		var countries;
		var selectCountry ="select distinct country from ebay.person";
		var country =request.param("country");
		var zip_code = request.param("zip_code");
		var address = request.param("address");
		var ssn =request.param("ssn");

		var updatesellerLogin = "UPDATE ebay.person INNER JOIN ebay.seller ON ebay.person.email " +
		" =ebay.seller.s_email  AND email ="+"'"+ email +"'"+"SET country ="+ "'"+country + "', zip_code= "+"'" + zip_code+ "'"+", address="  + "'"+ address+ "'" + ", ssn =" +"'" +ssn+ "'" ;
		console.log(updatesellerLogin);

		dbObject.fireQuery(selectCountry, function(err, pRows){
			if(err)
			{
				console.log(err);
				response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
			}
			else
			{
				countries=pRows;
			}
		});


		dbObject.fireQuery(updatesellerLogin, function(err, pRows){
			if(err)
			{
				ejs.renderFile("./views/SellItem.ejs", {message:"Something Wrong",name: name, lastLogin: lastLogin,country :countries,count:"abc"}, function(err, res){
					if(err){
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			}
			else
			{

				ejs.renderFile("./views/SellItem.ejs", {message:"abc",name: "", lastLogin: "",country :country,count:"abc"}, function(err, res){
					if(err){
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});

			}
		});
	}
};

//Author : Ankush Singh
exports.listAllTypeOfProduct =function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var first_name = request.session.fname;
		var last_name =   request.session.lname;
		var name = first_name + " " + last_name;
		var email = request.session.email;
		console.log("::::::::::::"    );
		var sellingproduct= request.param("sellingproduct");
		var auctionproduct= request.param("auctionproduct");
		console.log("::::::::::::"    +sellingproduct);
		dbObject.fireQuery(sellingTypeProduct, function(err, pRows){
			if(err)
			{
				ejs.renderFile("./views/index.ejs", {message:"Something Wrong",name: "", lastLogin: "",country :country,count:"abc",productInSell:"",productInAuction:""}, function(err, res){
					if(err){
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			}
			else
			{
				productInSell=pRows;
				ejs.renderFile("./views/index.ejs", {message:"",name: name,country :country,count:"abc",productInSell:productInSell,productInAuction:productInAuction}, function(err, res){
					console.log(productInSell);
					response.end(res);
				});
			}
		});
	}
};


//==========================================================================VIKRAM ARSID=======================================================================================

//=============================================================================================================================================================================

//Author : Vikram Arsid
exports.product_details = function(request, response) {
	var name = null;
	var lastLogin = null;
	var email = null;
	if (sessions !== null) {
		name = request.session.fname + " " + request.session.lname;
		email = request.session.email;
		lastLogin = request.session.lastlogin;
	}
	console.log("Product clicked for details");
	var id = request.param("productID");
	request.session.quantity = request.param("qty");
	var query = "SELECT * FROM ebay.product P where p_id='" + id + "';";
	console.log(query);
	dbObject.fireQuery(query, function(err, pRows) {
		console.log(pRows);
		if (err) {
			response.send("<script>{ if(!alert('Sorry!! Product cannot be fetched')) document.location = '/product_details?productID=" + id + "';}</script>Sorry!! Product cannot be fetched!! Click to <a href='/product_details?productID=" + id + ">Ok</a>!.");
		} else {

			ejs.renderFile("./views/product_details.ejs", {
				message: "",
				name: name, lastLogin: lastLogin, categories: allcategories, products: pRows
			}, function(err, res) {
				if (err) {
					console.log(err);
					response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
				}
				response.end(res);
			});
		}

	});
};

//Author : Vikram Arsid
exports.bidproduct_details = function(request, response) {
	var name = null;
	var lastLogin = null;
	var email = null;
	if (sessions !== null) {
		name = request.session.fname + " " + request.session.lname;
		email = request.session.email;
		lastLogin = request.session.lastlogin;
	}

	console.log("Product clicked for details");

	var id = request.param("productID");
	request.session.quantity = request.param("qty");
	request.session.pid = request.param("id");
	//Extract a product based on Product id.
	var query = "SELECT * FROM ebay.product P where p_id='" + id + "';";
	var bidquery = "SELECT * FROM ebay.bid_product WHERE p_id='" + id + "';";
	console.log(query);
	dbObject.fireQuery(query, function(err, pRows) {
		console.log(pRows);
		if (err) {
			response.send("<script>{ if(!alert('Sorry!! Product cannot be fetched')) document.location = '/bidproduct_details?productID=" + id + "';}</script>Sorry!! Product cannot be fetched!! Click to <a href='/product_details?productID=" + id + ">Ok</a>!.");
		} else {
			console.log(pRows[0].p_is_bidding);

			dbObject.fireQuery(bidquery, function(err, bresult) {
				console.log(bresult);
				if (err) {
					response.send("<script>{ if(!alert('Sorry!! Product cannot be fetched')) document.location = '/bidproduct_details?productID=" + id + "';}</script>Sorry!! Product cannot be fetched!! Click to <a href='/product_details?productID=" + id + ">Ok</a>!.");
				} else {
					console.log("After firequery");
					ejs.renderFile("./views/bidproduct_details.ejs", {
						message: "",
						products: pRows,
						bidval: bresult
					}, function(err, res) {
						if (err) {
							console.log(err);
							response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
						}
						response.end(res);
					});
				}

			});
		}
	});
};

//Author : Vikram Sai
exports.checkout = function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to View Shopping Cart!!')) document.location = '/login';}</script>Must Login first to Show Cart.!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var email = request.session.email;
		var quantity = request.param("qty");
		var pid = request.param("productID");
		request.session.productID = pid;
		request.session.qty = quantity;

		console.log(email);
		console.log(pid);
		//var pid="10015";
		var persondetails = "SELECT * FROM ebay.person WHERE ebay.person.email='" + email + "';";
		var prodetails = "SELECT * FROM ebay.product WHERE ebay.product.p_id='" + pid + "';";
		console.log(persondetails);
		console.log(prodetails);
		dbObject.fireQuery(persondetails, function(err, results) {
			if (err) {
				response.send("<script>{ if(!alert('Unable to checkout!! Try after some time')) document.location = '/';}</script>Unable to checkout.!! Click to <a href='/'>Retry unable to checkout</a>!.");
			} else {
				dbObject.fireQuery(prodetails, function(err, presults) {
					if (err) {
						response.send("<script>{ if(!alert('Unable to checkout!! Try after some time')) document.location = '/';}</script>Unable to checkout.!! Click to <a href='/'>Retry unable to checkout</a>!.");
					} else {
						console.log("query: " + results);
						ejs.renderFile("./views/checkout.ejs", {
							message: "",
							checkout: presults,
							person: results,
							qty: quantity
						}, function(err, res) {
							if (err) {
								console.log(err);
								response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
							} else {
								response.end(res);
							}

						});
					}
				});
			}
		});
	}
};

//==============================================================================VINAY==========================================================================================

//=============================================================================================================================================================================
//Author : Vinay Gulani
exports.bid_product = function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {

		var bidvalue = request.param("inputbid");

		var email = request.session.email;
		var id = request.param("productID");
		var price = request.param("price");

		console.log("Bidding a product");

		//Update the bid amount and email id of bidder
		var query1 = "UPDATE ebay.bid_product SET bidding_price='" + bidvalue + "', c_email='" + email + "' WHERE p_id='" + id + "';";
		var query2 = "UPDATE ebay.product SET p_cost='" + bidvalue + "' WHERE `p_id`='" + id + "';";


		if (bidvalue > price) {

			dbObject.fireQuery(query1, function(err, result1) {
				if (err) {
					console.log(err);
					ejs.renderFile("./views/bidproduct_details?productID='" + id + "'", {
						message: "Error in Bidding the product",
						productRows: result1
					}, function(err, res) {
						if (err) {
							console.log(err);
							response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
						}
						response.end(res);
					});
				} else {
					dbObject.fireQuery(query2, function(err, result2) {
						if (err) {
							ejs.renderFile("./views/bidproduct_details?productID='" + id + "'", {
								message: "Error in Bidding the product",
								productRows: result2
							}, function(err, res) {
								if (err) {
									console.log(err);
									response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
								}
								response.end(res);
							});
						} else {
							response.send("<script>{ if(!alert('Bid Placed Successfully')) document.location = '/bidproduct_details?productID=" + id + "';}</script>Successfully Placed Bid!! Click to <a href='/product_details?productID=" + id + ">Ok</a>!.");
						}
					});
				}
			});
		} else {

			response.send("<script>{ if(!alert('Please provide bid value more than current price')) document.location = '/bidproduct_details?productID=" + id + "';}</script>PLease input bid value nore than current price!! Click to <a href='/product_details?productID=" + id + ">Ok</a>!.");
		}

	}
};

exports.purchase = function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to View Shopping Cart!!')) document.location = '/login';}</script>Must Login first to Show Cart.!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var dateTime = "";
		dbObject.fetchTime(function(time) {
			dateTime = "" + time;
		});

		var name = request.session.fname + " " + request.session.lname;
		var lastLogin = request.session.lastlogin;
		var email = request.session.email;
		var id = request.session.productID;
		var qty = request.session.qty;
		console.log(email);
		console.log(id);
		console.log(name);

		var customerinsert1 = "Insert into ebay.customer values ('" + email + "', '" + id + "'," + qty + ",'buy','"+dateTime+"');";
		var customerinsert2 = "Update ebay.product set p_available_quantity=p_available_quantity-" + qty + " where p_id='" + id + "';";
		var customerupdate1 = "Update ebay.customer set p_quantity=p_quantity+" + qty + " where p_id='" + id + "' and c_email='" + email + "';";
		var customerupdate2 = "Update ebay.product set p_available_quantity=p_available_quantity-" + qty + " where p_id='" + id + "';";

		console.log(customerinsert1);
		console.log(customerupdate1);

		var query3 = "SELECT * FROM ebay.customer where p_id='" + id + "' and c_email='" + email + "' and p_status='buy';";
		dbObject.fireQuery(query3, function(err, results3) {
			if (err) {
				console.log(err);
				response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
			} else {
				console.log("query 3 after " + query3);
				// if product not exists in customer, insert into customer table
				if (results3.length < 1) {
					//add product into customer
					//var query4="INSERT INTO `ebay`.`customer` (`c_email`, `p_id`, `p_quantity`, `p_status`) VALUES ('"+email+"', '"+p_id+"', '1', 'buy');";
					dbObject.fireQuery(customerinsert1, function(err, results4) {
						if (err) {
							console.log("customerinsert1  after " + customerinsert1);
							console.log(err);
							response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
						} else {
							dbObject.fireQuery(customerinsert2, function(err, results4) {
								if (err) {
									console.log("customerinsert2  after " + customerinsert2);
									console.log(err);
									response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
								} else {

									response.send("<script>{ if(!alert('Succesfully Purchased !! We will ship you shortly')) document.location = '/';}</script>Succesfully Purchased !! We will ship you shortly Click to <a href='/'>Home</a>!.");
								}
							});
						}
					});
				}
				// else update the customer table by increasing the product bought
				else {
					dbObject.fireQuery(customerupdate1, function(err, results4) {
						if (err) {
							console.log("customerupdate1  after " + customerinsert1);
							console.log(err);
							response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
						} else {
							dbObject.fireQuery(customerupdate2, function(err, results4) {
								if (err) {
									console.log("customerupdate2  after " + customerupdate2);
									console.log(err);
								} else {

									response.send("<script>{ if(!alert('Succesfully Purchased !! We will ship you shortly')) document.location = '/';}</script>Succesfully Purchased !! We will ship you shortly Click to <a href='/'>Home</a>!.");
								}
							});
						}
					});
				}
			}
		});
	}

};

//Author : Vinay Gulani
exports.searchproductname = function(request, response) {
	var name = null;
	var lastLogin = null;
	var email = null;
	if (sessions !== null) {
		name = request.session.fname + " " + request.session.lname;
		email = request.session.email;
		lastLogin = request.session.lastlogin;
	}
	console.log("Product clicked for details");

	var p_name = request.param("p_name");
	//Extract a product based on Product id.
	var query = "SELECT * FROM ebay.product P where p_name='" + p_name + "';";

	console.log(query);

	dbObject.fireQuery(query, function(err, pRows, result) {
		console.log(result);
		console.log(pRows);
		if (err) {
			ejs.renderFile("./views/product_details.ejs", {
				message: "Error in fetching products",
				productRows: pRows
			}, function(err, res) {
				if (err) {
					console.log(err);
					response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
				}
				response.end(res);
			});
		} else {
			//Vinay changes start inside
			console.log("Query executed Successfully" + query);
			if (pRows.length > 0) {
				console.log("result " + pRows[0].p_name);
				ejs.renderFile("./views/product_details.ejs", {
					message: "",
					products: pRows
				}, function(err, res) {
					if (err) {
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			} else {
				response.send("<script>{ if(!alert('Sorry searched product name not found!!')) document.location = '/';}</script>Not Found <a href='/'>Redirecting to Home page!!</a>!.");
			}
			//Vinay changes ends here
		}
	});


};


//Author : Vinay Gulani
exports.searchperson = function(request, response) {
	var name = null;
	var lastLogin = null;
	var email = null;
	if (sessions !== null) {
		name = 'Admin';
		email = request.session.email;

	}

	console.log("Search for a person");

	var searchbasis = request.param("searchbasis");
	var srchFld = request.param("srchFld");

	//Extract a product based on Product id.
	var firstnameBasis = "SELECT * FROM ebay.person where first_name='" + srchFld + "';";
	var lastnameBasis = "SELECT * FROM ebay.person where last_name='" + srchFld + "';";
	var emailBasis = "SELECT * FROM ebay.person where email='" + srchFld + "';";


	if (searchbasis == "firstname") {
		dbObject.fireQuery(firstnameBasis, function(err, pRows, result) {
			console.log(result);
			console.log(pRows);
			if (err) {
				console.log(err);
				response.send("<script>{ if(!alert('Sorry Some Error Occured!!')) document.location = '/';}</script>Not Found <a href='/'>Redirecting to Home page!!</a>!.");
			} else {

				//Vinay changes start inside
				console.log("Query executed Successfully  " + firstnameBasis);
				if (pRows.length > 0) {
					ejs.renderFile("./views/adminHome.ejs", {
						message: "",
						persons: pRows
					}, function(err, res) {
						if (err) {
							console.log(err);
							response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
						}
						response.end(res);
					});
				} else {
					response.send("<script>{ if(!alert('Sorry searched First Name not found!!')) document.location = '/admin';}</script>Not Found <a href='/admin'>Redirecting to Admin page!!</a>!.");
				}
				//Vinay changes ends here
			}
		});
	} else if (searchbasis == "lastname") {
		dbObject.fireQuery(lastnameBasis, function(err, pRows, result) {
			console.log(result);
			console.log(pRows);
			if (err) {
				console.log(err);
				response.send("<script>{ if(!alert('Sorry Some Error Occured!!')) document.location = '/';}</script>Not Found <a href='/'>Redirecting to Home page!!</a>!.");
			} else {

				//Vinay changes start inside
				console.log("Query executed Successfully  " + lastnameBasis);
				if (pRows.length > 0) {
					ejs.renderFile("./views/adminHome.ejs", {
						message: "",
						persons: pRows
					}, function(err, res) {
						if (err) {
							console.log(err);
							response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
						}
						response.end(res);
					});
				} else {
					response.send("<script>{ if(!alert('Sorry searched Last Name not found!!')) document.location = '/admin';}</script>Not Found <a href='/admin'>Redirecting to Home page!!</a>!.");
				}
				//Vinay changes ends here
			}
		});
	} else {
		dbObject.fireQuery(emailBasis, function(err, pRows, result) {
			console.log(result);
			console.log(pRows);
			if (err) {
				console.log(err);
				response.send("<script>{ if(!alert('Sorry Some Error Occured!!')) document.location = '/';}</script>Not Found <a href='/'>Redirecting to Home page!!</a>!.");
			} else {

				//Vinay changes start inside
				console.log("Query executed Successfully  " + emailBasis);
				if (pRows.length > 0) {
					ejs.renderFile("./views/adminHome.ejs", {
						message: "",
						persons: pRows
					}, function(err, res) {
						if (err) {
							console.log(err);
							response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
						}
						response.end(res);
					});
				} else {
					response.send("<script>{ if(!alert('Sorry searched Email not found!!')) document.location = '/admin';}</script>Not Found <a href='/admin'>Redirecting to Home page!!</a>!.");
				}
				//Vinay changes ends here
			}
		});
	}


};

//=========================================================================VAIBHAV=============================================================================================

//=============================================================================================================================================================================

//Author : Vaibhav Namdev
exports.login = function(req, res) {

	if (sessions !== null) {
		var email = req.session.email;
		console.log("inside login");
		res.send("<script>{ if(!alert('Already Logged In to eBay with " + email + "')) document.location = '/';}</script>Already Logged In <a href='/'>Redirecting to Home page!! Already logged in to eBay</a>!.");
	} else {
		res.render('login');
	}
};

//Author : Vaibhav Namdev
exports.postLogin = function(req, res) {

	var email = req.param("email");
	var password = req.param("password");
	if (email === "" || password === "") {
		res.send("<script>{ if(!alert('Fields cannot be Empty')) document.location = '/login';}</script>Email or Password cannot be Empty Click to <a href='/login'>Login Again with correct Credientials</a>!.");
	}


	var checkLogin = "SELECT * FROM `ebay`.`person` WHERE email='" + email + "' AND password = '" + password + "';";
	console.log(checkLogin);
	var updateTime = "UPDATE `ebay`.`person` SET `last_login` = CURRENT_TIMESTAMP  WHERE `email` = '" + email + "';";
	console.log(updateTime);

	dbObject.fireQuery(checkLogin, function(err, person) {
		if (err) {

			//throw err;
			res.send("<script>{ if(!alert('Something goes wrong!!\nYou Logged in Successfully')) document.location = '/login';}</script>Not Logged successfully!! Click to <a href='/login'>Go User HOME</a>!.");
		} else {
			if (person.length > 0) {
				var lastl = "Last Login: " + person[0].last_login;
				var lastLogin = lastl.substring(0, 33);
				res.cookie("lastLogin", lastLogin);
				console.log(person[0].last_login);
				sessions = req.session;
				sessions.email = email;
				sessions.fname = person[0].first_name;
				sessions.lname = person[0].last_name;
				sessions.lastlogin = lastLogin;

				dbObject.fireQuery(updateTime, function(err, time) {
					if (err) {

						throw err;
					} else {



						console.log("successlogin");
						//res.send("<script>{ if(!alert('Congrats!!\nYou Logged in Successfully')) document.location = '/';}</script>Logged in!! Click to <a href='/'>Go User HOME</a>!.");
						res.send("<script>{ if(!alert('Congrats!! You Logged in Successfully')) document.location = '/';}</script>Logged In Successfully..!! Click to <a href='/'>Login Success</a>!.");
					}

				});

			} else {
				res.send("<script>{ if(!alert('Something Goes Wrong!! Not Logged In to Successfully!! Try Again')) document.location = '/login';}</script>Not Logged in!!Internal Errors!!  Click to <a href='/login'>Login Again</a>!.");
			}

		}

	});

//	res.send("<script>{ if(!alert('Something Goes Wrong!! Not Logged In to Successfully!! Try Again')) document.location = '/login';}</script>Posted Successfully..!! Click to <a href='/login'>Login Again</a>!.");

};

//Author : Vaibhav Namdev
exports.register = function(req, res) {

	console.log("inside register");
	if (sessions !== null) {
		var email = req.session.email;
		res.send("<script>{ if(!alert('Already Logged In to eBay with " + email + "')) document.location = '/';}</script>Already Logged In <a href='/'>Redirecting to Home page!! Already logged in to eBay</a>!.");
	} else {
		res.render('register');
	}
};

//Author : Vaibhav Namdev
exports.postRegister = function(req, res) {

	var dummy = "";
	var email = req.param("email");
	var password = req.param("password");
	var cpassword = req.param("cpassword");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	
	console.log(password+"  "+cpassword);
	
	if(!validateEmail(email)){
		console.log("Invalid email ID");
		res.send("<script>{ alert('Invalid Email ID !!'); document.location = '/register';}</script>");
				//"Invalid Values !! Mandatory Fields should not be empty..!! Click to <a href='/login'>Register to eBay</a>!.");
	}
	
	else if(!isValidPassword(password)){
		console.log("Invalid password");
		res.send("<script>{ alert('Invalid password. Please use appropriate combinations. !!'); document.location = '/register';}</script>");
		//res.send("<script>{ if(!alert('checked asdfasdfdsaf !!')) document.location = '/login';}</script>Invalid Values !! Mandatory Fields should not be empty..!! Click to <a href='/login'>Register to eBay</a>!.");
	}
	
	else if (email === "" || password === "" || firstname === "" || cpassword!==password) {
		res.send("<script>{ if(!alert('Invalid Credentials Check form!!')) document.location = '/register';}</script>Invalid Values !! Mandatory Fields should not be empty..!! Click to <a href='/register'>Register to eBay</a>!.");
	}

	else{
		var registerQuery = "INSERT INTO `ebay`.`person`(`first_name`,`last_name`,`email`,`password`,`address`,`city`,`state`,`country`,`zip_code`,`contact`,`ssn`,`last_login`) VALUES('" + firstname + "','" + lastname + "','" + email + "','" + password + "','" + dummy + "','" + dummy + "','" + dummy + "','" + dummy + "','" + dummy + "','" + dummy + "','" + dummy + "', CURRENT_TIMESTAMP);";
	
		dbObject.fireQuery(registerQuery, function(err, result) {
	
			if (err) {
				res.send("<script>{ if(!alert('Something Goes Wrong!! Not Logged In to Successfully!! Try Again')) document.location = '/register';}</script>Posted Successfully..!! Click to <a href='/register'>Login Again</a>!.");
			} else {
	
				var lastl = "New to eBay! no last login";
				sessions = req.session;
				sessions.email = email;
				sessions.fname = firstname;
				sessions.lname = lastname;
				sessions.lastlogin = lastl;
	
				res.send("<script>{ if(!alert('Successfully Registered to eBay!!')) document.location = '/';}</script>Registered Successfully..!! Click to <a href='/'>Welcome to eBay!! Get Started</a>!.");
			}
		});
	}
};


//Author : Vaibhav Namdev
exports.logout = function(req, res) {

	if (sessions === null) {
		res.send("<script>{ if(!alert('Not Logged In!!')) document.location = '/';}</script>Posted Successfully..!! Click to <a href='/'>Not Logged In to eBay</a>!.");
	}


	var updateTime = "UPDATE `ebay`.`person` SET `last_login` = CURRENT_TIMESTAMP  WHERE `email` = '" + req.session.email + "';";
	dbObject.fireQuery(updateTime, function(err, results) {
		if (err) {

			throw err;
		} else {
			req.session.destroy();
			sessions = null;


			res.send("<script>{ if(!alert('Logout Successfully from eBay!!')) document.location = '/';}</script>Posted Successfully..!! Click to <a href='/'>Logout Successfully</a>!.");

		}
	});

};

//Author : Vaibhav Namdev
exports.addToCart = function(request, response) {
	if (sessions === null) {
		response.send("<script>{ if(!alert('Must Log-In for Adding to Cart!!')) document.location = '/login';}</script>Must Login first to Add Products to Cart.!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var name = request.session.fname + " " + request.session.lname;
		var lastLogin = request.session.lastlogin;
		var email = request.session.email;
		var pid = request.param("selectPid");
		var cartAddQuery;
		var pquantity = 1;
		var isExist = 0;

		var checkCart = "Select p_id from `ebay`.`customer` WHERE c_email='" + email + "' AND p_id='" + pid + "' AND p_status='cart'";

		dbObject.fireQuery(checkCart, function(err, results) {
			if (err) {
				console.log(err);
				response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
			} else {
				isExist = results.length;
				if (isExist === 0) {
					cartAddQuery = "INSERT INTO `ebay`.`customer`(`c_email`,`p_id`,`p_quantity`,`p_status`)VALUES('" + email + "','" + pid + "','" + pquantity + "','cart')";
				} else {
					cartAddQuery = "UPDATE `ebay`.`customer` SET p_quantity = p_quantity + 1  WHERE c_email='" + email + "' AND p_id ='" + pid + "' AND p_status='cart'";
				}

				console.log(cartAddQuery);
				console.log(isExist);
				dbObject.fireQuery(cartAddQuery, function(err, results) {
					if (err) {

						response.send("<script>{ if(!alert('Unable to Instert into your Shopping cart!! Try after some time')) document.location = '/';}</script>Unable to fetch Cart.!! Click to <a href='/'>Retry unable to fetch your Cart</a>!.");
					} else {


						var cartDetails = "SELECT ebay.product.p_id,ebay.product.p_name,ebay.product.p_available_quantity,ebay.product.p_details,ebay.product.p_cost,ebay.product.p_available_quantity,ebay.customer.p_quantity FROM ebay.product, ebay.customer WHERE ebay.product.p_id = ebay.customer.p_id AND (ebay.customer.c_email='" + email + "' AND ebay.customer.p_status='cart')";

						dbObject.fireQuery(cartDetails, function(err, results) {
							if (err) {

								response.send("<script>{ if(!alert('Unable to fetch Shopping cart!! Try after some time')) document.location = '/';}</script>Unable to fetch Cart.!! Click to <a href='/'>Retry unable to fetch your Cart</a>!.");
							} else {
								cart = results;
								ejs.renderFile("./views/product_summary.ejs", {
									message: "Product Added to Cart",
									name: name,
									lastLogin: lastLogin,
									cart: results,
									categories: allcategories
								}, function(err, res) {
									if (err) {
										console.log(err);
										response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
									}
									response.end(res);
								});
							}
						});
					}
				});
			}
		});
	}
};

//Author : Vaibhav Namdev
exports.showCart = function(request, response) {
	if (sessions === null) {
		response.send("<script>{ if(!alert('Must logged in to View Shopping Cart!!')) document.location = '/login';}</script>Must Login first to Show Cart.!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var name = request.session.fname + " " + request.session.lname;
		var lastLogin = request.session.lastlogin;
		var email = request.session.email;
		var cartDetails = "SELECT ebay.product.p_id,ebay.product.p_name,ebay.product.p_available_quantity,ebay.product.p_details,ebay.product.p_cost,ebay.product.p_available_quantity,ebay.customer.p_quantity FROM ebay.product, ebay.customer WHERE ebay.product.p_id = ebay.customer.p_id AND (ebay.customer.c_email='" + email + "' AND ebay.customer.p_status='cart')";

		dbObject.fireQuery(cartDetails, function(err, results) {
			if (err) {

				response.send("<script>{ if(!alert('Unable to fetch Shopping cart!! Try after some time')) document.location = '/';}</script>Unable to fetch Cart.!! Click to <a href='/'>Retry unable to fetch your Cart</a>!.");
			} else {
				cart = results;
				ejs.renderFile("./views/product_summary.ejs", {
					message: "",
					name: name,
					lastLogin: lastLogin,
					cart: results,
					categories: allcategories
				}, function(err, res) {
					if (err) {
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}

					response.end(res);
				});

			}

		});
	}

};

//Author : Vaibhav Namdev
exports.deleteFromCart = function(request, response) {


	if (sessions === null) {
		response.send("<script>{ if(!alert('Not logged in to Ebay!!')) document.location = '/login';}</script>Not logged in to Ebay! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	}

	var email = request.session.email;
	var pid = request.param("pid");

	var updateCart = "DELETE FROM `ebay`.`customer` WHERE c_email='" + email + "' AND p_id='" + pid + "' AND p_status='cart'";
	console.log(updateCart);

	dbObject.fireQuery(updateCart, function(err, results) {
		if (err) {
			response.send("<script>{ if(!alert('Can't Delete!! Something Went Wrong!! Try After some time ')) document.location = '/showCart';}</script>Can't Delete!! Something Went Wrong!! Try After some time<a href='/showCart'>Back to Cart </a>!.");
		} else {
			response.send("<script>{ if(!alert('Product removed from Cart Successfully!!')) document.location = '/showCart';}</script>Product Removed Successfully from Cart <a href='/showCart'>Back to Cart </a>!.");

		}

	});
};



//Author : Vaibhav Namdev
exports.showPurchased = function(request, response) {
	//vinay **
	var updateBid="call updatebid();";
	dbObject.fireQuery(updateBid, function(err, pRows){
		if(err)
		{
			//console.log("error");
			ejs.renderFile("./views/index.ejs", {message:"Error in Update bid"}, function(err, res){
				if(err){
					console.log(err);
					response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
				}
				response.end(res);
			});
		}

	});

	//vinay **
	if (sessions === null) {
		response.send("<script>{ if(!alert('Must logged in to View Shopping Cart!!')) document.location = '/login';}</script>Must Login first to Show Cart.!! Click to <a href='/login'>Not Logged In to eBay</a>!.");

	} else {
		var name = request.session.fname + " " + request.session.lname;
		var lastLogin = request.session.lastlogin;
		var email = request.session.email;
		var purchaseDetails = "SELECT ebay.product.p_id,ebay.product.p_name,ebay.product.p_available_quantity,ebay.product.p_details,ebay.product.p_cost,ebay.customer.p_quantity,ebay.customer.p_date,ebay.product.p_img  FROM ebay.product, ebay.customer WHERE ebay.product.p_id = ebay.customer.p_id AND (ebay.customer.c_email='" + email + "' AND ebay.customer.p_status='buy')";
		//Vinay Changes start
		var bidHistory="SELECT bp.p_id, bp.c_email, bp.bidding_price, bp.bidding_deadline,bp.update_status,p.p_name,p.p_details,p.p_img  FROM ebay.bid_product AS bp INNER JOIN ebay.product AS p ON bp.p_id=p.p_id where c_email='" + email + "';";
		//Vinay Changes end

		dbObject.fireQuery(purchaseDetails, function(err, results) {
			if (err) {

				response.send("<script>{ if(!alert('Unable to fetch Purchased History!! Try after some time')) document.location = '/';}</script>Unable to fetch History.!! Click to <a href='/'>Retry unable to fetch your History</a>!.");
			} else {
//				Vinay Changes start inside
				dbObject.fireQuery(bidHistory, function(err, results1) {
					if (err) {
						response.send("<script>{ if(!alert('Unable to fetch Bid History!! Try after some time')) document.location = '/';}</script>Unable to fetch History.!! Click to <a href='/'>Retry unable to fetch your History</a>!.");
					} else {
						cart = results;
						ejs.renderFile("./views/purchasedItems.ejs", {
							message: "",
							name: name,
							lastLogin: lastLogin,
							purchase: results,
							categories: allcategories,
							bidHistory: results1
						}, function(err, res) {
							if (err) {
								console.log(err);
								response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
							}
							response.end(res);
						});
					}
				});
			}
		});
	}
};

//Author : Vaibhav Namdev

exports.buyFromCart = function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to Purchase from cart!!')) document.location = '/login';}</script>Must logged in to Purchase from cart!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else if (cart === null || cart.length === '0') {
		response.send("<script>{ if(!alert('Nothing found in 'YOur cart!! or Go to cart first')) document.location = '/showCart';}</script>Nothing found in 'YOur cart!! or Go to cart first!! Click to <a href='/showCart'>Nothing in Cart</a>!.");
	} else {
		var dateTime = "";
		dbObject.fetchTime(function(time) {
			dateTime = "" + time;
		});
		var email = request.session.email;
		var available = 0;
		var totalSuccess = 0;
		for (var i = 0; i < cart.length; i++) {
			console.log("Here are you ---> " + cart['0'].p_quantity);
			var isAvailable = "select ebay.product.p_available_quantity from ebay.product where p_id='" + cart[i].p_id + "'";
			console.log(isAvailable);
			console.log("Here are you $$$$$ " + cart.length);
			var cartQuantity = cart[i].p_quantity;
			var produtId = cart[i].p_id;

			dbObject.fireQuery(isAvailable, function(err, availability) {
				if (err) {
					response.send("<script>{ if(!alert('Unable to buy...!! Try after some time')) document.location = '/showCart';}</script>Unable to buy...!! Try after some time!! Click to <a href='/showCart'>Unable to buy...!! Try after some time</a>!.");

				} else {
					available = availability['0'].p_available_quantity;
					console.log(available + " and compared to " + cartQuantity);
					if (parseInt(available) >= parseInt(cartQuantity)) {
						var purchase = "UPDATE ebay.product a INNER JOIN ebay.customer b ON (a.p_id=b.p_id)  SET a.p_available_quantity=a.p_available_quantity-" + cartQuantity + ", b.p_status='buy', b.p_date='" + dateTime + "' WHERE (a.p_id='" + produtId + "' AND b.c_email='" + email + "' AND b.p_id='" + produtId + "' AND b.p_status='cart')";
						dbObject.fireQuery(purchase, function(err, isPurchased) {
							if (err) {
								response.send("<script>{ if(!alert('Unable to buy...!! Try after some time')) document.location = '/showCart';}</script>Unable to buy...!! Try after some time!! Click to <a href='/showCart'>Unable to buy...!! Try after some time</a>!.");
							} else {
								console.log("Product successfully purchased");
								totalSuccess = totalSuccess + 1;
							}
						});
					} else {
						console.log("You Won");
					}
				}
			});
			//----loop ends----
		}
		var failed = cart.length - totalSuccess;
		response.send("<script>{ if(!alert('Product Successfully Purchased')) document.location = '/showPurchased';}</script>Successfully Purchased!! Click to <a href='/showPurchased'>Successfully Purchased Go to Product Purchase history</a>!.");
	}
};


//Author : Vaibhav Namdev
exports.updatePersonalInfo = function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var email = request.session.email;
		var lastLogin = request.session.lastlogin;
		var name = request.session.fname + " " + request.session.lname;
		var getInfo = "select * from `ebay`.`person` WHERE email='" + email + "'";

		dbObject.fireQuery(getInfo, function(err, results) {
			if (err) {
				response.send("<script>{ if(!alert('Unable to fetch details...!! Try after some time')) document.location = '/';}</script>Unable to fetch details...!! Try after some time!! Click to <a href='/'>Unable to fetch details......!! Try after some time</a>!.");
			} else {

				ejs.renderFile("./views/personalInfo.ejs", {
					message: "",
					name: name,
					lastLogin: lastLogin,
					pInfo: results,
					categories: allcategories
				}, function(err, res) {
					if (err){
						console.log(err);
						response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
					}
					response.end(res);
				});
			}
		});


	}
};

//Author : Vaibhav Namdev

exports.deleteSeller = function(request, response) {

	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {

		var email = request.session.email;
		var name = request.session.fname + " " + request.session.lname;
		var lastLogin = request.session.lastlogin;

		var deleteSellerQuery = "Delete from ebay.seller, ebay.product Using ebay.seller INNER JOIN ebay.product WHERE (seller.p_id=product.p_id AND seller.s_email='" + email + "')";


		dbObject.fireQuery(deleteSellerQuery, function(err, result) {
			if (err) {
				response.send("<script>{ if(!alert('Unable to delete seller...!! Try after some time')) document.location = '/updatePersonalInfo';}</script>Unable to delete seller...!! Try after some time!! Click to <a href='/updatePersonalInfo'>Unable to delete seller.....!! Try after some time</a>!.");
			} else {
				console.log(result.affectedRows);
				if (result.length !== 0 || result.length !== null || result.affectedRows !== '0') {
					response.send("<script>{ if(!alert('Successfully Deleted Seller Account...!!')) document.location = '/updatePersonalInfo';}</script>Successfully Deleted Seller Account...!!  <a href='/updatePersonalInfo'>Successfully Deleted Seller Account...!!</a>!.");
				} else {
					response.send("<script>{ if(!alert('You are already not a Seller!!')) document.location = '/updatePersonalInfo';}</script>You are already not a seller...!!  <a href='/updatePersonalInfo'>Your already not a seller...!!</a>!.");
				}
			}
		});
	}
};


//Author : Vaibhav Namdev
exports.deleteAccount = function(request, response) {
	response.send("<script>{ if(!alert('Successfully deleted Account!! Soon Welcome back to ebay')) document.location = '/logout';}</script>Successfully deleted Account!! Soon Welcome back to ebay!!  <a href='/logout'>Successfully deleted Account!! Soon Welcome back to ebay!!</a>!.");
};


exports.postUpdate = function(request, response) {
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		var email = request.session.email;
		//-----validations here-----

		if (isValidSSN(request.param("ssn"))) {
			console.log("ok ssn");
		}
		var updateInfo = "UPDATE `ebay`.`person` SET `first_name` = '" + request.param("fname") + "',`last_name` = '" + request.param("lname") + "', `address` = '" + request.param("address") + "', `city` = '" + request.param("city") + "', `state` = '" + request.param("state") + "', `country` = '" + request.param("country") + "', `zip_code` = '" + request.param("zip") + "', `contact` = '" + request.param("contact") + "', `ssn` = '" + request.param("ssn") + "' WHERE `email` = '" + email + "';";
		dbObject.fireQuery(updateInfo, function(err, result) {
			if (err) {
				response.send("<script>{ if(!alert('Unable to update details...!! Try after some time')) document.location = '/';}</script>Unable to update details...!! Try after some time!! Click to <a href='/'>Unable to update details......!! Try after some time</a>!.");
			} else {
				response.send("<script>{ if(!alert('Information Updated Successfully')) document.location = '/updatePersonalInfo';}</script>Information Updated Successfully!! Click to <a href='/updatePersonalInfo'>Click to Redirect to your profile</a>!.");
			}
		});
	}
};

//Author : Vaibhav Namdev
exports.listSellers = function(request, response) {

	var name = null;
	var lastLogin = null;
	if (sessions !== null) {
		name = request.session.fname + " " + request.session.lname;
		lastLogin = request.session.lastlogin;
	}
	if (allcategories === null) {
		response.send("<script>{ if(!alert('Redirecting to home page of eBay')) document.location = '/';}</script>Redirecting to home page of eBay!! Click to <a href='/'>Redirecting to home page of eBay</a>!.");
	} else {

		var listSellerQuery = "select * from ebay.person where email in (SELECT DIStinct(s_email) FROM ebay.seller);";

		dbObject.fireQuery(listSellerQuery, function(err, result) {
			if (err) {
				response.send("<script>{ if(!alert('Unable to fetch details...!! Try after some time')) document.location = '/';}</script>Unable to fetch details...!! Try after some time!! Click to <a href='/'>Unable to update details......!! Try after some time</a>!.");
			} else {

				ejs.renderFile("./views/listSellers.ejs", {
					message: "",
					sInfo: result,
					name: name,
					lastLogin: lastLogin,
					categories: allcategories
				}, function(err, res) {
					if (err){
						response.send("<script>{ if(!alert('Unable to fetch details...!! Try after some time')) document.location = '/';}</script>Unable to fetch details...!! Try after some time!! Click to <a href='/'>Unable to update details......!! Try after some time</a>!.");
					}
					response.end(res);
				});

			}

		});


	}

};

//Author : Vaibhav Namdev
exports.admin = function(req, res) {
	res.render('admin', {
		title: 'Ebay'
	});
};

//Author : Vaibhav Namdev
exports.adminLogin = function(req, res) {
	var adminName = req.param("adminName");
	var password = req.param("password");

	if (adminName === 'admin@ebay.com' && password === 'admin') {
		sessions = req.session;
		sessions.email = adminName;
		sessions.password = password;

		res.render('adminHome', {
			title: 'Ebay'
		});
	} else {
		res.render('admin', {
			title: 'Ebay'
		});
	}
};



//=========================================================================DHAWAL SAWLA=======================================================================================

//=============================================================================================================================================================================

//Author : Dhawal Sawla
exports.createNewProduct = function(request, response){
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} else {
		//Validate before going further
		var	name = request.session.fname + " " + request.session.lname;
		var	lastLogin = request.session.lastlogin;
		var email=request.session.email;
		var validateFlag=true;
		var message;

		//Validation only for Auction, not for Selling
		if(request.param("sellingType")==="Auction")
		{
			if(!validate.validateDate(request.param("deadline")))
			{
				validateFlag=false;
				message="Please insert correct Deadline. You can insert any date from tomorrow onwards";
			}
		}

		if(!validate.validateNumber(request.param("cost")))
		{
			console.log("validation failed");
			validateFlag=false;
			message="Please insert numeric value for Cost";
		}

		if(!validate.validateInteger(request.param("availablequantity")))
		{
			console.log("validation failed");
			validateFlag=false;
			message="Please insert Integer value for Quantity";
		}

		if(validateFlag===false)
		{
			response.send("<script>{alert('"+message+"'); document.location='/sellItem';}</script>");
		}
		else
		{
			console.log("allcategories: "+allcategories);

			var available_quantity=request.param('availablequantity');
			var is_bidding=request.param('sellingType');

			if(is_bidding=="Auction")
				is_bidding=1;
			else
				is_bidding=0;

			var product_id=null;

			console.log("avail quantity: "+ available_quantity+", is_bidding: "+ is_bidding);

			//fetch last product ID
			var query="select MAX(p_id) as p_id from ebay.product;";

			dbObject.fireQuery(query, function(err, pRows){
				if(err){
					console.log(err);
					response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
				}else
				{
					console.log("select query fired successfully");
					product_id=parseInt(JSON.stringify(pRows[0].p_id)) + parseInt("1");
					console.log("New prod id: "+product_id);

					console.log("Image: "+request.param("image"));

					var query1="insert into product(p_id, p_name, p_condition, p_details, p_cost, p_category, p_type, p_available_quantity, p_is_bidding, p_is_exist, p_img) values('"+product_id+"', '"+request.param('productName')+"', '"+request.param('condition')+"', '"+request.param('details')+
					"', '"+request.param('cost')+"', '"+request.param('category')+"',  '"+request.param('type')+"', '"+available_quantity+"', '"+is_bidding+"', '1', '"+"/themes/images/products/"+request.param('image')+"');";

					console.log(query1);

					dbObject.fireQuery(query1, function(err, pRows){
						if(err)
						{
							ejs.renderFile("./views/SellItem.ejs", {message:"Error in creating product",name: name,
								lastLogin: lastLogin, categories:allcategories}, function(err, res){
									if(err)
									{
										console.log(err);
										response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
									}

									response.end(res);
								});
						}
						else
						{
							console.log("Product inserted successfully");
							//Insert corresponding seller into DB
							//replace with session's email ID

							var query2="insert into seller(s_email, p_id, s_rating, s_quantity) values('"+email+"', '"+product_id+"', '5', '"+available_quantity+"');";//replace with rating

							console.log(query2);

							dbObject.fireQuery(query2, function(err, pRows){
								if(err)
								{
									console.log("Error in seller");
									ejs.renderFile("./views/SellItem.ejs", {message:"Error in inserting seller for the product", name: name,
										lastLogin: lastLogin,categories:allcategories}, function(err, res){
											if(err){
												console.log(err);
												response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
											}
											response.end(res);
										});
								}
								else
								{
									console.log("Seller inserted successfully");

									//Insert into bidding table if the product is kept for bidding
									if(is_bidding=="1")
									{
										var now = moment(new Date());
										var userDate=request.param("deadline");
										var formatDate=userDate.substring(0, 4)+"-"+userDate.substring(5, 7)+"-"+userDate.substring(8, 10)+" "+userDate.substring(11, 13)+":"+userDate.substring(14, 16)+":00";
										console.log("Formatted date: "+formatDate);

										var query3="insert into bid_product(p_id, c_email, bidding_price, bidding_deadline) values('"+product_id+"', '"+email+"', '"+request.param("cost")+"', '"+formatDate+"');";

										console.log(query3);

										dbObject.fireQuery(query3, function(err, pRows){
											if(err)
											{
												ejs.renderFile("./views/SellItem.ejs", {message:"Error in inserting in bid_product for the product", name: name,
													lastLogin: lastLogin,categories:allcategories}, function(err, res){
														if(err){
															console.log(err);
															response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
														}
														response.end(res);
													});
											}
											else
											{
												console.log("Bidder inserted successfully");
												ejs.renderFile("./views/SellItem.ejs", {message:"Product Created and kept for Selling",name: name,
													lastLogin: lastLogin, categories:allcategories}, function(err, res){
														if(err){
															console.log(err);
															response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
														}
														response.end(res);
													});
											}
										});
									}
									else
									{
										ejs.renderFile("./views/SellItem.ejs", {message:"Product Created and kept for Selling",name: name,
											lastLogin: lastLogin, categories:allcategories}, function(err, res){
												if(err){
													console.log(err);
													response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
												}
												response.end(res);
											});
									}
								}
							});
						}
					});
				}
			});
		}
	}
}

exports.updateProduct = function(request, response){
	if (sessions === null || (request.session.email === null)) {
		response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
	} 
	else {

		//Validate before going further

		var validateFlag=true;
		var message;


		var first_name = request.session.fname;
		var last_name =   request.session.lname;
		var email = request.session.email;
		var name= first_name+" "+last_name;
		var lastLogin = request.session.lastlogin;
		var checkSeller = "SELECT  * FROM ebay.person WHERE email=" + "'"+email+"';";

		dbObject.fireQuery(checkSeller, function(err, pRows){
			if(err)
			{
				response.send("<script>{ if(!alert('Unable to go to update items.. Try After some time!!')) document.location = '/updatePersonalInfo';}</script>Unable to go to update items.. Try After some time <a href='/updatePersonalInfo'>Update Info!! Click here</a>!.");
			}
			else
			{
				if(pRows[0].ssn==="" || pRows[0].ssn==="na" || pRows[0].ssn==="000000000"){
					response.send("<script>{ if(!alert('SSN is Must Before Selling any Product!!')) document.location = '/updatePersonalInfo';}</script>SSN is Must Before Selling any Product!!!! Click to <a href='/updatePersonalInfo'>Update Info!! Click here</a>!.");
				}
				else
				{

					//Validation only for Auction, not for Selling
					if(request.param("sellingType")==="Auction")
					{
						if(!validate.validateDate(request.param("deadline")))
						{
							validateFlag=false;
							message="Please insert correct Deadline. You cannot insert past date";
						}
					}

					if(!validate.validateNumber(request.param("cost")))
					{
						console.log("validation failed");
						validateFlag=false;
						message="Please insert numeric value for Cost";
					}

					if(!validate.validateInteger(request.param("availablequantity")))
					{
						console.log("validation failed");
						validateFlag=false;
						message="Please insert Integer value for Quantity";
					}

					if(validateFlag===false)
					{
						response.send("<script>{alert('"+message+"'); document.location='/updateItem';}</script>");
					}
					else
					{
						/*
		if(!validate.validateInteger(request.param("availablequantity")))
		{
			console.log("validation failed");
			response.send("<script>{alert('Please insert Integer value for Quantity'); document.location='/sellItem';}</script>");
		}

		if(!validate.validateNumber(request.param("cost")))
		{
			console.log("validation failed");
			response.send("<script>{alert('Please insert numeric value for Cost'); document.location='/sellItem';}</script>");
		}
						 */
						var productSellingType;

						if(request.param("sellingType")==="bidding")
						{
							productSellingType=1;
						}
						else
						{
							productSellingType=0;
						}

						console.log("Selling Type: "+ productSellingType);

						console.log("request.session.productID: "+ request.session.productID);

						var query1;
						console.log("Image: "+request.param("image"));

						if(request.param("image")===undefined)
						{
							console.log("Without image");
							query1="update product set p_name='"+request.param("productName")+"', " +
							"p_condition='"+request.param("condition")+"', " +
							"p_details='"+request.param("details")+"', " +
							"p_cost='"+request.param("cost")+"', " +
							"p_category='"+request.param("category")+"', " +
							"p_type='"+request.param("type")+"', " +
							"p_available_quantity='"+request.param("availablequantity")+"', " +
							"p_is_bidding='"+productSellingType+"' " +
							"where p_id='"+request.session.productID+"';";
						}
						else
						{
							console.log("With image");
							query1="update product set p_name='"+request.param("productName")+"', " +
							"p_condition='"+request.param("condition")+"', " +
							"p_details='"+request.param("details")+"', " +
							"p_cost='"+request.param("cost")+"', " +
							"p_category='"+request.param("category")+"', " +
							"p_type='"+request.param("type")+"', " +
							"p_available_quantity='"+request.param("availablequantity")+"', " +
							"p_is_bidding='"+productSellingType+"', " +
							"p_img='/themes/images/products/"+request.param("image")+"' " +
							"where p_id='"+request.session.productID+"';";
						}

						console.log(query1);

						dbObject.fireQuery(query1, function(err, pRows){
							if(err)
							{
								ejs.renderFile("./views/UpdateItem.ejs", {message:"Error in updating product", productInfo:tempProductInfo,name: name,
									lastLogin: lastLogin, categories:allcategories}, function(err, res){
										if(err){
											console.log(err);
											response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
										}
										response.end(res);
									});
							}
							else
							{
								//Update corresponding seller into DB
								var email=request.session.email;//replace with session's email ID

								var query="update seller set s_email='"+email+"', s_rating='10', s_quantity='"+request.param("availablequantity")+"' where p_id='"+request.session.productID+"';";

								console.log(query);

								dbObject.fireQuery(query, function(err, pRows){
									if(err)
									{
										ejs.renderFile("./views/UpdateItem.ejs", {message:"Error in updating seller for the product",name: name,
											lastLogin: lastLogin, productInfo:tempProductInfo, categories:allcategories}, function(err, res){
												if(err){
													console.log(err);
													response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
												}
												response.end(res);
											});
									}
									else
									{
										var now=moment(new Date());
//										var currentDateTime=now.format("YYYY-MM-DD")+" "+now.format("HH:mm:ss");

										var query;

										console.log("--------"+request.param("sellingType"));
										//Update bidding table if the product is kept for bidding else delete the entry from the table
										if(request.param("sellingType")==="Auction")
										{
											var userDate=request.param("deadline");
											var formatDate=userDate.substring(0, 4)+"-"+userDate.substring(5, 7)+"-"+userDate.substring(8, 10)+" "+userDate.substring(11, 13)+":"+userDate.substring(14, 16)+":00";
											console.log("Formatted date: "+formatDate);

											query="update bid_product set c_email='"+email+"', bidding_price='"+request.param("cost")+"', bidding_deadline='"+formatDate+"' where p_id='"+request.session.productID+"';";//replace bidding_deadline as dynamic
										}
										else
										{
											query="delete from bid_product where p_id='"+request.session.productID+"';";
										}

										console.log(query);

										dbObject.fireQuery(query, function(err, pRows){
											if(err)
											{
												ejs.renderFile("./views/UpdateItem.ejs", {message:"Error in updating in bid_product for the product",name: name,
													lastLogin: lastLogin, productInfo:tempProductInfo, categories:allcategories}, function(err, res){
														if(err){
															console.log(err);
															response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
														}
														response.end(res);
													});
											}
											else
											{
												//listSpecificProduct;
												//listProductsBySeller(request, response);

												//take email id of seller from session
												var email=request.session.email;//replace with session's email id

												//Extracts all products for a particular seller.
												var query="SELECT P.p_id, p_name, p_details, p_cost, p_img FROM ebay.seller S, ebay.product P where s_email='"+email+"' and S.p_id=P.p_id and P.p_is_exist='1';";

												console.log(query);

												dbObject.fireQuery(query, function(err, pRows){
													if(err)
													{
														ejs.renderFile("./views/ListProducts.ejs", {message:"Error in fetching products",name: name,
															lastLogin: lastLogin,categories:allcategories, products: pRows}, function(err, res){
																if(err){
																	console.log(err);
																	response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
																}
																response.end(res);
															});
													}
													else
													{
														ejs.renderFile("./views/ListProducts.ejs", {message:"Product updated successfully",name: name,
															lastLogin: lastLogin,categories:allcategories, products: pRows}, function(err, res){
																if(err){
																	console.log(err);
																	response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
																}
																response.end(res);
															});
													}
												});
												/*
								ejs.renderFile("./views/UpdateItem.ejs", {message:"Product Updated Successfully", productInfo:tempProductInfo, categories:allcategories}, function(err, res){
									if(err)
										console.log(err);

									response.end(res);
								});
												 */
											}
										});
									}
								});
							}
						});
					}
				
				}
		
		}
		});
	}
};

//		Author : Dhawal Sawla
		exports.sellItem = function(request, res)
		{
			if (sessions === null || (request.session.email === null)) {
				response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
			} else {

				var	name = request.session.fname + " " + request.session.lname;
				console.log("Inside SellItem ------------------>  "+name);
				var	lastLogin = request.session.lastlogin;
				var email=request.session.email;

				if(allcategories==null)
				{
					var query="SELECT distinct p_category FROM ebay.product limit 35;";//replace limit 35, remove it

					dbObject.fireQuery(query, function(err, cRows){
						if(err)
						{
							ejs.renderFile("./views/sellItem.ejs", {message:"",name: name,
								lastLogin: lastLogin, categories:allcategories}, function(err, result){
									if(err){
										console.log(err);
										response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
									}
									res.end(result);
								});
						}
						else
						{
							allcategories=JSON.parse(JSON.stringify(cRows));
							console.log("loaded categories: "+allcategories);
							ejs.renderFile("./views/sellItem.ejs", {message:"",name: name,
								lastLogin: lastLogin, categories:allcategories}, function(err, result){
									if(err){
										console.log(err);
										response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
									}
									res.end(result);
								});
						}
					});
				}
				else
				{
					console.log("Categories: "+allcategories);
					ejs.renderFile("./views/sellItem.ejs", {message:"",name: name,
						lastLogin: lastLogin, categories:allcategories}, function(err, result){
							if(err){
								console.log(err);
								response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
							}
							res.end(result);
						});
				}
			}
		};

		function listProductsBySeller(request, response)
		{
			//take email id of seller from session
			if (sessions === null || (request.session.email === null)) {
				response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
			} else {
				var	name = request.session.fname + " " + request.session.lname;
				var	lastLogin = request.session.lastlogin;
				var email=request.session.email;//replace with session's email id

				//Extracts all products for a particular seller.
				var query="SELECT P.p_id, p_name, p_details, p_cost, p_img FROM ebay.seller S, ebay.product P where s_email='"+email+"' and S.p_id=P.p_id and P.p_is_exist='1';";
				//var query="SELECT * FROM ebay.seller S, ebay.product P where s_email='"+email+"' and S.p_id=P.p_id and P.p_is_exist='1';";

				console.log(query);

				dbObject.fireQuery(query, function(err, pRows){
					if(err)
					{
						ejs.renderFile("./views/ListProducts.ejs", {message:"Error in fetching products",name: name,
							lastLogin: lastLogin, products: pRows}, function(err, res){
								if(err){
									console.log(err);
									response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
								}
								response.end(res);
							});
					}
					else
					{
						ejs.renderFile("./views/ListProducts.ejs", {message:"",name: name,
							lastLogin: lastLogin, products: pRows}, function(err, res){
								if(err){
									console.log(err);
									response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
								}
								response.end(res);
							});
					}
				});
			}
		};

		function listSpecificProduct(request, response){
			if (sessions === null || (request.session.email === null)) {
				response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
			} else {

				var	name = request.session.fname + " " + request.session.lname;
				var	lastLogin = request.session.lastlogin;
				var email=request.session.email;
				var id=request.param("productID");
				console.log("List product: "+id);
				request.session.productID=id;

				//Extract a product based on Product id.
				var query1="SELECT p_name, p_condition, p_details, p_cost, p_category, p_type, p_available_quantity, p_is_bidding, p_is_exist FROM ebay.product P where p_id='"+id+"' and p_is_exist='1';";
				console.log("First query: "+query1);

				dbObject.fireQuery(query1, function(err, pRows){

					tempProductInfo=JSON.parse(JSON.stringify(pRows));
					console.log("heheh");

					if(err)
					{
						ejs.renderFile("./views/UpdateItem.ejs", {message:"Error in fetching products",name: name,
							lastLogin: lastLogin, productInfo:"", categories:""}, function(err, res){
								if(err){
									console.log(err);
									response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
								}
								response.end(res);
							});
					}
					else
					{
						//check if categories object is already loaded
						console.log("Data: "+allcategories);
						if(allcategories==null)
						{
							//Sub query start here
							var query2="SELECT distinct p_category FROM ebay.product limit 35;";//replace limit 35, remove it
							console.log(query2);

							dbObject.fireQuery(query2, function(err, cRows){
								if(err)
								{
									ejs.renderFile("./views/UpdateItem.ejs", {message:"Error in fetching products", name: name,
										lastLogin: lastLogin, productInfo: "", categories:""}, function(err, res){
											if(err){
												console.log(err);
												response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
											}
											response.end(res);
										});
								}
								else
								{
									allcategories=JSON.parse(JSON.stringify(cRows));
									tempProductInfo=JSON.parse(JSON.stringify(pRows));

									console.log("Categories stored: "+allcategories);
									console.log("Product Info: "+tempProductInfo);

									ejs.renderFile("./views/UpdateItem.ejs", {message:"",name: name,
										lastLogin: lastLogin, productInfo: tempProductInfo, categories:allcategories}, function(err, res){
											if(err){
												console.log(err);
												response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
											}
											response.end(res);
										});
								}
							});
							//Sub query ends here
						}
						else
						{
							ejs.renderFile("./views/UpdateItem.ejs", {message:"",name: name,
								lastLogin: lastLogin, productInfo: pRows, categories:allcategories}, function(err, res){
									if(err){
										console.log(err);
										response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
									}
									response.end(res);
								});
						}

						//Set values in session to extract it on the browser
						/*
			request.session.productName=pRows[0].p_name;
			request.session.productCondition=pRows[0].p_condition;
			request.session.productDetails=pRows[0].p_details;
			request.session.productCost=pRows[0].p_cost;
			request.session.productAvailableQuantity=pRows[0].p_available_quantity;
			request.session.productIsBidding=pRows[0].p_is_bidding;
						 */
						console.log("Data1: "+allcategories);
						/*
			ejs.renderFile("./views/UpdateItem.ejs", {message:"",name: name,
					lastLogin: lastLogin, productInfo: pRows, categories:allcategories}, function(err, res){
				if(err)
					console.log(err);

				response.end(res);
			});
						 */
					}
				});
			}
		};

		exports.deleteSpecificProduct = function(request, response){

			if (sessions === null || (request.session.email === null)) {
				response.send("<script>{ if(!alert('Must logged in to perfom this function!!')) document.location = '/login';}</script>Must logged in to perfom this function!! Click to <a href='/login'>Not Logged In to eBay</a>!.");
			} else {
				var	name = request.session.fname + " " + request.session.lname;
				var	lastLogin = request.session.lastlogin;
				var email=request.session.email;

				var pID=request.param("productID");
				console.log("The " + pID + " is to be deleted.");

				var query="update product set p_is_exist='0' where p_ID='"+pID+"';";
				console.log(query);

				dbObject.fireQuery(query, function(err, pRows){
					if(err)
					{
						ejs.renderFile("./views/ListProducts.ejs", {message:"Error in deleting product", name: name,
							lastLogin: lastLogin,products:""}, function(err, res){
								if(err){
									console.log(err);
									response.send("<script>{ if(!alert('Server Busy Please Try Again After some time!!')) document.location = '/';}</script>Server Busy Please Try Again After some time!! <a href='/'>Redirecting to Home page!!</a>!.");
								}
								response.end(res);
							});
					}
					else
					{
						listProductsBySeller(request, response);
						/*
			ejs.renderFile("./views/ListProducts.ejs", {message:"Product removed successfully", products: allcategories}, function(err, res){
				if(err)
					console.log(err);

				response.end(res);
			});
						 */
					}

				});
			}
		};

		exports.listProductsBySeller = listProductsBySeller;
		exports.listSpecificProduct = listSpecificProduct;

//		=============================================================================================================================================================================

//		=============================================================================================================================================================================

		exports.product_summary = function(req, res) {
			res.render('product_summary', {
				title: 'Ebay'
			});
		};

		exports.products = function(req, res) {
			res.render('products', {
				title: 'Ebay'
			});
		};

		exports.register = function(req, res) {
			res.render('register', {
				title: 'Ebay'
			});
		};


		exports.sellItem = function(req, res) {
			res.render('SellItem', {
				title: 'Ebay'
			});
		};


		exports.login = function(req, res) {
			res.render('login', {
				title: 'Ebay'
			});
		};
		exports.adminHome = function(req, res) {
			res.render('login', {
				title: 'Ebay'
			});
		};


//-----------Validation-------------------------------------------------------		
		

		function isValidSSN(value) {
			var re = /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/;
			if (!re.test(value)) {
				return false;
			}
			var temp = value;
			if (value.indexOf("-") != -1) {
				temp = (value.split("-")).join("");
			}
			if (value.indexOf(" ") != -1) {
				temp = (value.split(" ")).join("");
			}
			if (temp.substring(0, 3) == "000") {
				return false;
			}
			if (temp.substring(3, 5) == "00") {
				return false;
			}
			if (temp.substring(5, 9) == "0000") {
				return false;
			}
			return true;
		};
		
		
		function validateEmail(email) { 
			console.log("Validate Integer: true");
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			//var re = /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/
			return re.test(email);
		}; 


		function isPhoneNumber(inputtxt)  
		{  
			var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;  
			if(inputtxt.value.match(phoneno))
					{  
				return true;  
					}  
			else  
			{  
				alert("message");  
				return false;  
			}  
		};  
		
		
		function isZip(zip){
			var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
			return isValidZip;
		};
		
		
		function isValidPassword(password){
			//var validPassword = /(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$)/.test(password);
			var validPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password);
			///^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
			return validPassword;
		};
		
	//-----------------------Validations end	
