const fs = require("fs");
const http = require("http");

const download = function (url, dest, cb) {
  const file = fs.createWriteStream(dest);
  http.get(url, function (response) {
    response.pipe(file);
    file.on("finish", function () {
      file.close(cb);
    });
  });
};

let rawdata = fs.readFileSync("api_result.json");
let userContent = JSON.parse(rawdata);
userContent.forEach((block) => console.log(block.url));

download(
  "https://gist.githubusercontent.com/rveciana/a5349a84e4a9d5a01e55371806021614/raw/703d310b399098a243a76a50bc209167e924cfd2/.block",
  "test",
  () => console.log("done")
);
