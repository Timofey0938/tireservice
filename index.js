import express from 'express'
import cors from 'cors'

import materialRoutes from './routes/material.routes.js'
import materialCategoryRoutes from './routes/material_category.routes.js'
import serviceRoutes from './routes/service.routes.js'
import equipmentRoutes from './routes/equipment.routes.js'
import equipmentCategoryRoutes from './routes/equipment_category.routes.js'
import manufacturerRoutes from './routes/manufacturer.routes.js'
import certificateRoutes from './routes/certificate.routes.js'
import standartRoutes from './routes/standart.routes.js'
import checkingCompanyRoutes from './routes/checking_company.routes.js'
import employeeRoutes from './routes/employee.routes.js'
import postRoutes from './routes/post.routes.js'
import passportRoutes from './routes/passport.routes.js'

import orderRoutes from './routes/order.routes.js'
import clientRoutes from './routes/client.routes.js'
import carRoutes from './routes/car.routes.js'
import stsRoutes from './routes/sts.routes.js'
import colorRoutes from './routes/color.routes.js'
import brandRoutes from './routes/brand.routes.js'
import modelRoutes from './routes/model.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/material', materialRoutes)
app.use('/material_category', materialCategoryRoutes)
app.use('/service', serviceRoutes)
app.use('/equipment', equipmentRoutes)
app.use('/equipment_category', equipmentCategoryRoutes)
app.use('/manufacturer', manufacturerRoutes)
app.use('/certificate', certificateRoutes)
app.use('/standart', standartRoutes)
app.use('/checking_company', checkingCompanyRoutes)
app.use('/employee', employeeRoutes)
app.use('/post', postRoutes)
app.use('/passport', passportRoutes)

app.use('/order', orderRoutes)
app.use('/client', clientRoutes)
app.use('/car', carRoutes)
app.use('/sts', stsRoutes)
app.use('/color', colorRoutes)
app.use('/brand', brandRoutes)
app.use('/model', modelRoutes)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`listening on port ${port}...`)
})