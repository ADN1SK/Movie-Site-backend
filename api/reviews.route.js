import express from "express";
import ReviewCtrl from "./reviews.controller.js";

const router = express.Router();

router.route("/movie/:id").get(ReviewCtrl.apiGetReviews);
router.route("/new").post(ReviewCtrl.apiPostReview);
router
  .route("/:id")
  .get(ReviewCtrl.apiGetReview)
  .put(ReviewCtrl.apiUpdateReview)
  .delete(ReviewCtrl.apiDeleteReview);

export default router;
//this comment is for all of u mfs

