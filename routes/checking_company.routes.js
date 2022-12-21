import { Router } from 'express'
import mysql from 'mysql2'
import { formatPhoneNumber } from '../formatters.js'

const router = Router()
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tireservice'
})

router.get('/', (req, res) => {
  db.query(`SELECT * FROM checking_company;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      result.map(line => {
        line.phone_number = `+7${line.phone_number}`
      })
      res.send(result)
    }
  })
})

router.post('/add', (req, res) => {
  db.query(`
    INSERT INTO checking_company (name, adress_id, phone_number)
    VALUES ('${req.body.name}', ${req.body.adress_id}, '${formatPhoneNumber(req.body.phone_number)}');`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

router.put('/update', (req, res) => {
  db.query(`
    UPDATE checking_company
    SET name = '${req.body.name}', adress_id = '${req.body.adress_id}',
      phone_number = '${formatPhoneNumber(req.body.phone_number)}'
    WHERE id = ${req.body.id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

router.delete('/delete/:id', (req, res) => {
  db.query(`DELETE FROM checking_company WHERE id = ${req.params.id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router