import { config } from "dotenv";
config();

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import http from "http";
import { app } from "./app";
import cors from "cors";

import authRoutes from './routes/AuthRoutes';
import devocionalRoutes from "./routes/DevocionalRoutes";
import readPlanRoutes from "./routes/ReadPlanRoutes";
import quizRoutes from "./routes/QuizRoutes";

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));

// Middlewares gerais
app.use(cookieParser());
app.use(compression());

// 👉 Body-parser só para rotas que **não usam FormData**
app.use('/auth', bodyParser.json(), bodyParser.urlencoded({ extended: true }), authRoutes);

// 👉 Rotas com upload (usam multer): **não aplicar bodyParser**
app.use('/devocional', devocionalRoutes);

app.use('/quiz', quizRoutes);
app.use('/read-plan', readPlanRoutes);

const server = http.createServer(app);

server.listen(process.env.PORT || 3333, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3333}`);
});
