import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    user: { type: String, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true },
);

const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema, "reviews");

export default class ReviewsDAO {
  static async addReview(movieId, user, review) {
    try {
      return await Review.create({ movieId, user, review });
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async getReviews(movieId) {
    try {
      return await Review.find({ movieId }).sort({ createdAt: -1 }).lean();
    } catch (e) {
      console.error(`Unable to get reviews: ${e}`);
      return { error: e };
    }
  }

  static async getReview(reviewId) {
    try {
      return await Review.findById(reviewId).lean();
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return { error: e };
    }
  }

  static async updateReview(reviewId, user, review) {
    try {
      const update = {};
      if (user !== undefined) update.user = user;
      if (review !== undefined) update.review = review;

      return await Review.updateOne(
        { _id: reviewId },
        { $set: update },
        { runValidators: true },
      );
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId) {
    try {
      return await Review.deleteOne({ _id: reviewId });
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
}
