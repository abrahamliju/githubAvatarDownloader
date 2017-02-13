var request = require('request');
var fs = require('fs');
var dtEnv = require('dotenv').config();

var GITHUB_USER = process.env.USER;
var GITHUB_TOKEN = process.env.TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = {
    url : 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers : {
    'User-Agent': 'GitHub Avatar Downloader - Student Project'}
  };
  request(requestURL, cb);
};
if (process.argv.length < 4) {
  console.log("Please enter Repo Name and a Username to continue");
} else {
  getRepoContributors(process.argv[2], process.argv[3], function(err, result, body) {
    var avatarData = JSON.parse(body);
    var avatarUrl  = [];
    var userId = [];
    console.log("Downloading Avatar Images!!!");
    avatarData.forEach(function(value, index){
      avatarUrl.push(value.avatar_url);
      userId.push(value.login);
    });
    for(var i = 0; i < avatarUrl.length; i++) {
      downloadImageByURL(avatarUrl[i],userId[i]);
    }
    console.log("Images Downloaded in githubAvatarDownloader/ProfilePics");
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream('ProfilePics/'+filePath+'.jpg'));
}
