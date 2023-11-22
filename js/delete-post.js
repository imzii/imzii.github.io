const fs = require('fs');

const issues = require(process.env.GITHUB_EVENT_PATH);

function removeElementsByKeyValue(arr, key, value) {
  return arr.filter(item => item[key] !== value);
}

const portfolioData = require('./portfolio/portfolio.json');
const issueNumberToDelete = issues.issue.number;
const indexToDelete = portfolioData.findIndex(item => item.number === issueNumberToDelete);

if (indexToDelete !== -1) {
  portfolioData.splice(indexToDelete, 1);
  fs.writeFileSync('./portfolio/portfolio.json', JSON.stringify(portfolioData, null, 2));
  console.log(`Issue ${issueNumberToDelete} removed from portfolio.json`);
} else {
  console.log(`Issue ${issueNumberToDelete} not found in portfolio.json`);
}