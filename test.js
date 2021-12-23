const remark = require('remark');
const plugin = require('.');

test('replaces images with a custom tag', () => {
  const doc = "![alt text](img.png)";
  const result = remark()
    .use(plugin, { 
      nodeType: 'html',
      imageComponent: 'Image',
    })
    .processSync(doc);

  expect(result.contents).toContain('<Image src="img.png" caption="alt text" />');
})