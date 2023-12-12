import express from "express";
import cors from "cors";


import {indexRouter} from "./routes/indexRouter.js";




const app = express();
const port = process.env.SERVER_PORT || 3000;
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.locals.path = req.originalUrl;
  next();
});
app.use('/',indexRouter)

app.listen(port, () => console.log(`Server has started on PORT ${port}`));
