const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: false, // Make it optional, we'll generate it
      unique: true,
      sparse: true, // Allows multiple nulls but unique for non-null
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [10, "Content must be at least 10 characters long"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["cs", "alumni", "club", "campus", "events"],
        message: "Category must be one of: cs, alumni, club, campus, events",
      },
      default: "cs",
    },
    clubName: {
      type: String,
      enum: {
        values: [
          "disha-club",
          "aarogyam-club",
          "soorma-club",
          "sambhavna-club",
          "jigyasa-club",
          "kriti-club",
          "sanskriti-club",
          "udyam-club",
          "rakshak-club",
          "srijan-shilpi",
          "seva-club",
        ],
        message: "Invalid club name",
      },
      required: function () {
        return this.category === "club";
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        caption: String,
      },
    ],
    author: {
      type: String,
      required: [true, "Author is required"],
      default: "CS Department",
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    eventDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Improved slug generation
newsSchema.pre("save", function (next) {
  if (this.isModified("title") && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
      .substring(0, 100); // Limit length

    // Ensure slug is not empty
    if (!this.slug) {
      this.slug = `news-${Date.now()}`;
    }
  }

  // Set publishedAt if publishing
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Add index for better performance
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ clubName: 1 });

module.exports = mongoose.model("News", newsSchema);
