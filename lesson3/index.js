const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFilePath = path.resolve(__dirname, 'viewsData.json');

const updateCounterMiddleware = (req, res, next) => {
  try {
    let data = {};
    if (fs.existsSync(dataFilePath)) {
      const jsonData = fs.readFileSync(dataFilePath, 'utf8');
      data = JSON.parse(jsonData);
    }

    const url = req.originalUrl;
    data[url] = (data[url] || 0) + 1;

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    req.viewsData = data;

    next();
  } catch (error) {
    console.error('Error updating counter:', error);
    res.status(500).send('Internal Server Error');
  }
};

const loadCounterMiddleware = (req, res, next) => {
  try {
    let data = {};
    if (fs.existsSync(dataFilePath)) {
      const jsonData = fs.readFileSync(dataFilePath, 'utf8');
      data = JSON.parse(jsonData);
    }

    req.viewsData = data;

    next();
  } catch (error) {
    console.error('Error loading counter:', error);
    res.status(500).send('Internal Server Error');
  }
};

app.use(updateCounterMiddleware);
app.use(loadCounterMiddleware);

app.get('/', (req, res) => {
  const url = req.originalUrl;
  const viewsCount = req.viewsData[url] || 0;
  res.send(
    `<h1>Home Page</h1><p>Views: ${viewsCount}</p> <a href='/about'>/about</a>`
  );
});

app.get('/about', (req, res) => {
  const url = req.originalUrl;
  const viewsCount = req.viewsData[url] || 0;
  res.send(`<h1>About Page</h1><p>Views: ${viewsCount}</p> <a href='/'>/</a>`);
});

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT} ...`);
});
