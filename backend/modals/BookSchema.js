// models/Book.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    img: {
      public_id: {
          type: String,
      },
      url: {
          type: String,
      }
  },
    rating: {
      type: Number,
      default: 0
    },
    shortDescription: {
      type: String
    }
  },
  {
    timestamps: true // this automatically adds createdAt and updatedAt
  }
);

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;
