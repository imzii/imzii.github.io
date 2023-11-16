const fs = require('fs');
const { marked } = require('marked');

const string = '**--asdf--**';

const issueBody = marked(string);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>title</title>
</head>
<body>
  <h1>Title</h1>
  <div>${issueBody}</div>
</body>
</html>
`;

console.log(htmlContent)
