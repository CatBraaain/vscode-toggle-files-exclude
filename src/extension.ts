import vscode from "vscode";

import { FilesExcludeManager } from "./files-exclude-manager";

export function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "toggle-files-exclude.toggleFilesExclude",
      FilesExcludeManager.toggleConfig,
    ),
  );

  // for explorer icon
  context.subscriptions.push(
    FilesExcludeManager.watchConfiguration(),
    vscode.commands.registerCommand("toggle-files-exclude.show", FilesExcludeManager.show),
    vscode.commands.registerCommand("toggle-files-exclude.hide", FilesExcludeManager.hide),
  );
}
