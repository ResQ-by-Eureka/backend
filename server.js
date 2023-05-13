const app = require("express")();
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send(`Welcome to Salva`);
});

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
