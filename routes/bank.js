const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
var express = require('express');
var router = express.Router();

/**
Get the bank information according to the account name.
**/
router.get('/get', function(req, res, next){
	an = req.query.account_name;

	const adapter = new FileSync('users_account.json');
	const db = low(adapter);
	response_data = db.get('users').find({account_name: an}).value();

	console.log(response_data);

	res.status(200).end(JSON.stringify(response_data));
});

/**
Create the user account information and store it in the lowDB.
**/
router.post('/create', function(req, res, next){
	payment_method_list = ['LOCAL', 'SWIFT'];
	bank_country_code_list = ['US', 'AU', 'CN'];

	pm = req.body.payment_method;
	if(payment_method_list.indexOf(pm) == -1){
		res.status(400).end('The payment method should be LOCAL or SWIFT, please check your payment method.');
		return;
	}

	an = req.body.account_number;
	if (!an) {
		res.status(400).end("'account_number' is required.");
		return;
	}

	bcc = req.body.bank_country_code;
	if(bank_country_code_list.indexOf(bcc) == -1){
		res.status(400).end('The bank country code can be one of US, AU, CN, please check it.');
		return;
	}

	if (bcc == 'US') {
		if (an.length > 17) {
			res.status(400).end("account_number length error: Length of account_number should be 1-17 character long, can be any character.");
			return;
		}
		
		aba = req.body.aba;
		if (aba === undefined || aba == null || aba == "") {
			res.status(400).end("aba is required when bank_country_code is US.");
			return;
		}else if (aba.length != 9) {
			res.status(400).end("the aba length should be 9.");
			return;
		}
	}

	if (bcc == 'AU') {
		if (!(an.length >=6 && an.length<=9)) {
			res.status(400).end("account_number error when bank_country_code is 'AU': length of account_name should be 6-9 character long, can be any character.");
			return;
		}
		
		bsb = req.body.bsb;
		if (bsb === undefined || bsb == null || bsb == "") {
			res.status(400).end("bsb is required when bank_country_code is AU.");
			return;
		}else if (bsb.length != 6) {
			res.status(400).end("the bsb length should be 6.");
			return;
		}
	}

	if (bcc == 'CN') {
		if (!(an.length >=8 && an.length<=20)) {
			res.status(400).end("account_number error when bank_country_code is 'CN': length of account_name should be 8-20 character long, can be any character.");
			return;
		}
	}

	acname = req.body.account_name;
	if (acname.length<2 || acname.length >10) {
		res.status(400).end("account name error: length of account_name should be from 2 to 10.");
		return;
	}

	sc = req.body.swift_code;
	if (pm == 'SWIFT') {
		if (!sc) {
			res.status(400).end("'swift_code' is required.");
			return;
		}
	}

	if (sc != undefined && sc != null && sc != "") {
		if (sc.substring(4,6) != bcc) {
			res.status(400).end("wrong swift code: The swift code is not valid for the given bank country code: "+bcc);
			return;
		}

		if (sc.length != 8 && sc.length != 11) {
			res.status(400).end("swift code length error: Length of 'swift_code' should be either 8 or 11.");
			return;
		}
	}
	
	response = {
		payment_method: pm,
		bank_country_code: bcc,
		account_name: acname,
		account_number: an,
		swift_code: sc
	};

	const adapter = new FileSync('users_account.json');
	const db = low(adapter);
	db.defaults({users:[]}).write();
	db.get('users').push(response).write();

	res.status(200).json({"success": "Bank details saved"})
});

module.exports = router;
