'use strict';
///<reference path="server.ts"/>
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as http from "http";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "testtt" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () =>
    {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);

    if (global["_localsave_"] == null)
    {
        initServer();
    }
}
function initServer()
{
    global["_server"] =new localsave.Server();
    var server = http.createServer((req, response) =>
    {
        if (req.method == "GET")
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
        else
        {

            response.writeHead(200,
                {
                    'Content-Type': 'text/plain'
                }
            );

            response.write(

                "hello world. POST");
            response.end();
        }
    })
    global["_server"] = server;
    server.listen(8881);
}

// this method is called when your extension is deactivated
export function deactivate()
{
}