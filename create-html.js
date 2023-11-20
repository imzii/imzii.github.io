const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

const issues = require(process.env.GITHUB_EVENT_PATH);

const issueTitle = issues.issue.title;
const issueCreatedAt = issues.issue.created_at.substring(0, 10).replace(/-/g, '.');
const labelsWithColors = issues.issue.labels.map(label => ({
  name: label.name,
  color: label.color
}));

const milestoneTitle = issues.issue.milestone?.title; // Check if a milestone is assigned

const postData = {
  title: issueTitle,
  created_at: issueCreatedAt,
  labels: labelsWithColors // 라벨 색상을 포함하여 업데이트합니다.
};

const directoryPath = 'generated-html';
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${issueTitle}</title>
</head>
<body>
  <h1>${issueTitle}</h1>
  <div>${marked(issues.issue.body)}</div>
</body>
</html>
`;

const filePath = path.join(directoryPath, `${issues.issue.number}.html`);

async function writeToFiles() {
  try {
    if (!(await fs.access(directoryPath).catch(() => false))) {
      await fs.mkdir(directoryPath);
    }

    await fs.writeFile(filePath, htmlContent);

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
}

writeToFiles();
