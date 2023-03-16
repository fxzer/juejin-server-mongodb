const express = require('express')
const morgan = require('morgan')
const router = require('./router')
const cors = require('cors')



const errs = require('./middleware/errs')
const succ = require('./middleware/succ')
const errorHandler = require('./middleware/error-handler')
require('./model')
const app = express()
app.use(morgan('dev'))
app.use(cors())
//错误处理中间件
app.use(errs)
//成功处理中间件
app.use(succ)
app.use(express.json())
app.use(express.urlencoded({type:'application/x-www-form-urlencoded'}))
const PORT = process.env.PORT || 5000
//挂载路由
app.use('/api',router)

//统一错误处理
app.use(errorHandler())
 // 解析请求体
app.use(express.urlencoded({extended:false}))

app.listen(PORT,()=>{
 console.log(`server running 127.0.0.1:5000`);
})