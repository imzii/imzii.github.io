const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const issues = require(process.env.GITHUB_EVENT_PATH);

const issueTitle = issues.issue.title;
const issueCreatedAt = issues.issue.created_at.substring(0, 10).replace(/-/g, '.');
const labels = issues.issue.labels.map(label => label.name);

const milestoneTitle = issues.issue.milestone?.title; // Check if a milestone is assigned

const postData = {
  title: issueTitle,
  created_at: issueCreatedAt,
  labels: labels
};

const directoryPath = 'generated-html';
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
}

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

fs.writeFileSync(filePath, htmlContent);

// JSON 파일에 저장할 정보 구성
const jsonFilePath = milestoneTitle === 'blog' ? 'blog/blog.json' : 'portfolio/portfolio.json'; // 마일스톤에 따라 JSON 파일 선택

let postDataList = [];

if (fs.existsSync(jsonFilePath)) {
  // 파일이 이미 존재하는 경우 기존 데이터 가져오기
  const existingData = fs.readFileSync(jsonFilePath, 'utf-8');
  postDataList = JSON.parse(existingData);
}

postDataList.push(postData);

// 데이터를 JSON 형식으로 저장
fs.writeFileSync(jsonFilePath, JSON.stringify(postDataList, null, 2));
