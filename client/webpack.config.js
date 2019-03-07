const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
   entry: ["@babel/polyfill","./main.js"],
   output: {
      path: path.join(__dirname, '/dist'),
      filename: 'index_bundle.js'
   },
   devServer: {
      inline: true,
      port: 8080
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['@babel/preset-env']
            }
         },
         {
           test: /\.scss$/,
           loaders: ["style-loader","css-loader","sass-loader"]
         },
         {
           test: /\.css$/,
           loaders: ["style-loader","css-loader","sass-loader"]
         }
      ]
   },
   plugins:[
      new HtmlWebpackPlugin({
         template: './index.html'
      })
   ]
}
