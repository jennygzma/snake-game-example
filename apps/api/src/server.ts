import cors from "cors";
import express from "express";
import { gameRouter } from "./routes/gameRoutes";
import { themeRouter } from "./routes/themeRoutes";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());
app.use("/v1", gameRouter);
app.use("/v1", themeRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`api running on http://localhost:${port}`);
});
