const os = require('os');
const path = require('path');
const fs = require('fs');
const portfinder = require('portfinder');

module.exports = {
  // 查找本地对外ip
  findIp: (defaultIp)=>{
    let ip = defaultIp || "";
    let AIP = os.networkInterfaces();
    for (let li in AIP) {
        let ali = AIP[li];
        for (let key in ali) {
            let ak = ali[key];
            if (ak["family"] == "IPv4" && ak["address"] != "127.0.0.1") {
                ip = ak["address"];
                break;
            }
        }
    };
    return ip;
  },
  // 查找指定范围内的可用端口
  findPort: (portRange)=>{
    portRange = Array.isArray(portRange) ? portRange : [];
    portfinder.basePort = portRange[0] || 3000; // 起始端口
    portfinder.highestPort = portRange[1] || parseInt(portfinder.basePort)+1000; //截至端口
    return portfinder.getPortPromise();
  },
  // 获取指定目录下的某一类型文件，不会进行目录递归查询
  findMd: (rootDirPath, extName)=>{
    return new Promise((resolve, reject)=>{
      extName = "." + extName;
      let reg = new RegExp(".md$");
      fs.readdir(rootDirPath, 'utf8', (err, data)=>{
        if(err){
          reject(err);
        }else{
          let list = [];
          data.forEach(file=>{
            let filepath = path.join(rootDirPath, file);
            let stats = fs.statSync(filepath);
            if(stats.isFile() && path.extname(filepath) === extName){
              list.push({
                filename: file.replace(reg, ""),
                filepath: filepath
              });
            }
          });
          resolve(list);
        }
      });
    });
  }
};
