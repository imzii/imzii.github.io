const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

const issues = require(process.env.GITHUB_EVENT_PATH);

const issueNumber = issues.issue.number;
const issueTitle = issues.issue.title;
const issueCreatedAt = issues.issue.created_at.substring(0, 10).replace(/-/g, '.');
const labelsWithColors = issues.issue.labels.map(label => ({
  name: label.name,
  color: label.color
}));

const milestoneTitle = issues.issue.milestone?.title;

const postData = {
  number: issueNumber,
  title: issueTitle,
  created_at: issueCreatedAt,
  labels: labelsWithColors
};

const directoryPath = 'portfolio';
const htmlFilePath = path.join(directoryPath, `${issueNumber}.html`);
const templateFilePath = 'template.html'; // 파일 위치에 따라 경로를 수정하세요.

(async () => {
  try {
    const directoryExists = await fs.access(directoryPath).then(() => true).catch(() => false);

    if (!directoryExists) {
      await fs.mkdir(directoryPath);
    }

    let htmlContent = '';

    if (await fs.access(htmlFilePath).catch(() => false)) {
      htmlContent = await fs.readFile(htmlFilePath, 'utf-8');
    } else {
      const templateContent = await fs.readFile(templateFilePath, 'utf-8');
      htmlContent = generateHtmlFromTemplate(templateContent, {
        title: issueTitle,
        created_at: issueCreatedAt,
        body: marked(issues.issue.body, { breaks: true })
      });
      await fs.writeFile(htmlFilePath, htmlContent);
    }

    const jsonFilePath = milestoneTitle === 'blog' ? 'blog/blog.json' : 'portfolio/portfolio.json';
    let postDataList = [];

    if (await fs.access(jsonFilePath).catch(() => false)) {
      const existingData = await fs.readFile(jsonFilePath, 'utf-8');
      if (existingData.trim() !== '') {
        postDataList = JSON.parse(existingData);
      }
    }

    postDataList.push(postData);
    await fs.writeFile(jsonFilePath, JSON.stringify(postDataList, null, 2));
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();

function generateHtmlFromTemplate(template, data) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return data.hasOwnProperty(key) ? data[key] : match;
  });
}
