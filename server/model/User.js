const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  password: {
    type: String,
    required: true
},
  isAdmin: {
    type: Boolean,
    default: false,
},
  favourite: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.Favourite = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromFavourite = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    if (item && item.productId && productId) {
      console.log('productId : ', item.productId);
      return item.productId.toString() !== productId.toString();
    }
    return false;
  });
  this.cart.items = updatedCartItems;
  return this.save();
}


userSchema.methods.clearFavourite = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
