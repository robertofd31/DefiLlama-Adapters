const { getLogs2 } = require('../helper/cache/getLogs')
const { sumTokens2 } = require('../helper/unwrapLPs')

const config = {
  era: { fromBlock: 9775, factories: ['0x9D63d318143cF14FF05f8AAA7491904A494e6f13'] },
  linea: { fromBlock: 716, factories: ['0xc5916f6cF441c72DaA2E2C48AfC7CE642eEe6690'] },
  sophon: { fromBlock: 38459, factories: ['0x0f6e27007e257e74c86522387BD071D561ba3C97'] },
  scroll: { fromBlock: 80875, factories: ['0xB11042007e78bE92dc1c79DA1e7eF499b4B31838'] },
}

async function tvl(api) {
  const { fromBlock, factories } = config[api.chain]
  const ownerTokens = []
  for (const factory of factories) {
    const logs = await getLogs2({ api, factory, fromBlock, eventAbi: 'event PoolCreated(address indexed token0, address indexed token1, int24 indexed tickSpacing, address pool)' })
    logs.forEach(({ token0, token1, pool }) => ownerTokens.push([[token0, token1], pool]))
  }
  return sumTokens2({ api, ownerTokens })
}

module.exports = {
  methodology: 'Counts the tokens held by every SyncSwap V3 (ranged) pool created by the SyncSwap range pool factories.',
}

Object.keys(config).forEach(chain => { module.exports[chain] = { tvl } })
