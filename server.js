
// Simple Inventory API - made by a learning student
const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "items.json");

// helper function to read items from file
function readItems() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// helper function to write items to file
function writeItems(items) {
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

// function to send response
function sendResponse(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: status < 400, data: data }));
}

// create the server
const server = http.createServer((req, res) => {
  if (req.url.startsWith("/items")) {
    const method = req.method;
    const parts = req.url.split("/");
    const id = parts[2];

    if (method === "GET" && !id) {
      // get all items
      const items = readItems();
      sendResponse(res, 200, items);

    } else if (method === "GET" && id) {
      // get one item
      const items = readItems();
      const item = items.find(i => i.id == id);
      if (item) sendResponse(res, 200, item);
      else sendResponse(res, 404, "Item not found");

    } else if (method === "POST") {
      // create item
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", () => {
        try {
          const newItem = JSON.parse(body);
          const items = readItems();
          newItem.id = Date.now().toString();
          items.push(newItem);
          writeItems(items);
          sendResponse(res, 201, newItem);
        } catch (err) {
          sendResponse(res, 400, "Invalid data");
        }
      });

    } else if (method === "PUT" && id) {
      // update item
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", () => {
        try {
          const updateData = JSON.parse(body);
          const items = readItems();
          const index = items.findIndex(i => i.id == id);
          if (index !== -1) {
            items[index] = { ...items[index], ...updateData };
            writeItems(items);
            sendResponse(res, 200, items[index]);
          } else {
            sendResponse(res, 404, "Item not found");
          }
        } catch (err) {
          sendResponse(res, 400, "Invalid data");
        }
      });

    } else if (method === "DELETE" && id) {
      // delete item
      const items = readItems();
      const newItems = items.filter(i => i.id != id);
      if (items.length === newItems.length) {
        sendResponse(res, 404, "Item not found");
      } else {
        writeItems(newItems);
        sendResponse(res, 200, "Item deleted");
      }

    } else {
      sendResponse(res, 404, "Route not found");
    }
  } else {
    sendResponse(res, 404, "Invalid path");
  }
});

// start server
server.listen(3000, () => {
  console.log("Simple API Server running on http://localhost:3000");
});
