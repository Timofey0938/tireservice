import { Router } from 'express'
import mysql from 'mysql2'
import moment from 'moment'
import { formatPhoneNumber } from '../formatters.js'

const router = Router()
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tireservice'
})

router.get('/', (req, res) => {
  db.query(`
    SELECT client.id, client.last_name, client.first_name, client.middle_name,
    client.phone_number, passport.number as passport_number, client.car
    FROM client JOIN passport
      ON client.passport_id = passport.id;`,
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
  const last_name = req.body.last_name
  const first_name = req.body.first_name
  const middle_name = req.body.middle_name
  const phone_number = formatPhoneNumber(req.body.phone_number)
  const passport_number = req.body.passport_number

  db.query(`
    INSERT INTO client (last_name, first_name, middle_name, phone_number, passport_number)
    VALUES ('${last_name}', '${first_name}', '${middle_name}', ${phone_number}, ${passport_number});`,
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
  const last_name = req.body.last_name
  const first_name = req.body.first_name
  const middle_name = req.body.middle_name
  const phone_number = formatPhoneNumber(req.body.phone_number)
  const passport_number = req.body.passport_number

  db.query(`
    UPDATE client SET last_name = '${last_name}', first_name = '${first_name}', middle_name = '${middle_name}', 
      phone_number = '${phone_number}', passport_number = '${passport_number}'
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

  db.query(`DELETE FROM client WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router