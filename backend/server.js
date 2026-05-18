import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options(/.*/, cors());

let ads = [
  { 
    id: "1", 
    title: "Куплю книгу з дискретної математики", 
    category: "Навчання", 
    body: "Шукаю підручник у хорошому стані.", 
    author: "Ігор", 
    createdAt: new Date().toLocaleString() 
  }
];

const router = express.Router();

router.get("/ads", (req, res) => {
  res.json(ads);
});

router.post("/ads", (req, res) => {
  const { title, category, body, author } = req.body;
  if (!title || !category || !body) {
    return res.status(400).json({ status: 400, message: "Заповніть обов'язкові поля" });
  }
  const newAd = { 
    id: Date.now().toString(), 
    title, category, body, 
    author: author || "Анонім", 
    createdAt: new Date().toLocaleString() 
  };
  ads.push(newAd);
  res.status(201).json(newAd);
});

router.delete("/ads/:id", (req, res) => {
  const initialLength = ads.length;
  ads = ads.filter(a => a.id !== req.params.id);
  
  if (ads.length === initialLength) {
    return res.status(404).json({ status: 404, message: "Оголошення не знайдено" });
  }
  res.status(204).send(); 
});

router.get("/error500", (req, res) => {
  res.status(500).json({ status: 500, message: "Бекенд впав (тестова помилка)" });
});

app.use("/api/v1", router);

app.listen(3000, () => {
  console.log("Бекенд запущено на http://localhost:3000");
});