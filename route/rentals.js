const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateout");
  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customerId");

  const movie = await Movie.findById(req.body.movieId);
    // console.log("Movie not found:", req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movieId");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  rental = await rental.save();

// Remember that the code below reduces the numbers of movie in stock 
  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      customer: req.body.customer,
      movie: req.body.movie,
      dateOut: req.body.dateOut,
      dateReturned: req.body.dateReturned,
      rentalFee: req.body.rentalFee,
    },
    {
      new: true,
    }
  );

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

// Delete a rental 
router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

// Get a rental 
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

// Remember to practice on the other way of catching error 

module.exports = router;
