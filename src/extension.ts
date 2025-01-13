import vscode from "vscode";

import { toggleFilesExclude } from "./commands";

export function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("toggle-files-exclude.toggleFilesExclude", toggleFilesExclude),
  );
}
