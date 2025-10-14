import express from "express";
import cors from "cors";
import forYou from "./routes/foryou.routes";
import summery from "./routes/summery.routes";

const app = express();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://reed-three.vercel.app",
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use("/foryou", forYou);
app.use("/summarize", summery);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});