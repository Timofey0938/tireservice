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
    SELECT certificate.id, certificate.number, certificate.start_date, certificate.end_date,
      standart.name as standart, checking_company. name as checking_company FROM certificate
    JOIN certificate_has_standart ON certificate.id = certificate_has_standart.certificate_id
    JOIN standart ON certificate_has_standart.standart_id = standart.id
    JOIN checking_company ON certificate.checking_company_id = checking_company.id;`,
    (err, result) => {
    if (err) {
      console.log(err)
    } else {
      result.map(line => {
        line.start_date = moment(new Date(line.start_date)).format('DD.MM.YYYY')
        line.end_date = moment(new Date(line.end_date)).format('DD.MM.YYYY')
      })

      console.log(result)

      const certificates = []
      result.forEach(line => {
        if (certificates.find(certificate => certificate.id === line.id)) {
          certificates.forEach(certificate => {
            if (certificate.id === line.id) {
              certificate.standarts.push(line.standart)
            }
          })
        } else {
          certificates.push({
            id: line.id,
            number: line.number,
            start_date: line.start_date,
            end_date: line.end_date,
            standarts: [line.standart],
            checking_company: line.checking_company
          })
        }
      })
      res.send(certificates)
    }
  })
})

router.post('/add', (req, res) => {
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