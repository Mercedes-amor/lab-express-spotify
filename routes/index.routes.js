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

/*GET artist-search page*/
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

/*GET albums page*/
router.get(`/albums/:artistId`, (req, res,next) =>{
  console.log(req.params.artistId)

  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        console.log('Artist albums', data.body);
        res.render("albums.hbs", {
          artist: req.params.artistId,
          albumsCollection: data.body.items   
        })
      })     
    .catch((err) => {
        next(err);
      })
})

/*GET tracks page*/

router.get(`/tracks/:albumId`, (req, res, next) => {
  console.log(req.params.albumId)
  
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
    .then(data => {
      console.log('Tracks of de Album: ', data.body.items);

      res.render("tracks.hbs", {
          albumId: req.params.albumId,
          tracksCollection: data.body.items,         
      })
    })
    .catch((err) => {
      next(err);
    })  
})


  module.exports = router;