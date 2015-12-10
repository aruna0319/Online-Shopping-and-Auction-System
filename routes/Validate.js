var moment=require('moment');

function validateInteger(value)
{
	var re= /^[0-9]+$/;
	
	if(re.test(value))
	{
		console.log("Validate Integer: true");
		return true;
	}
	else
	{
		console.log("Validate Integer: false");
		return false;
	}
}

function validateNumber(value)
{	
	var re=/^\d*\.?\d*$/;
	
	if(re.test(value))
	{
		console.log("Validate Number: true");
		return true;
	}
	else
	{
		console.log("Validate Number: false");
		return false;
	}
}

function isValidSSN(value)
{ 
	var re = /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/; 
	//var re= /^[0-9]+$/;
	if (!re.test(value)) { return false; } 
	var temp=value;
	if (value.indexOf("-")!=-1) { temp=(value.split("-")).join("");}
	if (value.indexOf(" ")!=-1) { temp=(value.split(" ")).join("");}
	if (temp.substring(0, 3)=="000") { return false; }
	if (temp.substring(3, 5)=="00") { return false; }
	if (temp.substring(5, 9)=="0000") { return false; } 
	return true;
}

function validateDate(value)
{
	console.log(value);
	var now=moment(new Date());
	var currentDate=now.format('YYYYMMDD');
	var userDate=value.substring(0, 4)+value.substring(5, 7)+value.substring(8, 10);
	console.log(currentDate);
	console.log(userDate);
	if(userDate<currentDate)
	{
		console.log("false");
		return false;
	}
	else
	{
		console.log("true");
		return true;
	}
}
function validateEmail(email) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}; 
function isZip(zip){
	var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
	return isValidZip;
};
function isValidPassword(password){
	var validPassword = /(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$)/.test(password);
	return validPassword;
};
exports.validateEmail=validateEmail;
exports.isValidSSN=isValidSSN;
exports.isValidPassword=isValidPassword;
exports.isZip=isZip;
exports.validateNumber=validateNumber;
exports.validateInteger=validateInteger;
exports.validateDate=validateDate;