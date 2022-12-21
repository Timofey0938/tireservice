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
    SELECT order.id, order.number, order.open_datetime, order.close_datetime, order.ready_date,
    order.car_issue_date, order.total_cost, client.last_name as client_last_name, client.first_name as
    client_first_name, client.middle_name as client_middle_name, client.phone_number as client_phone_number,
    passport.number as client_passport_number, car.vin as car_vin, car.sts_number as car_sts_number,
    sts.registration_mark as car_registration_mark, sts.release_year as car_release_year, sts.engine_number
    as car_engine_number, color.name as car_color, brand.name as car_brand, model.name as car_model FROM \`order\`
    JOIN client ON order.client_id = client.id
    JOIN passport ON client.passport_id = passport.id
    JOIN car ON order.car_id = car.id
    JOIN sts ON car.sts_number = sts.number
    JOIN color ON sts.color_id = color.id
    JOIN model ON sts.model_id = model.id
    JOIN brand ON model.brand_id = brand.id;`, 
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      result.map(line => {
        line.open_datetime = moment(new Date(line.open_datetime)).format('DD.MM.YYYY, H:mm:ss')
        line.close_datetime = moment(new Date(line.close_datetime)).format('DD.MM.YYYY, H:mm:ss')
        line.ready_date = moment(new Date(line.ready_date)).format('DD.MM.YYYY')
        line.car_issue_date = moment(new Date(line.car_issue_date)).format('DD.MM.YYYY')
      })
      res.send(result)
    }
  })
})

router.post('/add', (req, res) => {
  const number = req.body.number

  db.query(`
    INSERT INTO \`order\` (number)
    VALUES ('${number}');`,
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
  const number = req.body.number

  db.query(`
    UPDATE passport SET number = '${number}'
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

  db.query(`DELETE FROM \`order\` WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router