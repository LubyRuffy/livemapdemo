#!/usr/bin/env node
var ws = require("nodejs-websocket")
var sleep = require('sleep');
var geoip = require('geoip-lite');
var _ = require('underscore');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'your_user',
  password : 'your_password',
  port     : 3306,
  database : 'your_database'
});
var id=0;

//连接mysql
connection.connect();

//创建服务器
var server = ws.createServer(function (conn) {
  console.log("New connection")
  conn.on("text", function (str) {
    console.log("Received "+str)
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
}).listen(8085)

//发送实时消息
setInterval(function () {
  try {
    sql = 'SELECT * from td_protectclient_attack_log2 where id>'+id+' and attacktype!=\'360webscan scan\'';
    if(id==0)
      sql = sql+' order by id desc limit 100';
    else
      sql = sql+'limit 10';
    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;
      _.each(rows, function(a) {
        //console.log(a);
        id = Math.max(id, a.id);
        var attack_ll = geoip.lookup(a.clientip);
        var host_ll = geoip.lookup(a.ipstr);
        //console.log(host_ll);
        server.connections.forEach(function (conn) {
          if (attack_ll && attack_ll.ll && host_ll && host_ll.ll)
          conn.sendText('{"latitude":"'+attack_ll.ll[0]+'","longitude":"'+attack_ll.ll[1]+'","countrycode":"'+attack_ll.country+'","country":"'+attack_ll.country+'","city":"'+attack_ll.city+'","latitude2":"'+host_ll.ll[0]+'","longitude2":"'+host_ll.ll[1]+'","countrycode2":"'+host_ll.country+'","country2":"'+host_ll.country+'","city2":"'+host_ll.city+'","type":"'+a.attacktype+'","md5":"'+a.clientip+'","hostip":"'+a.ipstr+'"}');
        });
      });
    });
  } catch (e) {
    console.log('Error!');
    console.log(e);
  }
}, 1000);
