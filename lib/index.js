'use strict'

const { BosClient } = require('@baiducloud/sdk')

const trimParam = (str) => (typeof str === 'string' ? str.trim() : undefined)

module.exports = {
  provider: 'baidu-cloud-bos',
  name: 'Baidu Cloud Object Storage Service',
  auth: {
    ak: {
      label: 'AccessKey',
      type: 'text',
    },
    sk: {
      label: 'SecretAccessKey',
      type: 'text',
    },
    region: {
      label: 'Region',
      type: 'enum',
      values: ['bj.bcebos.com'],
    },
    bucket: {
      label: 'Bucket',
      type: 'text',
    },
  },
  init: (config) => {
    const { bucket, region } = config
    const client = new BosClient({
      endpoint: trimParam(region), //传入Bucket所在区域域名
      credentials: {
        ak: trimParam(config.ak), //您的AccessKey
        sk: trimParam(config.sk), //您的SecretAccessKey
      },
    })

    return {
      upload: (file) => {
        const path = file.path ? `${file.path}/` : ''
        return client.putObject(
          trimParam(bucket),
          `${path}${file.hash}${file.ext}`,
          new Buffer(file.buffer, 'binary')
        )
      },
      delete: (file) => {
        const path = file.path ? `${file.path}/` : ''
        return client.deleteObject(
          trimParam(bucket),
          `${path}${file.hash}${file.ext}`
        )
      },
    }
  },
}
