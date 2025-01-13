import merge from "merge";
import vscode from "vscode";

const SECTION = "files.exclude";

export function toggleFilesExclude() {
  const filesExcludeConfigInfo = vscode.workspace.getConfiguration().inspect(SECTION);
  const globalValue = filesExcludeConfigInfo?.globalValue ?? {};
  const workspaceValue = filesExcludeConfigInfo?.workspaceValue ?? {};
  const workspaceFolderValue = filesExcludeConfigInfo?.workspaceFolderValue ?? {};

  const configScopeObjs = [
    { config: globalValue, scope: vscode.ConfigurationTarget.Global },
    { config: workspaceValue, scope: vscode.ConfigurationTarget.Workspace },
    { config: workspaceFolderValue, scope: vscode.ConfigurationTarget.WorkspaceFolder },
  ];

  const activeConfig = merge(...configScopeObjs.map(({ config }) => config));
  const toggleDirection = Object.values(activeConfig).every((value) => value === false);

  configScopeObjs.forEach(({ config, scope }) =>
    toggleFilesExcludeByScope(config, toggleDirection, scope),
  );
}

function toggleFilesExcludeByScope(
  config: object,
  toggleDirection: boolean,
  configurationTarget: vscode.ConfigurationTarget,
) {
  const configKeys = Object.keys(config);
  if (configKeys.length !== 0) {
    const toggledConfig = Object.fromEntries(configKeys.map((key) => [key, toggleDirection]));
    vscode.workspace.getConfiguration().update(SECTION, toggledConfig, configurationTarget);
  }
}
