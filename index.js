'use strict';

const express = require('express')
const app = express()
var request = require('request');
var Highcharts = require('highcharts');
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


app.get('/', function (req, res) {
	var responseText = 'Hello You Crazy World!<br>'
	responseText += '<small>Requested at: ' + req.requestTime + '</small>'

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
        
         var data_output = getData(data,6, 2016);
         var array = [];
         array.push(data_output);
         console.log(data_output);
         console.log(array);

        //uses the templating engine pug to display information
        res.render('index', { title: 'Hey', message: 'Hello there!', message2:responseText, data_output: data_output, data_output2: array });
    });
	
})



app.listen(3000)

