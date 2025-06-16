const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const cssFile = path.join(__dirname, '..', 'css', 'merged-styles.css');
const outputFile = path.join(__dirname, '..', 'css', 'style.min.css');

try {
    const css = fs.readFileSync(cssFile, 'utf8');
    const minified = new CleanCSS({
        level: 2,
        format: 'keep-breaks'
    }).minify(css);

    fs.writeFileSync(outputFile, minified.styles);
    console.log('CSS minification complete!');
    console.log('Original size:', (css.length / 1024).toFixed(2) + 'kb');
    console.log('Minified size:', (minified.stats.minifiedSize / 1024).toFixed(2) + 'kb');
    console.log('Compression ratio:', Math.round(minified.stats.efficiency * 100) + '%');
} catch (error) {
    console.error('Error during CSS minification:', error);
}
