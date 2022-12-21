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
    SELECT car.id, car.vin, car.sts_number, sts.registration_mark, sts.release_year, sts.engine_number,
     color.name as color, brand.name as brand, model.name as model, car.owner FROM car
    JOIN sts ON car.sts_number = sts.number
    JOIN color ON sts.color_id = color.id
    JOIN model ON sts.model_id = model.id
    JOIN brand ON model.brand_id = brand.id;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

router.post('/add', (req, res) => {
  let id
  console.log('id: ', id)
  db.query(`
    INSERT INTO sts (number, registration_mark, release_year, engine_number, color_id, model_id)
    VALUES ('${req.body.sts_number}', '${req.body.registration_mark}', '${req.body.release_year}',
    '${req.body.engine_number}', (
      SELECT color.id
      FROM color
      WHERE color.name = '${req.body.color}'
    ), (
      SELECT model.id
      FROM model
      WHERE model.name = '${req.body.model}'
    ));`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.send(result)
      }
  })

  db.query(`
    INSERT INTO car (vin, sts_number)
    VALUES ('${req.body.vin}', '${req.body.sts_number}');`,
    (err, result) => {
      if (err) {
        console.log(err)
      }
  })
})

router.put('/update', (req, res) => {
  db.query(`
    UPDATE car SET vin = '${req.body.vin}', sts_number = ${req.body.sts_number}
    WHERE id = ${req.body.id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      }
  })

   db.query(`
    UPDATE sts SET number = '${req.body.sts_number}', registration_mark = '${req.body.registration_mark}',
      release_year = '${req.body.release_year}', engine_number = '${req.body.engine_number}', color_id = (
      SELECT color.id
      FROM color
      WHERE color.name = '${req.body.color}'
    ), model_id = (
      SELECT model.id
      FROM model
      WHERE model.name = '${req.body.model}'
    );`,
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
  db.query(`DELETE FROM car WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router