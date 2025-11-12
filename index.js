process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

import express from 'express'
import './database/dbCon.js'
import { appError } from './src/utils/appError.js'
import jwt from 'jsonwebtoken'
import { globalError } from './src/middleware/globalError.js'
import userRouter from './src/modules/user/user.routes.js';
import User from './database/models/user.model.js';

const app = express()
const port = 3000

app.use(express.json())
app.use('/user',userRouter)


app.get('/verify/:token', async (req, res) => {
  jwt.verify(req.params.token, 'koko', async (err, payload) => {
    if (err) return res.json({ error: err.message });

      await User.findOneAndUpdate({ email: payload.email }, { confirmEmail: true });
      res.json({ message: "success", email: payload.email });
  });
});

app.use('*',(req,res,next)=>{
  next(new appError(`route not found ${req.originalUrl}`,404))
})

app.use(globalError)

process.on('unhandeledRejection',(err)=>{
   console.log('error',err)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))