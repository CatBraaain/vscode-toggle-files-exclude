import merge from "merge";
import vscode from "vscode";

const SECTION = "files.exclude";

export class FilesExcludeManager {
  public configScopeObjs: ConfigScope[];
  public toggleDirection: boolean;

  public constructor() {
    this.configScopeObjs = this.getConfigScopeObjs();
    this.toggleDirection = this.getIsAllFalse(this.configScopeObjs);
  }

  private getConfigScopeObjs(): ConfigScope[] {
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

  private getIsAllFalse(configScopeObjs: ConfigScope[]) {
    const activeConfig = merge(...configScopeObjs.map(({ config }) => config));
    return Object.values(activeConfig).every((value) => value === false);
  }

  public toggleFilesExclude() {
    this.configScopeObjs.forEach(({ config, scope }) =>
      this.toggleFilesExcludeByScope(config, this.toggleDirection, scope),
    );
  }

  private toggleFilesExcludeByScope(
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
