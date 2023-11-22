const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const issues = require(process.env.GITHUB_EVENT_PATH);

const portfolioData = require('/portfolio/portfolio.json');
const issueNumberToModify = issues.issue.number;

const indexToModify = portfolioData.findIndex(item => item.number === issueNumberToModify);

if (indexToModify !== -1) {
  portfolioData[indexToModify] = {
    number: issues.issue.number,
    title: issues.issue.title,
    created_at: issues.issue.created_at.substring(0, 10).replace(/-/g, '.'),
    labels: issues.issue.labels.map(label => ({
      name: label.name,
      color: label.color
    }))
  };

  fs.writeFileSync('./portfolio/portfolio.json', JSON.stringify(portfolioData, null, 2));
  console.log(`Issue ${issueNumberToModify} updated in portfolio.json`);
} else {
  console.log(`Issue ${issueNumberToModify} not found in portfolio.json`);
}
