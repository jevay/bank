var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
var mocha = require('mocha')
var describe = mocha.describe
var should = chai.should();
var axios = require('axios');
chai.use(chaiHttp);

describe('bank', function(){
	it('should create the user account on /create POST with the bank_country_code as US.', function(done){
		data = {
					"payment_method": "SWIFT",
					"bank_country_code": "US",
					"account_name": "RONADO",
					"account_number": "12345678",
					"swift_code": "ICBCUSBJ",
					"aba": "11122233A"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.statusText.should.eql('OK');
				res.data.should.eql({success: 'Bank details saved'});
			})
			.catch((err) => {
				console.log(err);
			});

		done();
	});

	it('should get the user account for the user: RONADO.', function(done){
		data = {"account_name": "RONADO"}
		axios.get('http://localhost:3000/bank/get', {params:data})
			.then((res) => {
				res.should.have.status(200);
				res.statusText.should.eql('OK');
				res.data.should.eql({"payment_method":"SWIFT","bank_country_code":"US","account_name":"RONADO","account_number":"12345678","swift_code":"ICBCUSBJ"});
			})
			.catch((err) => {
				console.log(err);
			});

		done();
	});

	it('should create the user account on /create POST with the bank_country_code as AU.', function(done){
		data = {
					"payment_method": "LOCAL",
					"bank_country_code": "AU",
					"account_name": "Messi",
					"account_number": "12345678",
					"swift_code": "ICBCAUBJ",
					"bsb": "111BSB"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.statusText.should.eql('OK');
				res.data.should.eql({success: 'Bank details saved'});
			})
			.catch((err) => {
				console.log(err);
			});

		done();
	});

	it('should create the user account on /create POST with the bank_country_code as CN.', function(done){
		data = {
					"payment_method": "LOCAL",
					"bank_country_code": "CN",
					"account_name": "Jevayliu",
					"account_number": "1234567890",
					"swift_code": "ICBCCNBJ"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.statusText.should.eql('OK');
				res.data.should.eql({success: 'Bank details saved'});
			})
			.catch((err) => {
				console.log(err);
			});

		done();
	});

	it('should throw account_number error when bank_country_code is CN on /create POST', function(done){
		data = {
					"payment_method": "LOCAL",
					"bank_country_code": "CN",
					"account_name": "Jevayliu000",
					"account_number": "12345",
					"swift_code": "ICBCCNBJ"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
			})
			.catch((err) => {
				err.response.should.have.status(400);
				err.response.statusText.should.eql('Bad Request');
				err.response.data.should.eql("account_number error when bank_country_code is 'CN': length of account_name should be 8-20 character long, can be any character.");
				console.log(err.response.data);
			});

		done();
	});

	it('should check the payment_method when create the user account on /create POST', function(done){
		data = {
					"payment_method": "TEST",
					"bank_country_code": "US",
					"account_name": "RONADO",
					"account_number": "12345678",
					"swift_code": "ICBCUSBJ",
					"aba": "11122233A"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
			})
			.catch((err) => {
				err.response.should.have.status(400);
				err.response.statusText.should.eql('Bad Request');
				err.response.data.should.eql('The payment method should be LOCAL or SWIFT, please check your payment method.');
				console.log(err.response.data);
			});

		done();
	});

	it('should check the account_name length when create the user account on /create POST', function(done){
		data = {
					"payment_method": "SWIFT",
					"bank_country_code": "US",
					"account_name": "RONADOTESTING",
					"account_number": "123",
					"swift_code": "ICBCUSBJ",
					"aba": "11122233A"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
			})
			.catch((err) => {
				err.response.should.have.status(400);
				err.response.statusText.should.eql('Bad Request');
				err.response.data.should.eql('account name error: length of account_name should be from 2 to 10.');
			});

		done();
	});

	it('should check the account_number length when create the user account on /create POST', function(done){
		data = {
					"payment_method": "SWIFT",
					"bank_country_code": "US",
					"account_name": "RONADO",
					"account_number": "1213131513544464464531312131313135421",
					"swift_code": "ICBCUSBJ",
					"aba": "11122233A"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
			})
			.catch((err) => {
				err.response.should.have.status(400);
				err.response.statusText.should.eql('Bad Request');
				err.response.data.should.eql('account_number length error: Length of account_number should be 1-17 character long, can be any character.');
				console.log(err.response.data);
			});

		done();
	});

	it('should check the account_number error with bank_country_code is AU when create the user account on /create POST', function(done){
		data = {
					"payment_method": "LOCAL",
					"bank_country_code": "AU",
					"account_name": "Messi",
					"account_number": "12345",
					"swift_code": "ICBCAUBJ",
					"bsb": "111BSB"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
			})
			.catch((err) => {
				err.response.should.have.status(400);
				err.response.statusText.should.eql('Bad Request');
				err.response.data.should.eql("account_number error when bank_country_code is 'AU': length of account_name should be 6-9 character long, can be any character.");
				console.log(err.response.data);
			});

		done();
	});

	it('should check the account_number error with bank_country_code is CN when create the user account on /create POST', function(done){
		data = {
					"payment_method": "LOCAL",
					"bank_country_code": "CN",
					"account_name": "Jevayliu",
					"account_number": "12345",
					"swift_code": "ICBCCNBJ"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
			})
			.catch((err) => {
				err.response.should.have.status(400);
				err.response.statusText.should.eql('Bad Request');
				err.response.data.should.eql("account_number error when bank_country_code is 'CN': length of account_name should be 8-20 character long, can be any character.");
				console.log(err.response.data);
			});

		done();
	});

	it('should check wrong swift code with bank_country_code is CN when create the user account on /create POST', function(done){
		data = {
					"payment_method": "LOCAL",
					"bank_country_code": "CN",
					"account_name": "Jevayliu",
					"account_number": "123456789",
					"swift_code": "ICBCDNBJ"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
			})
			.catch((err) => {
				err.response.should.have.status(400);
				err.response.statusText.should.eql('Bad Request');
				err.response.data.should.eql("wrong swift code: The swift code is not valid for the given bank country code: CN");
				console.log(err.response.data);
			});

		done();
	});

	it('should check wrong swift code length error with bank_country_code is CN when create the user account on /create POST', function(done){
		data = {
					"payment_method": "LOCAL",
					"bank_country_code": "CN",
					"account_name": "Jevayliu",
					"account_number": "123456789",
					"swift_code": "ICBCCNBJDFAUKADFLJL"
				}
		axios.post('http://localhost:3000/bank/create', data)
			.then((res) => {
			})
			.catch((err) => {
				err.response.should.have.status(400);
				err.response.statusText.should.eql('Bad Request');
				err.response.data.should.eql("swift code length error: Length of 'swift_code' should be either 8 or 11.");
				console.log(err.response.data);
			});

		done();
	});
});