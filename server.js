
// Simple Web Server (Made by a student still learning)
const http = require("http");
const fs = require("fs");

function handleRequest(req, res) {
  console.log("Someone visited:", req.url);

  if (req.url === "/index.html" || req.url === "/") {
    // Show the main page
    fs.readFile("index.html", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Something went wrong");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else {
    // Any other page -> 404
    fs.readFile("404.html", function (err, data) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Page not found");
      } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }
}

// Create the server
const server = http.createServer(handleRequest);

// Start listening
server.listen(3000, function () {
  console.log("Server is running on http://localhost:3000/index.html");
});
