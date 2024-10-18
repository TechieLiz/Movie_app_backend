const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();


// uses Movie model to find all movie
router.get("/", async (req, res) => {
  const movie = await Movie.find().sort("name");
  res.send(movie);
});

router.post("/",  [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genreId");

  let movie = new Movie({
    title: req.body.title,
    genre: req.body.movie,
    numberInStock: req.body.dateOut,
    dailyRentalRate: req.body.dateReturned,
  });
  movie = await movie.save();
  res.send(movie);
});


// UPDATE A Movie. update is mostly a put request 

router.put("/:id",  [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    {
      new: true,
    }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

// Delete a movie 

router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

// Get a single movie by ID 

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
