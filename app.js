var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ethers = require('ethers');
var multisigAccountAbi = require('./mulsitig-account-ABI.json');

const provider = new ethers.providers.JsonRpcProvider('http://weg.eu.ngrok.io');
const signer = provider.getSigner();

console.log(provider, signer);

function proposeExecution() {
  const multisigAccountContract = new ethers.Contract('0x01af1661cC70f488A9df0E1D8522426f40f780DD', multisigAccountAbi, signer);
  const iface = new ethers.utils.Interface(['function transfer(address to, uint amount) payable']);
  const encodedFunctionData = iface.encodeFunctionData('transfer', ['0x0478B8f728dE3001B910177b6a238B51604B630a', 1]);
  
  const params = ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], ['0x0478B8f728dE3001B910177b6a238B51604B630a', 2]);
  multisigAccountContract.proposeExecution("0xcF2B005c0719D598ab171d86063FdfAA919a31f1", 'transfer(address, uint256)', params)
  .then(res => {
    console.log('success', res);
  })
  .catch(err => {
    console.log(err);
  });
}

proposeExecution();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
