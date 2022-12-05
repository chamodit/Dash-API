const userRouter = require("./user.routes");

const init = (app) => {
    app.use(userRouter);
};

module.exports = init;