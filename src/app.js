const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000

//Define paths for express config
const viewsPath = path.join(__dirname, '../templates/views')
const publicDirectoryPath = path.join(__dirname, '../public')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Mariana'
    })
})
 
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Mariana'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Mariana'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mariana',
        message: 'Article for help not found'
    })
})

app.get('/weather', (req, resp) => {
    if(!req.query.address){
        return resp.send({
            error: "Please, you must provide an  address"
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {

        if(error){
          return error
        } 
        
        forecast(latitude, longitude, (error, forecastData) => {
           if(error) {
              return error
           }

           resp.send({
           location: location,
           forecast: forecastData
        })
          
        }) 
     })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mariana',
        message: 'Page not found'
    })
})


app.listen(port, () =>{
    console.log('Running')
})