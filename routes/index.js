const express = require('express');
const router = express.Router();
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

/*artist-search*/
router.get(`/artist-search`, (req, res, next) => {
// console.log(req.query.buscador)

spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    // console.log('Contenido images', data.body.artists.items[0].images[0].url);

    res.render("artist-search-results.hbs", {
        search: req.query.search,
        artists: data.body.artists.items,
        
    })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
   

  })


  module.exports = router;