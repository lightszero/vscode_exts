"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const vscode = require("vscode");
var IncomingForm = require("./imp/incoming_form").IncomingForm;
var localsave;
(function (localsave) {
    class Server {
        constructor(port) {
            var server = http.createServer((req, response) => {
                this.onRequest(req, response);
            });
            global["_server"] = server;
            server.on("error", (err) => {
                console.warn("server fail." + err.message);
                vscode.window.showInformationMessage('server 8881 fail.' + err.message);
            });
            try {
                server.listen(8881);
            }
            catch (e) {
                console.warn("server listen fail.");
                vscode.window.showInformationMessage('server listen 8881 fail.');
            }
        }
        onRequest(req, response) {
            var _url = url.parse(req.url, true);
            var callname = _url.pathname;
            if (callname == "/savefile" && req.method == "POST") {
                this.onPost_SaveFile(_url, req, response);
            }
            else if (callname == "/deletefile") {
                this.on_DeleteFile(_url, req, response);
            }
            else if (callname == "/listfiles") {
                this.on_ListFiles(_url, req, response);
            }
            else {
                response.writeHead(200, {
                    'Content-Type': 'text/plain;charset=UTF-8'
                });
                var outjson = {
                    tag: 0,
                    msg: "not support method" + callname,
                    usese: [
                        "deletefile:localhost:8881/deletefile?path=d:\\abc.7z",
                        "listfiles:localhost:8881/listfiles?path=d:\\",
                        "savefile:[POST a file]localhost:8881/savefile?path=d:\\abc.7z"
                    ]
                };
                response.write(JSON.stringify(outjson));
                response.end();
            }
        }
        on_DeleteFile(_url, req, response) {
            var filepath;
            if (_url.query != null)
                filepath = _url.query["path"];
            if (req.method == "POST") {
                var f = new IncomingForm(null);
                f.parse(req, (err, ps, files) => {
                    if (ps["path"] != null)
                        filepath = ps["path"];
                });
            }
            if (filepath == null) {
                response.writeHead(200, {
                    'Content-Type': 'text/plain;charset=UTF-8'
                });
                response.write("{'tag':-2,'msg':'not set filename.'}");
                response.end();
                return;
            }
            //删除文件
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                response.writeHead(200, {
                    'Content-Type': 'text/plain;charset=UTF-8'
                });
                response.write("{'tag':0,'msg':'succ'}");
                response.end();
            }
            else {
                response.writeHead(200, {
                    'Content-Type': 'text/plain;charset=UTF-8'
                });
                response.write("{'tag':-2,'msg':'file is not exists'}");
                response.end();
            }
        }
        on_ListFiles(_url, req, response) {
            var filepath;
            if (_url.query != null)
                filepath = _url.query["path"];
            if (req.method == "POST") {
                var f = new IncomingForm(null);
                f.parse(req, (err, ps, files) => {
                    if (ps["path"] != null)
                        filepath = ps["path"];
                });
            }
            if (filepath == null) {
                response.writeHead(200, {
                    'Content-Type': 'text/plain;charset=UTF-8'
                });
                response.write("{'tag':-2,'msg':'not set filename.'}");
                response.end();
                return;
            }
            var outjson = { 'tag': 0, 'files': [], 'msg': 'succ' };
            var files = fs.readdirSync(filepath);
            files.forEach((value, index) => {
                var curPath = path.join(filepath, value);
                try {
                    var fstate = fs.statSync(curPath);
                }
                catch (err) {
                    return;
                }
                var isdir = fstate.isDirectory();
                var size = 0;
                if (isdir == false)
                    size = fstate.size;
                var item = { 'isdir': isdir, 'value': value, size: size };
                outjson.files.push(item);
            });
            response.writeHead(200, {
                'Content-Type': 'text/plain;charset=UTF-8'
            });
            response.write(JSON.stringify(outjson));
            response.end();
        }
        onPost_SaveFile(_url, req, response) {
            var filepath = _url.query["path"];
            var f = new IncomingForm(null);
            f.parse(req, (err, ps, files) => {
                if (ps["path"] != null)
                    filepath = ps["path"];
                if (filepath == null) {
                    response.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    response.write("{'tag':-2,'msg':'not set filename.'}");
                    response.end();
                    return;
                }
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                }
                var file;
                for (var key in files) {
                    file = files[key];
                    break;
                }
                if (file == null) {
                    response.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    response.write("{'tag':-3,'msg':'not upload file.'}");
                    response.end();
                    return;
                }
                var src = fs.createReadStream(file.path);
                var dest = fs.createWriteStream(filepath);
                src.pipe(dest);
                //   console.log("got:" + err);
                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                response.write("{'tag':0,'msg':'succ'}");
                response.end();
            });
        }
    }
    localsave.Server = Server;
})(localsave = exports.localsave || (exports.localsave = {}));
//# sourceMappingURL=server.js.map