import vscode from "vscode";

import { FilesExcludeManager } from "./files-exclude-manager";

export function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "toggle-files-exclude.toggleFilesExclude",
      FilesExcludeManager.toggleConfig,
    ),
  );
}
