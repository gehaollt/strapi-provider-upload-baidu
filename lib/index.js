'use strict'

const { BosClient } = require('@baiducloud/sdk')

const trimParam = (str) => (typeof str === 'string' ? str.trim() : undefined)

module.exports = {
  provider: 'baidu',
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
    domain: {
      label: 'Domain',
      type: 'enum',
      values: ['bj.bcebos.com'],
    },
    bucket: {
      label: 'Bucket',
      type: 'text',
    },
  },
  init: (config) => {
    const { bucket, domain } = config
    const client = new BosClient({
      credentials: {
        ak: trimParam(config.ak), //您的AccessKey
        sk: trimParam(config.sk), //您的SecretAccessKey
      },
    })

    return {
      upload: (file) => {
        const path = file.path ? `${file.path}/` : ''
        return new Promise((resolve, reject) => {
          client
            .putObject(
              trimParam(bucket),
              `${path}${file.hash}${file.ext}`,
              new Buffer(file.buffer, 'binary')
            )
            .then((res) => {
              console.log(res)
              file.url = `https://${trimParam(domain) || `localhost`}/${path}${
                file.hash
              }${file.ext}`
              resolve()
            })
            .catch(reject)
        })
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
