const renderBody = (block, {res}) => {
  res.markup += `<p>${block.text}</p>`;
};

module.exports = {
  renderBody
};
