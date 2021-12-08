const express = require('express');

const app = express();

app.use(express.static('./dist/generic-ang-map'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/generic-ang-map/'}),
);

app.listen(process.env.PORT || 8080);