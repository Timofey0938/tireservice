import { Router } from 'express'
import mysql from 'mysql2'

const router = Router()
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tireservice'
})

router.get('/', (req, res) => {
  db.query(`
    SELECT * FROM standart;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

router.post('/add', (req, res) => {
  db.query(`
    INSERT INTO standart (name)
    VALUES ('${req.body.name}');`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

router.put('/update', (req, res) => {
  db.query(`UPDATE standart SET name = '${req.body.name}' WHERE id = ${req.body.id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

router.delete('/delete/:id', (req, res) => {
  db.query(`DELETE FROM standart WHERE id = ${req.params.id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router