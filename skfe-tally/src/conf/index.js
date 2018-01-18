 import AppConf from './app.conf.json'
import { clone } from 'ramda'
// const AppConf = require('./app.conf.json')
const conf = clone(AppConf)
console.log(conf)
if (process.ENV0 && typeof process.ENV0 === 'string') {
  let env = JSON.parse(process.ENV0)
  Object.keys(conf).forEach(key => {
    // only support simple arg name like 'npm_config_xxx'
    let nck = 'npm_config_' + key
    let v = env[nck]
    // cover config values if specified via cli args
    if (v) conf[key] = v
    console.log('aaa', conf)
  })
}

export default conf
