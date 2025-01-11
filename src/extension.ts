import vscode from "vscode";

import { helloWorld } from "./commands";

export function activate(context) {
  vscode.commands.registerCommand("boilertemplate.helloWorld", helloWorld);
}
