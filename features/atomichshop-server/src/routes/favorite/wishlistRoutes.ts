import express from "express";
import { wishlistController } from "../../controller/favorite/wishlistController";

const router = express.Router();

router.get("/:customerId", wishlistController.getWishlist);
router.post("/add", wishlistController.addToWishlist);
router.delete("/remove", wishlistController.removeFromWishlist);

export default router;