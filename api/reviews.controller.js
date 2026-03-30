import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  static async apiPostReview(req, res) {
    try {
      const { movieId, movieid, user, review } = req.body;
      const targetMovieId = movieId || movieid;

      if (!targetMovieId || !user || !review) {
        return res
          .status(400)
          .json({ error: "movieId, user and review are required" });
      }

      const reviewResponse = await ReviewsDAO.addReview(
        targetMovieId,
        user,
        review,
      );

      if (reviewResponse?.error) {
        return res.status(500).json({ error: reviewResponse.error.message });
      }

      res.json({ status: "success", id: reviewResponse?._id });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReviews(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "movie id is required" });
      }

      const reviews = await ReviewsDAO.getReviews(id);

      if (reviews?.error) {
        return res.status(500).json({ error: reviews.error.message });
      }

      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ error: "Not found" });
      }

      res.json(reviews);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReview(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "review id is required" });
      }

      const review = await ReviewsDAO.getReview(id);

      if (review?.error) {
        return res.status(500).json({ error: review.error.message });
      }

      if (!review) {
        return res.status(404).json({ error: "Not found" });
      }

      res.json(review);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res) {
    try {
      const reviewId = req.params.id;
      const { review, user } = req.body;

      if (!reviewId) {
        return res.status(400).json({ error: "review id is required" });
      }

      if (!review && !user) {
        return res
          .status(400)
          .json({ error: "Provide at least one field to update" });
      }

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        user,
        review,
      );

      if (reviewResponse?.error) {
        return res.status(500).json({ error: reviewResponse.error.message });
      }

      if (reviewResponse.matchedCount === 0) {
        return res.status(404).json({ error: "Review not found" });
      }

      if (reviewResponse.modifiedCount === 0) {
        return res.status(400).json({ error: "No changes were applied" });
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res) {
    try {
      const reviewId = req.params.id;
      if (!reviewId) {
        return res.status(400).json({ error: "review id is required" });
      }

      const reviewResponse = await ReviewsDAO.deleteReview(reviewId);

      if (reviewResponse?.error) {
        return res.status(500).json({ error: reviewResponse.error.message });
      }

      if (reviewResponse.deletedCount === 0) {
        return res.status(404).json({ error: "Review not found" });
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
