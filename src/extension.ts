import vscode from "vscode";

import { FilesExcludeManager } from "./files-exclude-manager";

export function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "toggle-files-exclude.toggleFilesExclude",
      FilesExcludeManager.toggleConfig,
    ),
  );

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  statusBarItem.text = FilesExcludeManager.icon;
  statusBarItem.command = "toggle-files-exclude.toggleFilesExclude";
  statusBarItem.tooltip = "Toggle Files Exclude";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  vscode.workspace.onDidChangeConfiguration((event) => {
    statusBarItem.text = FilesExcludeManager.icon;
  });
}
