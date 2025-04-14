// controllers/bookController.js
const Book = require('../modals/BookSchema'); // Assuming you have a Book model defined in models/Book.js
const cloudinary = require('cloudinary').v2
// Create a new book post
const createPost = async (req, res) => {
  try {
    const { title, img, rating, shortDescription } = req.body;

    if (!title || !img || !shortDescription) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const uploadedImage = await cloudinary.uploader.upload(img, {
      folder: "avatars",
      format: "webp",
      quality: 80,
      width: 150,
      crop: "scale",
    });

    const newBook = new Book({
      userId: req.user._id, // Ensure your middleware adds req.user
      title,
      img: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      },
      rating,
      shortDescription,
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book: newBook,
    });
  } catch (error) {
    console.error("Book creation error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message,
    });
  }
};


// Delete a book post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this book' });
    }

    await book.deleteOne();
    res.status(200).json({ success: true, message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete book', error: error.message });
  }
};

// Get all books
const getAllPost = async (req, res) => {
  try {
   
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    

    const books = await Book.find()
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 }) // optional: newest first
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();

    res.status(200).json({ 
      success: true, 
      books, 
      currentPage: page, 
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get books', error: error.message });
  }
};


// Get all books by a specific user
const getAllPostOfUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const books = await Book.find({ userId });
    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user books', error: error.message });
  }
};

module.exports = {
  createPost,
  deletePost,
  getAllPost,
  getAllPostOfUser
};
