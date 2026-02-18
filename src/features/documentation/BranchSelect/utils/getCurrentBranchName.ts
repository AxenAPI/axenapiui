import { BranchInfo } from '@shared/openapi';

export function getCurrentBranchName(branches: BranchInfo[]) {
  if (branches.length > 0) {
    return branches.find(branch => branch.current)?.name || '';
  }

  return '';
}
