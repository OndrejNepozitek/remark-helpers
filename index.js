const visit = require('unist-util-visit')

const defaultOptions = {
  nodeType: 'html',
  replaceImages: true,
  imageComponent: 'Image',
};

module.exports = function attacher(options) {
  options = { ...defaultOptions, ...options };

  function transformer(tree) {
    visit(tree, 'image', node => {
      node.type = options.nodeType;
      node.value = `<${options.imageComponent} src="${node.url}" caption="${node.alt}" />`
    })
  }

  return transformer;
} 