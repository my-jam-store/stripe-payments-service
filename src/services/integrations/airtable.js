const airtable = require('airtable')

const recordsInsertLimit = 10
const chunksInsertDelay = 1000
const base = baseInit()

function baseInit() {
  return new airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_ID)
}

async function createRecord(table, data, callback = defaultCallback) {
  if (!isInsertProcessRecordsAboveLimit(data)) {
    return base(table).create(data, callback)
  }

  const chunks = insertProcessRecordsChunks(data)

  for (let i = 0; i < chunks.length; i++) {
    base(table).create(chunks[i], callback)

    if (chunks[i + 1]) {
      await insertProcessChunksDelay()
    }
  }
}

async function list(table, selectParams = {}) {
  return await tableSelect(table, selectParams).all()
}

async function updateRecord(table, recordId, data, callback = defaultCallback) {
  if (!isInsertProcessRecordsAboveLimit(data)) {
    return base(table).update(recordId, data, callback)
  }

  const chunks = insertProcessRecordsChunks(data)

  for (let i = 0; i < chunks.length; i++) {
    base(table).update(recordId, chunks[i], callback)

    if (chunks[i + 1]) {
      await insertProcessChunksDelay()
    }
  }
}

function deleteRecords(table, recordsIds, callback = defaultCallback) {
  base(table).destroy(recordsIds, callback)
}

function insertProcessRecordsChunks(array) {
  const chunks = []
  let chunkSize = recordsInsertLimit < 1 ? 1 : recordsInsertLimit

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }

  return chunks
}

function isInsertProcessRecordsAboveLimit(data) {
  return Array.isArray(data) && data.length > recordsInsertLimit
}

function insertProcessChunksDelay() {
  return new Promise(resolve => {
    setTimeout(resolve, chunksInsertDelay)
  })
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
