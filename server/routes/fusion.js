const express = require('express');
const router = express.Router();
let fs = require('fs');

module.exports = function(path){
  const rootPath = path.join(__dirname, '../../');
  router.get('/fusion-config.json', (req, res, next) => {
      let encoding = {
          encoding: 'UTF8'
      };
      let fusionConfig = fs.readFileSync(path.join(rootPath, 'fusion/fusion-config.json'), encoding);
      res.send(fusionConfig);
  });

  router.get('/templates/:folderName/:fileName', (req, res, next) => {
      console.log("Request temp", req.params);
      let encoding = {
          encoding: 'UTF8'
      };
      let folderName = req.params.folderName;
      let fileName = req.params.fileName;
      let template = fs.readFileSync(path.join('fusion/templates', folderName, fileName), encoding);
      res.send(template);
  });
  
  return router;
}
