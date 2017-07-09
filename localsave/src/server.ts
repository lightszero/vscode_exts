import * as http from "http";
import * as fs from "fs";
import * as url from "url";

var IncomingForm = require("./imp/incoming_form").IncomingForm;
export namespace localsave
{
    export class Server
    {
        constructor(port: number)
        {
            var server = http.createServer((req, response) =>
            {
                if (req.method == "GET")
                {
                    this.onGet(req, response);

                }
                else
                {
                    this.onPost(req, response);
                }
            })
            global["_server"] = server;
            server.listen(8881);
        }
        onGet(req: http.IncomingMessage, response: http.ServerResponse)
        {
            response.writeHead(200,
                {
                    'Content-Type': 'text/plain'
                }
            );

            response.write(
                "hello world. get"
                +
                req.url
            );
            response.end();

        }
        onPost(req: http.IncomingMessage, response: http.ServerResponse)
        {
            var u = url.parse(req.url, true);
            var callname = u.pathname;
            var filepath: string = u.query["path"];
            if (callname != "/savefile")
            {
                response.writeHead(200,
                    {
                        'Content-Type': 'text/plain'
                    }
                );

                response.write("{'tag':-1,'msg':'not support method.'}");
                response.end();
                return;
            }

            var f = new IncomingForm(null);
            f.parse(req, (err, ps, files) =>
            {
                if (ps["path"] != null)
                    filepath = ps["path"];

                if (filepath == null)
                {
                    response.writeHead(200,
                        {
                            'Content-Type': 'text/plain'
                        }
                    );

                    response.write("{'tag':-2,'msg':'not set filename.'}");
                    response.end();
                    return;
                }
                if (fs.exists(filepath))
                {
                    fs.unlink(filepath);
                }
                var file;
                for (var key in files)
                {
                    file = files[key];
                    break;
                }
                if (file == null)
                {
                    response.writeHead(200,
                        {
                            'Content-Type': 'text/plain'
                        }
                    );

                    response.write("{'tag':-3,'msg':'not upload file.'}");
                    response.end();
                    return;
                }
                var src = fs.createReadStream(file.path + "\\" + file.name);
                var dest = fs.createWriteStream(filepath);
                src.pipe(dest);
                //   console.log("got:" + err);
                response.writeHead(200,
                    {
                        'Content-Type': 'text/plain'
                    }
                );

                response.write(

                    "{'tag':0,'msg':'succ'}");
                response.end();
            });

        }
    }
}