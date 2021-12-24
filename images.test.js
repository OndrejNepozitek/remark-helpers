const remark = require('remark');
const plugin = require('./images');

test('replaces a list of images with custom components', () => {
  const doc = '* ![alt1](img1.png)\n* ![alt2](img2.png)';
  const result = remark()
    .use(plugin, { 
      nodeType: 'html',
      imageComponent: 'Image',
      galleryComponent: 'Gallery',
      galleryImageComponent: 'GalleryImage',
    })
    .processSync(doc);

  expect(result.contents).toContain('<Gallery>\n  <GalleryImage src="img1.png" caption="alt1" />\n  <GalleryImage src="img2.png" caption="alt2" />\n</Gallery>');
})

test('does not replace a list with not only images', () => {
  const doc = '* ![alt1](img1.png)\n* text';
  const result = remark()
    .use(plugin, { 
      nodeType: 'html',
      imageComponent: 'Image',
      galleryComponent: 'Gallery',
    })
    .processSync(doc);

  expect(result.contents).not.toContain('<Gallery>');
})

test('does not replace a list when disabled', () => {
  const doc = '* ![alt1](img1.png)\n* ![alt2](img2.png)';
  const result = remark()
    .use(plugin, { 
      nodeType: 'html',
      imageComponent: 'Image',
      galleryComponent: 'Gallery',
      transformGalleries: false,
    })
    .processSync(doc);

  expect(result.contents).not.toContain('<Gallery>');
})

test('replaces images with a custom component', () => {
  const doc = "![alt text](img.png)";
  const result = remark()
    .use(plugin, { 
      nodeType: 'html',
      imageComponent: 'Image',
    })
    .processSync(doc);

  expect(result.contents).toContain('<Image src="img.png" caption="alt text" />');
})

test('does not replace an image when disabled', () => {
  const doc = "![alt text](img.png)";
  const result = remark()
    .use(plugin, { 
      nodeType: 'html',
      imageComponent: 'Image',
      transformImages: false,
    })
    .processSync(doc);

  expect(result.contents).not.toContain('Image');
})