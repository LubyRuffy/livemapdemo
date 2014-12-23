livemapdemo
===========

地图实时攻击演示



目前包含：
* 世界地图
基本就是copy了ipviking的展示，我觉得他们做的已经非常满足我的需求了。

* 中国地图
目前只是简单的进行了修改，能够显示中国地图，但是显示的数据不能对应到城市或者省份，以后有时间再改。


服务端运行：
nodejs目录下，npm install mysql,nodejs-websocket,geoip-lite,underscore
自行填充实时数据。

网页文件直接访问index.html查看世界地图，china.html查看中国地图
