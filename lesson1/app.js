const http = require('http');
const PORT = 3000;

const pageViews = {
  '/': 0,
  '/about': 0,
};

const requestHandler = (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = parsedUrl.pathname;
  if (pageViews.hasOwnProperty(path)) {
    pageViews[path]++;
  }
  let content = '';
  if (path === '/') {
    content = `
    <h1>Главная страница</h1>
    <p>Счетчик просмотров:${pageViews['/']}</p>
    <a href="/about">Перейти на страницу "О нас"</a>`;
  } else if (path === '/about') {
    content = `
      <h1>Страница "О нас"</h1>
      <p>Счетчик просмотров: ${pageViews['/about']}</p>
      <a href="/">Вернуться на главную страницу</a>
    `;
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Страница не найдена</h1>');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8 ' });
  res.end(content);
};
const server = http.createServer(requestHandler);

server.listen(PORT, 'localhost', (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});
