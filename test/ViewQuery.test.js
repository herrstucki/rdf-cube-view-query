const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const ViewQuery = require('../lib/query/ViewQuery')
const { compareViewQuery } = require('./support/compareViewQuery')

describe('query/ViewQuery', () => {
  it('should be a constructor', () => {
    strictEqual(typeof ViewQuery, 'function')
  })

  it('should generate a day function filter', async () => {
    await compareViewQuery({ name: 'functionDay' })
  })

  it('should generate a month function filter', async () => {
    await compareViewQuery({ name: 'functionMonth' })
  })

  it('should generate a year function filter', async () => {
    await compareViewQuery({ name: 'functionYear' })
  })

  it('should generate a language filter', async () => {
    await compareViewQuery({ name: 'language' })
  })

  it('should generate LIMIT and OFFSET with the values given in projection/orderBy', async () => {
    await compareViewQuery({ name: 'limitOffset' })
  })

  it('should generate ORDER BY in the direction given in projection/orderBy', async () => {
    await compareViewQuery({ name: 'orderBy' })
  })
})
