const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');  
const HtmlWebpackPlugin = require('html-webpack-plugin');  
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
  
function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
	entry: {
		index: './src/index.js'
		// another: './src/another-module.js'
	},
	output: {
		filename: devMode ? '[name].[hash:8].js': '[name].[chunkhash:8].js',       //数字8表示取hash标识符的前八位
        chunkFilename: devMode ? '[name].[hash:8].js': '[name].[chunkhash:8].js',  //异步模块的文件输出名
		path:path.resolve(__dirname,'dist')			//根据入口文件名定于输出文件
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
		  title: 'index'
		}),
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash:8].css",
			chunkFilename: "[name].[contenthash:8].css"
		})
	],
	module: {
      rules: [
        {
          test: /\.css$/,
          use: [
		    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
			"css-loader",
            {
              loader: 'postcss-loader',
              options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
					plugins: (loader) => []
				}
            },
			'sass-loader',
          ]
        }
      ]
    },
	optimization: {
		splitChunks: {
		  cacheGroups: {
			vendor: {                                //分离第三方库
			  test: /[\\/]node_modules[\\/]/,
			  name: 'lodash',
			  chunks: 'all'
			},
			indexStyles: {
			  name: 'index',                        
			  test: (m,c,entry = 'index') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
			  chunks: 'all',
			  enforce: true
			},
			otherStyles: {
			  name: 'another',
			  test: (m,c,entry = 'another') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
			  chunks: 'all',
			  enforce: true
			}
		  }
		}
	}
};