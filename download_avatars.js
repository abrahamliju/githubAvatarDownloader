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
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  request(requestURL, cb);
};
if (process.argv.length < 4) {
  console.log("Please enter Repo Name and a Username to continue");
} else {
  getRepoContributors(process.argv[2], process.argv[3], function(err, result, body) {
    var avatarData = JSON.parse(body);
    if(result.statusCode === 200) {
      console.log("Downloading Avatar Images!!!");
      avatarData.forEach(function(value, index){
        downloadImageByURL(value.avatar_url,value.login);
      });
      console.log("Images Downloaded in githubAvatarDownloader/ProfilePics");
    }else {
      console.log("Please check if the username and repo exist!!!");
  }
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream('ProfilePics/'+filePath+'.jpg'));
}
