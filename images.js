const visit = require('unist-util-visit')

const defaultOptions = {
  nodeType: 'jsx',
  transformImages: true,
  imageComponent: 'Image',
  transformGalleries: true,
  galleryComponent: 'Gallery',
  galleryImageComponent: 'GalleryImage',
};

function isListWithOnlyImages(node) {
  if (node.type !== 'list') {
    return false;
  }

  return node.children.every(listItem => {
    if (listItem.children.length != 1) {
      return false;
    }

    const paragraph = listItem.children[0];
    if (paragraph.children.length != 1) {
      return false;
    }
  
    const image = paragraph.children[0];
    if (image.type !== 'image') {
      return false;
    }

    return true;
  });
}

function transformGalleries(tree, options) {
  visit(tree, node => isListWithOnlyImages(node), list => {
    const imageComponents = list.children.map(listItem => {
      var paragraph = listItem.children[0];
      var image = paragraph.children[0];
      var component = `<${options.galleryImageComponent} src="${image.url}" caption="${image.alt}" />`
      
      return component;
    });


    list.type = options.nodeType;
    list.value = `<${options.galleryComponent}>\n`;

    imageComponents.forEach(imageComponent => {
      list.value += `  ${imageComponent}\n`;
    })

    list.value += `</${options.galleryComponent}>`;
  });
}

function transformImages(tree, options) {
  visit(tree, 'image', node => {
    node.type = options.nodeType;
    node.value = `<${options.imageComponent} src="${node.url}" caption="${node.alt}" />`
  });
}

module.exports = function attacher(options) {
  options = { ...defaultOptions, ...options };

  function transformer(tree) {
    if (options.transformGalleries) {
      transformGalleries(tree, options);
    }
    if (options.transformImages) {
      transformImages(tree, options);
    }
  }

  return transformer;
} 