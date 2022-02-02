const WebpackConcatPlugin = require('webpack-concat-files-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');
const terser = require('terser');


module.exports = {
   entry: ["./scss/form-builder.scss", "./scss/codemirror.scss", "./scss/bootstrap-5.0.2/bootstrap.scss", "./scss/font/bootstrap-icons-1.7.2.scss", './js/form-components.js', './js/editor-components.js', './js/components.js', './js/editor-props.js', './js/form-builder.js'],
   mode: 'production',
   output: {
    filename: 'vuizer.bundle.js',
    path: path.resolve(__dirname, 'dist'),
	library: {
      name: 'vuizer',
      type: 'umd',
    }
  },
  plugins: [
	new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'assets/css/fonts'), to: path.resolve(__dirname, 'dist/fonts') }
	]}),
    new WebpackConcatPlugin({
      bundles: [
        {
          dest: './dist/vuizer-full.bundle.min.js',
          src: ['./assets/js/*.min.js', './dist/vuizer.bundle.js']
		  /*transforms: {
            after: async (code) => {
              const minifiedCode = await terser.minify(code);
              return minifiedCode.code;
            },
          }*/
        },
		/*{
          dest: './dist/FormEditor-full.css',
          src: ['./assets/css/*.css', './css/*.css'],
        },*/
      ],
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  }
};