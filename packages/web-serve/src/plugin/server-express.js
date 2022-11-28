import express from 'express'
import config from '../config/server'
import { makeHttpServer, makeHttpsServer } from './server-helps'

const app = express()
makeHttpServer(config.pro, app)
makeHttpsServer(config.pro, app)

app.get('/:name', (req, res) => {
    if (req.protocol === 'https') {
        res.send(`https:${req.params.name}`)
    } else {
        res.send(`http:${req.params.name}`)
    }
})
// https://www.cnblogs.com/Buggo/p/5508166.html
//  node --no-warnings --loader ./scr/lib/esm-loader.js  packages/web-serve/src/plugin/server-express.js
