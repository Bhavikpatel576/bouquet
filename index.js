'use strict';

const express = require('express');
const app = express();
var path = require('path');
var favicon = require('serve-favicon');
var request = require('request');
var Highcharts = require('highcharts');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

var url = 'https://data.marincounty.org/resource/mw3d-ud6d.json';

function getData(json, month, year) {
  var hash;
  var monthly_spend_department = [];
  var department_spend = [];
  hash = getHashData(json, month, year)

  for (var key in hash){
    monthly_spend_department.push([key, hash[key]]);
  }
  return monthly_spend_department;
}

function getHashData (data, month, year) 
{
  var department_info = {};
  data.forEach(function(hist_data)
  {
    var date_info = hist_data["month_and_year"]
    var date = new Date(date_info);
    if (date.getMonth() == month && date.getFullYear() == year){
        if (department_info[hist_data['department']]){
            department_info[hist_data['department']] += parseInt(hist_data['amount'])
        } else {
            department_info[hist_data['department']] = parseInt(hist_data['amount'])
        }
    }
  });

  return department_info;
}

function getMinMaxDate(data)
{
  var date_info = {
    minDate: new Date(),
    maxDate: null
  };

  data.forEach(function(hist_data)
  {
    var date_item = hist_data["month_and_year"]
    var date = new Date(date_item);
    if (date_info.minDate > date) {
      date_info.minDate = date;
    };
    if (date_info.maxDate < date){
      date_info.maxDate = date;
    }
  });

  return date_info;
}

app.get('/', function (req, res) {
    request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
    }, (err, res2, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res2.statusCode !== 200) {
          console.log('Status:', res2.statusCode);
        };
        var jsonDateInfo = getMinMaxDate(data);
        var startMonth = jsonDateInfo.minDate.getMonth();
        var startYear = jsonDateInfo.minDate.getFullYear();
        var data_output = getData(data, startMonth, startYear);
        let locals = {
            title: 'Bouquet.ai Graph',
            data_output1: JSON.stringify(data_output),
            jsonDateInfo: jsonDateInfo,
            month: startMonth,
            year: startYear
        };
      res.render('index', locals );
    });
})

app.post('/', function (req, res) {
    var body_info = req.body
    var date = new Date(body_info['month'].substr(3,6),body_info['month'].substr(0,2))
    var month = date.getMonth() == 0 ? date.getMonth() + 11 : date.getMonth() - 1
    var year = month == 11 ? date.getFullYear() - 1 : date.getFullYear()

    request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
    }, (err, res2, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res2.statusCode !== 200) {
          console.log('Status:', res2.statusCode);
        };
        var data_output = getData(data, month, year);
        var jsonDateInfo = getMinMaxDate(data);
        let locals = {
            title: 'Bouquet.ai Graph',
            data_output1: JSON.stringify(data_output),
            month: month,
            year: year,
            jsonDateInfo: jsonDateInfo
        };
      res.render('index', locals );
    });     
})

app.listen((process.env.PORT || 5000), function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Server up and running');
});
