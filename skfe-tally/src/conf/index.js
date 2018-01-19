import { clone } from 'ramda'

let conf = {}
if (process.ENV0 && typeof process.ENV0 === 'object') {
  if (process.ENV0.NODE_ENV === 'production' || process.ENV0.NODE_ENV === '"production"') {
    conf = window.ENV0
    console.log('NODE_ENV IS PROD, from window.ENV0: ', conf)
  } else {
    require('./app.conf.js')
    conf = window.ENV0
    Object.keys(conf).forEach(key => {
      // only support simple arg name like 'npm_config_xxx'
      let nck = 'npm_config_' + key
      let v = process.ENV0[nck]
      // cover config values if specified via cli args
      if (v) conf[key] = v
    })
    console.log('NODE_ENV IS NOT PROD, after cli args merged: ', conf)
  }
}

export default conf
