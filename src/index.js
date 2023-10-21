const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const bootstrap = () => {
	const app = express();

	app.listen(PORT, () => {
		console.log(`Server listening at http://localhost:${PORT}`);
	});
};

bootstrap();
