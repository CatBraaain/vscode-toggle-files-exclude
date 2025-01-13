import merge from "merge";
import vscode from "vscode";

const SECTION = "files.exclude";

export class FilesExcludeManager {
  private static get configScopeObjs(): ConfigScope[] {
    const filesExcludeConfigInfo = vscode.workspace.getConfiguration().inspect(SECTION);
    const globalValue = filesExcludeConfigInfo?.globalValue ?? {};
    const workspaceValue = filesExcludeConfigInfo?.workspaceValue ?? {};
    const workspaceFolderValue = filesExcludeConfigInfo?.workspaceFolderValue ?? {};

    return [
      { config: globalValue, scope: vscode.ConfigurationTarget.Global },
      { config: workspaceValue, scope: vscode.ConfigurationTarget.Workspace },
      { config: workspaceFolderValue, scope: vscode.ConfigurationTarget.WorkspaceFolder },
    ];
  }

  private static get togglingDirection() {
    const activeConfig = merge(...FilesExcludeManager.configScopeObjs.map(({ config }) => config));
    return Object.values(activeConfig).every((value) => value === false);
  }

  public static toggleConfig() {
    FilesExcludeManager.configScopeObjs.forEach(({ config, scope }) =>
      FilesExcludeManager.toggleConfigByScope(config, FilesExcludeManager.togglingDirection, scope),
    );
  }

  private static toggleConfigByScope(
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
}

interface ConfigScope {
  config: object;
  scope: vscode.ConfigurationTarget;
}
