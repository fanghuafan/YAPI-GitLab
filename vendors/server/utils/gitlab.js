const yapi = require('../yapi.js');
// var request = require('request');
var http=require('http');
var querystring=require('querystring');

exports.gitlabQuery = (username, password) => {

    return new Promise((resolve, reject) => {
        const { gitlabLogin } = yapi.WEBCONFIG;
        
        // console.log("配置文件：", gitlabLogin);
        //发送 http Post 请求 
        var postData=querystring.stringify({ 
            "grant_type"    : "password",
            "username"      : username,
            "password"      : password
        }); 
        var options={ 
            hostname: gitlabLogin.host, 
            port: gitlabLogin.port,
            path: gitlabLogin.path, 
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-Length':postData.length
            } 
        } 
        var req=http.request(options, function(res) { 
            // console.log('Status:',res.statusCode); 
            // console.log('headers:',JSON.stringify(res.headers)); 
            res.setEncoding('utf-8'); 
            res.on('data',function(chun){ 
                var data = JSON.parse(chun);
                console.log("DATA解析结果：", data);
                // 判断是否登录成功
                if(typeof(data.access_token) == "undefined" || data.access_token == '') {
                    reject({
                        type: false,
                        message: "登录错误，请核对GitLab账户信息！"
                    });
                } else {
                    var okRes = {
                        type: true,
                        token: data.access_token
                    }
                    resolve(okRes);   
                }
            }); 
            res.on('end',function(){ 
                console.log('No more data in response.********'); 
            }); 
        }); 
        req.on('error',function(err){ 
            console.error(err);         
            var errResDate = {
                type: false, 
                message: "GitLab Access error:" + err   
            }
            reject(errResDate);
        }); 
        req.write(postData); 
        req.end();



        // const { gitlabLogin } = yapi.WEBCONFIG;
        // var requestData = qs.stringify({
        //     "grant_type"    : "password",
        //     "username"      : username,
        //     "password"      : password
        // });

        // request({
        //     url: gitlabLogin.host + gitlabLogin.path,
        //     method: "POST",
        //     body: requestData
        // }, function(error, response, body) {
        //     var data = JSON.parse(body);
        //     if (!error && response.statusCode == 200 && data.access_token != '') {
        //         console.log("GitLab授权请求结果：", data);
        //         var okRes = {
        //             type: true,
        //             token: data.access_token
        //         }
        //         resolve(okRes);
        //     } else {
        //         console.log("GitLab授权请求失败！！！");
        //         var errResDate = {
        //             type: false, 
        //             message: "GitLab Access error:" + error
        //         }
        //         reject(errResDate);
        //     }
        // });

    });

  };