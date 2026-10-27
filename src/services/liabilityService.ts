import { LiabilityAssetItem } from '../types';

export class LiabilityService {
  static calculateNetWorth(items: LiabilityAssetItem[]) {
    const assets = items.filter(x => x.type === 'ASSET');
    const liabilities = items.filter(x => x.type === 'LIABILITY');

    const totalAssets = assets.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const totalLiabilities = liabilities.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;

    return {
      assets,
      liabilities,
      totalAssets,
      totalLiabilities,
      netWorth
    };
  }
}
