const express = require('express');
const app = new express();

app.listen(3000, function () {
    console.log('Listing on Port 3000...');
  });

app.use(express.static('.')); 