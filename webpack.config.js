module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'index.js',
		path: __dirname + '/dist',
		libraryTarget: 'commonjs2'
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			}
		]
	},
	externals: {
		react: 'react'
	}
};