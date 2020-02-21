const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
	entry: {
		app: './app.js'
	},
	devtool: "source-map",
	output: {
		filename: '[name].js',
		path: __dirname + '/dist'
	},
	module: {
		rules: [
			{
				test: /\.js|\.es6$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			}
		]
	},
	resolve: {
		alias: {
			react: path.resolve('./node_modules/react')
		}
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./app.html",
			filename: "./main.html"
		})
	]
};
