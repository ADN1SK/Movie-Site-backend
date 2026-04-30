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
  const { content, rating } = req.body;
  const movieId = req.params.id;
  try {
    const review = new Review({
      movieId,
      user: req.user._id,
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
  const { content, rating } = req.body;
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      // Check if the logged-in user is the owner of the review
      if (review.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this review" });
      }
      review.content = content !== undefined ? content : review.content;
      review.rating = rating !== undefined ? rating : review.rating;
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
      // Check if the logged-in user is the owner of the review
      if (review.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this review" });
      }
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
