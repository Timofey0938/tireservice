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
  db.query(`SELECT * FROM manufacturer;`,
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
  const name = req.body.name
  const phone_number = formatPhoneNumber(req.body.phone_number)
  const adress_id = req.body.adress_id

  db.query(`
    INSERT INTO manufacturer (name, adress_id, phone_number)
    VALUES ('${name}', ${adress_id}, '${phone_number}');`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

router.put('/update', (req, res) => {
  const id = req.body.id
  const name = req.body.name
  const phone_number = formatPhoneNumber(req.body.phone_number)
  const adress_id = req.body.adress_id
  db.query(`
    UPDATE manufacturer
    SET name = '${name}', adress_id = '${adress_id}', phone_number = '${phone_number}'
    WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  db.query(`DELETE FROM manufacturer WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router