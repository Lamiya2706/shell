const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');
const deps = require('./package.json').dependencies;
module.exports = (_, argv) => ({
  entry: './src/index',
  // mode: 'development',
  output: {
    publicPath: argv.mode === 'development' ? 'localhost:3000' : 'https://lamiya2706.github.io/shell'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // port: 3000,
    historyApiFallback: true,
    hot: 'only',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.mjs', '.jsx', '.css'],
    alias: {
      events: 'events',
    },
  },
  output: {
    publicPath: 'auto',
    chunkFilename: '[id].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        order: 'order@https://lamiya2706.github.io/orders/remoteEntry.js',
        dashboard: 'dashboard@https://lamiya2706.github.io/dashboard/remoteEntry.js',
        shell: 'shell@https://lamiya2706.github.io/shell/remoteEntry.js',
      },
      exposes: {
        './Shell': './src/Shell',
        './Service': './src/Service',
      },
      shared: [
        {
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
          '@material-ui/core': {
            singleton: true,
            requiredVersion: deps['@material-ui/core'],
          }
        },
        './src/Service',
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      publicPath: './',
    }),
  ],
});
