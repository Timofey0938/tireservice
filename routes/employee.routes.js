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
    SELECT employee.id, employee.last_name, employee.first_name, employee.middle_name,
      employee.birth_date, post.name as post, employee.work_experience, employee.wage,
      employee.phone_number, passport.number as passport_number
    FROM employee JOIN post
      ON employee.post_id = post.id
    JOIN passport
      ON employee.passport_id = passport.id;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      result.map(line => {
        line.birth_date = moment(new Date(line.birth_date)).format('DD.MM.YYYY')
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
  const birth_date = req.body.birth_date
  const post_id = req.body.post_id
  const work_experience = req.body.work_experience
  const wage = req.body.wage
  const phone_number = formatPhoneNumber(req.body.phone_number)
  const passport_number = req.body.passport_number

  db.query(`
    INSERT INTO employee (last_name, first_name, middle_name, birth_date, post_id,
      work_experience, wage, phone_number, passport_number)
    VALUES ('${last_name}', '${first_name}', '${middle_name}', '${birth_date}', '${post_id}',
    '${work_experience}', '${wage}', ${phone_number}, ${passport_number});`,
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
  const birth_date = req.body.birth_date
  const post_id = req.body.post_id
  const work_experience = req.body.work_experience
  const wage = req.body.wage
  const phone_number = formatPhoneNumber(req.body.phone_number)
  const passport_number = req.body.passport_number

  db.query(`
    UPDATE employee SET last_name = '${last_name}', first_name = '${first_name}', middle_name = '${middle_name}', 
    birth_date = '${birth_date}', post_id = '${post_id}', work_experience = '${work_experience}', wage = '${wage}', 
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

  db.query(`DELETE FROM employee WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router