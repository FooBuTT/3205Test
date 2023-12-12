import { Request, Response, Router } from "express";
import delay from "delay";
import { BodyType } from "../types/ServerTypes.js";
const indexRouter:Router = Router();

const emailArr = [
  { email: "jim@gmail.com", number: "221122" },
  { email: "jam@gmail.com", number: "830347" },
  { email: "john@gmail.com", number: "221122" },
  { email: "jams@gmail.com", number: "349425" },
  { email: "jams@gmail.com", number: "141424" },
  { email: "jill@gmail.com", number: "822287" },
  { email: "jill@gmail.com", number: "822286" },
];

indexRouter.post("/", async (req: Request, res: Response) => {
  await delay(5000);
  const { email, number } = req.body as BodyType;
  const reNumber: string = number.replace(/-/g, "");

  const findEmail = emailArr.filter((item) => item.email === email);
  console.log(findEmail);
  if (findEmail.length === 0) {
    res.sendStatus(401);
  } else if (!findEmail.some((item) => item.number === reNumber)) {
    res.status(402).json(findEmail);
  } else {
    const oneEmail = findEmail.filter((item) => item.number === reNumber);
    res.json(oneEmail);
  }
});

export { indexRouter };
