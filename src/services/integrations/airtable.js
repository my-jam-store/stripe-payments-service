const airtable = require('airtable')

const base = baseInit()

function baseInit() {
  return new airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_ID)
}

function createRecord(table, data, callback = defaultCallback) {
  return base(table).create(data, callback)
}

async function list(table, selectParams = {}) {
  return await tableSelect(table, selectParams).all()
}

function updateRecord(table, recordId, data, callback = defaultCallback) {
  return base(table).update(recordId, data, callback)
}

function deleteRecords(table, recordsIds, callback = defaultCallback) {
  base(table).destroy(recordsIds, callback)
}

function defaultCallback(err, record) {
  if (err) {
    console.error(err)
  }
}

function tableSelect(table, params = {}) {
  const selectParams = {}

  if (params.view) {
    selectParams.view = params.view
  }

  if (params.fields) {
    selectParams.fields = params.fields
  }

  if (params.filter) {
    selectParams.filterByFormula = params.filter
  }

  if (params.maxRecords) {
    selectParams.maxRecords = params.maxRecords
  }

  return base(table).select(selectParams)
}

module.exports = {
  createRecord,
  list,
  updateRecord,
  deleteRecords
}
