const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectID,
                    ref: 'Course',
                    required: true,
                }
            }
        ]
    }


});

userSchema.methods.addToCart = function (course) {
    const cloneItems = [...this.cart.items];
    const index = cloneItems.findIndex(c => c.courseId.toString() === course._id.toString());

    if (index >= 0) {
        cloneItems[index].count = cloneItems[index].count + 1;
    } else {
        cloneItems.push({
            courseId: course._id,
            count: 1
        })
    }
    this.cart = {items: cloneItems};

    return this.save();

};

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(c => c.courseId.toString() === id.toString());

    // console.log(items);
    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items};
    return this.save();
};


module.exports = model('User', userSchema);
