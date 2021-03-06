const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true
  },
  slug: String,
  reference: String,
  type: {
    type: String,
    required: true,
    enum: ['Apartment', 'House', 'Room', 'Land', 'Commercial Property']
  },
  toRent: {
    type: Boolean,
    default: true
  },
  toSell: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  tenantFees: String,
  furnished: {
    type: Boolean,
    default: true
  },
  garage: {
    type: Boolean,
    default: false
  },
  parking: {
    type: Boolean,
    default: false
  },
  garden: {
    type: Boolean,
    default: false
  },
  balcony: {
    type: Boolean,
    default: false
  },
  shower: {
    type: Boolean,
    default: false
  },
  washmachine: {
    type: Boolean,
    default: false
  },
  dishwasher: {
    type: Boolean,
    default: false
  },
  burglarAlarm: {
    type: Boolean,
    default: false
  },
  petsAllowed: {
    type: Boolean,
    default: false
  },
  smokersAllowed: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    required: [true, 'Please add the address']
  },
  availableDate: {
    type: Date,
    default: Date.now
  },
  location: {
    // GeoJson Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formatedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create property slug from name
PropertySchema.pre('save', function (next) {
  this.slug = slugify(this.title, {
    lower: true
  });
  next();
});

// Geocode and create location field
PropertySchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };
  // Do not save address in db
  this.address = undefined;
  next();
});

module.exports = mongoose.model('Property', PropertySchema);
