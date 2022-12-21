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
    SELECT service.id, service.name, equipment.name as equipment_name FROM service
      JOIN service_has_equipment ON service.id = service_has_equipment.service_id
      JOIN equipment ON service_has_equipment.equipment_id = equipment.id;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      const services = []
      result.forEach(line => {
        if (services.find(service => service.id === line.id)) {
          services.forEach(service => {
            if (service.id === line.id) {
              service.equipments.push(line.equipment_name)
            }
          })
        } else {
          services.push({ id: line.id, name: line.name, equipments: [line.equipment_name]})
        }
      })
      console.log(services)
      res.send(services)
    }
  })
})

router.post('/add', (req, res) => {
  const name = req.body.name
  db.query(`INSERT INTO service (name) VALUES ('${name}');`,
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
  db.query(`UPDATE service SET name = '${name}';`,
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
  db.query(`DELETE FROM service WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
  })
})

export default router