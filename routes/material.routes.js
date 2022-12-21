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
    SELECT material.id, material.name, material_category.name as category_name, material.quantity
    FROM material JOIN material_category
    ON material.category_id = material_category.id;`,
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
  const category_name = req.body.category_name
  const quantity = req.body.quantity

  db.query(`
    INSERT INTO material (name, category_id, quantity)
    VALUES ('${name}', (
      SELECT material_category.id
      FROM material_category
      WHERE material_category.name = '${category_name}'
    ), ${quantity});`,
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
  const category_name = req.body.category_name
  const quantity = req.body.quantity

  db.query(`
    UPDATE material SET name = '${name}', category_id = (
      SELECT material_category.id
      FROM material_category
      WHERE material_category.name = '${category_name}'
    ), quantity = ${quantity}
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
  db.query(`DELETE FROM material WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router