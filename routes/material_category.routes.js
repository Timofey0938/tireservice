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
  db.query(`SELECT id, name FROM material_category`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

router.post('/add', (req, res) => {
  const name = req.body.name
  console.log('adding', name)
  db.query(`INSERT INTO material_category (name) VALUES ('${name}')`,
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
  db.query(`UPDATE material_category SET name = '${name}' WHERE id = ${id};`,
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
  db.query(`DELETE FROM material_category WHERE id = ${id};`,
  (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router