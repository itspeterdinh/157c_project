const express = require('express');
const businessController = require('../controllers/businessController');
const router = express.Router();

router.route('/:id').get(businessController.getBusiness);
router
  .route('/businesses-within/:distance/center/:latlng/unit/:unit')
  .get(businessController.getBusinessesWithin);

router
  .route('/top-business/:category')
  .get(businessController.getTopBusinessesBy);

router.route('/').get(businessController.advancedFiltering);

router.route('/modify').patch(businessController.initModify);

module.exports = router;
