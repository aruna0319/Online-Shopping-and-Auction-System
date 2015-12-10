var poolObject=require('ConnectionPool');

function fireQuery(query, callback)
{
	var connection = poolObject.getConnection();

	connection.query(query, function(err, pRows){
		if(err){
			console.log(err);
		}
		else{
			console.log("Operation completed successfully!");
		}
		//console.log(pRows+ ", length: "+ pRows.length);
		
		callback(err, pRows);
	});

	poolObject.returnConnection(connection);
}

exports.fireQuery=fireQuery;


function fetchTime(callback){
var currentdate = new Date();
var datetime = "" + currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
console.log(datetime);
callback(datetime);

}
exports.fetchTime=fetchTime;