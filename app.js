require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const bodyParser = require('body-parser')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search-results',(req,res)=> {
    console.log('artist-search-results route was created')
})

app.get('/albums', (req,res) => {
  console.log('albums route was created')
})


app.get('/artist-search', (req, res, next) => {
    console.log(req.query.artname) // --> { artname: 'placebo' } if in the form I type "placebo" and submit the form
    spotifyApi
  .searchArtists(req.query.artname)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    console.log('One of the items of the data: ', data.body.artists.items[0]);
    let artists = data.body.artists.items
    console.log('sending data to artist-search results')
    res.render('artist-search-results',{ artists }  )     

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


 app.get('/albums/:id', (req, res, next) => {
            // .getArtistAlbums() code goes here
            console.log(req.params.id)
            let id = req.params.id;
            spotifyApi
            .getArtistAlbums(id)
              .then(data => {
              console.log('The received data from the API: ', data.body);
              // console.log('The received data from the API: ', data.body.images);
              // console.log('One of the items of the data: ', data.body.artists.items[0])});
              let items = data.body.items;
              //! Why can I pass images to albums.hbs ????
              console.log(items)
               res.render('albums', { items} )
            })
           .catch(err => console.log('The error while searching albums occurred: ', err))
          })


app.listen(3000, () => console.log('My Spotify project running on port 3000'));