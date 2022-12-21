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
    SELECT equipment.id, equipment.name, equipment.factory_number, equipment.inventory_number,
      equipment.release_date, equipment.commissioning_date, equipment.last_maintenance_date,
      equipment.next_maintenance_date, manufacturer.name as manufacturer_name,
      equipment_category.name as category_name, equipment.certificate_number
    FROM equipment JOIN equipment_category
    ON equipment.category_id = equipment_category.id
    JOIN manufacturer
    ON equipment.manufacturer_id = manufacturer.id;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      result.map(line => {
        line.release_date = moment(new Date(line.release_date)).format('DD.MM.YYYY')
        line.commissioning_date = moment(new Date(line.commissioning_date)).format('DD.MM.YYYY')
        line.last_maintenance_date = line.last_maintenance_date ?
          moment(new Date(line.last_maintenance_date)).format('DD.MM.YYYY') : '-'
        line.next_maintenance_date = moment(new Date(line.next_maintenance_date)).format('DD.MM.YYYY')
      })
      res.send(result)
    }
  })
})

router.post('/add', (req, res) => {
  console.log('adding in back')
  const name = req.body.name
  const factory_number = req.body.factory_number
  const inventory_number = req.body.inventory_number
  const release_date = req.body.release_date
  const commissioning_date = req.body.commissioning_date
  const last_maintenance_date = req.body.last_maintenance_date
  const next_maintenance_date = req.body.next_maintenance_date
  const manufacturer_id = req.body.manufacturer_id
  const category_id = req.body.category_id
  const certificate_number = req.body.certificate_number

  db.query(`
    INSERT INTO equipment
      (name, factory_number, inventory_number, release_date, commissioning_date,
      last_maintenance_date, next_maintenance_date, manufacturer_id, category_id, certificate_number)
    VALUES ('${name}', '${factory_number}', '${inventory_number}', '${release_date}', '${commissioning_date}',
      '${last_maintenance_date}', '${next_maintenance_date}', ${manufacturer_id},
      ${category_id},'${certificate_number}');`,
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
  db.query(`UPDATE equipment SET name = '${name}' WHERE id = ${id};`,
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
  db.query(`DELETE FROM equipment WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router