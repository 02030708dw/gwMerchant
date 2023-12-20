console.log(process.env.NODE_ENV) // baidu.com
const webpack = require("webpack")
module.exports = {
    mode: "development",
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        })
    ]
}