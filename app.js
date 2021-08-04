const express = require(`express`);
const mongoose = require(`mongoose`);
const routes = require('./routes');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));

mongoose.connect(process.env.MONGODBURL || `mongodb://localhost/budgettracker`, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

app.use(routes);

// simple route
app.get("/", (req, res) => {
	res.sendFile('./public/index.html', { root: __dirname });
});

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
