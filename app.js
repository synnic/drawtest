const express = require('express');
const app = new express();

app.listen(8080, function () {
    console.log('Listing on Port 8080...');
  });

app.use(express.static('.')); 