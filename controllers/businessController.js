const catchAsync = require('../utils/catchAsync');
const Business = require('../models/businessModel');

const filter = {
  name: 1,
  address: 1,
  city: 1,
  state: 1,
  postal_code: 1,
  stars: 1,
  review_count: 1,
  categories: 1,
};

exports.initModify = catchAsync(async (req, res, next) => {
  await Business.updateMany({}, [
    {
      $set: {
        location: { type: 'Point', coordinates: ['$longitude', '$latitude'] },
      },
    },
    { $unset: ['latitude', 'longitude'] },
  ]);

  res.status(200).json({
    status: 'success',
  });
});

exports.getBusiness = catchAsync(async (req, res, next) => {
  const business = await Business.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      business,
    },
  });
});

exports.getBusinessesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitur and longitude in the format lat,lng',
        400
      )
    );
  }

  const businesses = await Business.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  }).limit(20);

  res.status(200).json({
    status: 'success',
    results: businesses.length,
    data: {
      data: businesses,
    },
  });
});

exports.getTopBusinessesBy = catchAsync(async (req, res, next) => {
  let { category } = req.params;
  category = category.split(',');
  let regexQueries = [];
  category.map((el) => regexQueries.push({ categories: { $regex: el } }));
  const businesses = await Business.find(
    {
      $and: regexQueries,
    },
    filter
  )
    .limit(20)
    .sort('-stars -review_count');

  res.status(200).json({
    status: 'success',
    results: businesses.length,
    data: {
      data: businesses,
    },
  });
});

exports.advancedFiltering = catchAsync(async (req, res, next) => {
  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const businesses = await Business.find(JSON.parse(queryStr), filter).limit(
    20
  );

  res.status(200).json({
    status: 'success',
    results: businesses.length,
    data: {
      data: businesses,
    },
  });
});
