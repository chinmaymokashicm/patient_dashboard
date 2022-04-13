const mongoose = require("mongoose")

const testSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, "Text value required!"]
    }
}, 
// {
//     timestamps: true
// }
)

module.exports = mongoose.model("testModel", testSchema)