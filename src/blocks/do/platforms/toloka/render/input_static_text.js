const render = (block, {res}) => {
  res.markup += `<p>${block.text}</p>`;
};

module.exports = render;
