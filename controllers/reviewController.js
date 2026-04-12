h
  import Review from "../models/Review.js";

// @desc    Get reviews for a movie
// @route   GET /movies/:id/reviews
export const getReviewsByMovieId = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id });
    res.json(reviews);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review for a movie
// @route   POST /movies/:id/reviews
export const createReview = async (req, res) => {
  const { user, content, rating } = req.body;
  const movieId = req.params.id;
  try {
    const review = new Review({
      movieId,
      user,
      content,
      rating,
    });
    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /reviews/:id
export const updateReview = async (req, res) => {
  const { user, content, rating } = req.body;
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      review.user = user || review.user;
      review.content = content || review.content;
      review.rating = rating || review.rating;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await review.deleteOne();
      res.json({ message: "Review removed" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
