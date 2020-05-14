'use strict'

const SPUT = require('../lib/index')

const config = {
  ak: '',
  sk: '',
  region: '',
  bucket: '',
}

const sput = SPUT.init(config)

const file = ''
sput.upload(file).then(() => {})

sput.delete(file).then(() => {})
