/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import fs = require('fs')
import path = require('path')
import config = require('config')
import { type Request, type Response, type NextFunction } from 'express'

function serveWellKnown () {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = req.params.file

    if (!file.includes('/')) {
      const pathResolved = path.resolve('.well-known/csaf', file);
      if (pathResolved.endsWith('/.well-known/csaf/package-metadata.json')) {
        const fileContent = fs.readFileSync(pathResolved, 'utf8')
        res.setHeader('Content-Type', 'application/json')
        const baseUrl = config.get<string>('server.baseUrl')
        res.send(fileContent.replace('http://localhost:3000', baseUrl))
      } else {
        res.sendFile(pathResolved)
      }
    } else {
      res.status(403)
      next(new Error('File names cannot contain forward slashes!'))
    }
  }
}
module.exports = serveWellKnown
