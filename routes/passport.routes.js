import { Router } from 'express'
import mysql from 'mysql2'
import moment from 'moment'

const router = Router()
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tireservice'
})

router.get('/', (req, res) => {
  db.query(`
    SELECT passport.id, passport.number, passport.issued_by, passport.issue_date,
      passport.department_code, passport.registration_adress_id
    FROM passport;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      result.map(line => {
        line.issue_date = moment(new Date(line.issue_date)).format('DD.MM.YYYY')
      })
      res.send(result)
    }
  })
})

router.post('/add', (req, res) => {
  const number = req.body.number
  const issued_by = req.body.issued_by
  const issue_date = req.body.issue_date
  const department_code = req.body.department_code
  const registration_adress_id = req.body.registration_adress_id

  db.query(`
    INSERT INTO passport (number, issued_by, issue_date, department_code, registration_adress_id,
      work_experience, wage, phone_number, passport_number)
    VALUES ('${number}', '${issued_by}', '${issue_date}', '${department_code}', '${registration_adress_id}';`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

router.put('/update', (req, res) => {
  const number = req.body.number
  const issued_by = req.body.issued_by
  const issue_date = req.body.issue_date
  const department_code = req.body.department_code
  const registration_adress_id = req.body.registration_adress_id

  db.query(`
    UPDATE passport SET number = '${number}', issued_by = '${issued_by}', issue_date = '${issue_date}', 
    department_code = '${department_code}', registration_adress_id = '${registration_adress_id}'
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

  db.query(`DELETE FROM passport WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router