# localsave_vscode README

在8881端口上开启一个http服务,可通过此http服务来操作硬盘上的文件
使用方法如下
deletefile
    localhost:8881/deletefile?path=d:\abc.7z
listfiles
    localhost:8881/listfiles?path=d:\
savefile
    [POST a file]
    localhost:8881/savefile?path=d:\abc.7z


**Enjoy!**