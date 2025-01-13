import { FilesExcludeManager } from "./files-exclude-manager";

export function toggleFilesExclude() {
  const filesExcludeManager = new FilesExcludeManager();
  filesExcludeManager.toggleFilesExclude();
}
