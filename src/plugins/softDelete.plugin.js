const softDeletePlugin = (schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  // Add methods without directly modifying schema.methods
  const softDelete = async function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  const restore = async function() {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };

  schema.methods.softDelete = softDelete;
  schema.methods.restore = restore;

  // Add static methods for finding with deleted
  schema.statics.findDeleted = function() {
    return this.find({ isDeleted: true });
  };

  schema.statics.findWithDeleted = function() {
    return this.find({});
  };

  // Modify all queries to exclude deleted by default
  const excludeDeletedDocsMiddleware = function(next) {
    // If isDeleted is not explicitly set in the query
    if (!('isDeleted' in this.getQuery())) {
      this.where({ isDeleted: false });
    }
    next();
  };

  // Apply the middleware to all query methods
  schema.pre('find', excludeDeletedDocsMiddleware);
  schema.pre('findOne', excludeDeletedDocsMiddleware);
  schema.pre('findOneAndUpdate', excludeDeletedDocsMiddleware);
  schema.pre('findOneAndDelete', excludeDeletedDocsMiddleware);
  schema.pre('count', excludeDeletedDocsMiddleware);
  schema.pre('countDocuments', excludeDeletedDocsMiddleware);
};

module.exports = softDeletePlugin;
