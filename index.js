'use strict';

const express = require('express')
const app = express()
var request = require('request');
var Highcharts = require('highcharts');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// in latest body-parser use like below.
app.set('view engine', 'pug')

// require('highcharts/modules/exporting')(Highcharts);

var url = 'https://data.marincounty.org/resource/mw3d-ud6d.json';

var myLogger = function (req, res, next) {
        next();
}

var requestTime = function (req, res, next) {
	req.requestTime = Date.now()
	next()
}

function getData (data, month, year) 
{
    var department_info = {};

    data.forEach(function(hist_data)
    {
        var date_info = hist_data["month_and_year"]
        var date = new Date(date_info);

        if (date.getMonth() == month && date.getFullYear() == year)
        {
            if (department_info[hist_data['department']])
            {
                department_info[hist_data['department']] += parseInt(hist_data['amount'])
            } else 
            {
                department_info[hist_data['department']] = parseInt(hist_data['amount'])
            }
        }
    });
    return department_info;
}

app.use(requestTime)
app.use(myLogger)


app.get('/date', function (req, res) {
	// res.send(responseText)
    request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
    }, (err, res2, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res2.statusCode !== 200) {
          console.log('Status:', res2.statusCode);
        } else {
          // data is already parsed as JSON:
        }
        //do the calculation to return sum value of one department with one time
         var data_output = getData(data,3, 2017);
         var array = [];
         array.push(data_output);

        //uses the templating engine pug to display information
        let colors = ["Red", "Green", "Blue"];
        let langs  = ["HTML", "CSS", "JS"];
        let title  = "My Cool Website";

        let locals = {
            title:      title,
            title: 'Hey',
            data_output: JSON.stringify(data_output),
        };
        res.render('index', locals );
    });
	
})

app.post('/date', function (req, res) {
  var body_info = req.body
  var date = new Date(body_info['month'])
  var month = date.getMonth()
  var year = date.getFullYear()
  console.log(body_info)
  console.log(month)
  console.log(year)

    request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
    }, (err, res2, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res2.statusCode !== 200) {
          console.log('Status:', res2.statusCode);
        } else {
     
        }
         var data_output = getData(data, month, year);
         console.log(data_output)
         var array = [];
         array.push(data_output);
        let title  = "My Cool Website";

        let locals = {
            title:      title,
            data_output: JSON.stringify(data_output)
        };
        res.render('index', locals );
    });     
})


app.listen(3000)

