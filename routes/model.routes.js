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
    SELECT model.id, brand.name as brand_name, model.name
    FROM model JOIN brand ON model.brand_id = brand.id;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

router.get('/get_brand/:brand', (req, res) => {
  const brand = req.params.brand

  db.query(`
    SELECT model.id, brand.name as brand_name, model.name
    FROM model JOIN brand ON model.brand_id = brand.id
    WHERE brand.name = '${brand}';`,
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
  const brand_name = req.body.brand_name

  db.query(`
    INSERT INTO model (name, brand_id)
    VALUES ('${name}', (
      SELECT brand.id
      FROM brand
      WHERE brand.name = '${brand_name}'
    ));`,
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
  const brand_name = req.body.brand_name

  db.query(`
    UPDATE model SET name = '${name}', brand_id = (
      SELECT brand.id
      FROM brand
      WHERE brand.name = '${brand_name}'
    ) WHERE id = ${id};`,
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
  db.query(`DELETE FROM model WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router