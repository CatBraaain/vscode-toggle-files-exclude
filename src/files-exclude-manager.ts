import merge from "deepmerge";
import vscode from "vscode";

const SECTION = "files.exclude";

export class FilesExcludeManager {
  private static get isExcluded() {
    const activeConfig = merge.all(FilesExcludeManager.configScopeObjs.map(({ config }) => config));
    return Object.values(activeConfig).every((value) => value === true);
  }

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

  public static get icon() {
    return !FilesExcludeManager.isExcluded ? "$(eye)" : "$(eye-closed)";
  }

  public static toggleConfig() {
    FilesExcludeManager.configScopeObjs.forEach(({ config, scope }) =>
      FilesExcludeManager.toggleConfigByScope(config, !FilesExcludeManager.isExcluded, scope),
    );
  }

  private static toggleConfigByScope(
    config: object,
    togglingDirection: boolean,
    configurationTarget: vscode.ConfigurationTarget,
  ) {
    const configKeys = Object.keys(config);
    if (configKeys.length !== 0) {
      const toggledConfig = Object.fromEntries(configKeys.map((key) => [key, togglingDirection]));
      vscode.workspace.getConfiguration().update(SECTION, toggledConfig, configurationTarget);
    }
  }
}

interface ConfigScope {
  config: object;
  scope: vscode.ConfigurationTarget;
}
