/* eslint-disable no-unused-vars */
var HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
	// mode: 'development',
	entry: {
		app: ['./src/index.js'],
		vendors: ['react'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist/'),
	},
	target: 'web',
	module: {
		rules: [
			{ 
				test: /\.(jsx|js)$/, 
				exclude: /node_modules/, use: { 
					loader: 'babel-loader', 
					options: { presets: ['@babel/preset-react'] } }
			},
			{ test: /.js$/, exclude: /node_modules/, use: { 
				loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }
			},
      { test: /\.css$/, 
        exclude: /node_modules/, 
        use: ['style-loader', 'css-loader'],
			},
      { test: /\.(scss|sass)$/,
        exclude: /node_modules/, 
				use: ['style-loader','css-loader','sass-loader'],
				include: path.resolve(__dirname, '../'),
      },
      {
        enforce: 'pre', //enforce it check code previously
        test: /\.(jsx|js)$/, 
        exclude: /node_modules/,
        loader: 'eslint-loader',
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i, 
				loader: 'file-loader'
			},	
		],
	},
	optimization: { //split the static or larger code to vendor file
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
			}
		},
	},
	devServer: {
		contentBase: path.resolve(__dirname, './public/'),
		port: 9200,
		stats: 'errors-only',
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	stats: 'errors-only',
	node: {
		fs: 'empty',
	},
	// plugins: [new HtmlWebpackPlugin()]
}