const express = require("express");
const app = express();
const PORT = process.env.PORT || 8800;
const cors = require("cors");
const leadRoutes = require('./routes/leadRoute');
require("dotenv").config();
const path = require('path');

app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/, "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());

const connectDB = require("./config/database");
const { swaggerUi, specs } = require('./config/swagger');
const userRoutes = require("./routes/user");
const quotationRoutes = require("./routes/quotation.js");
const customerRoutes = require("./routes/customerRoute.js");
const prospectRoutes = require('./routes/prospect.js');
const invoiceRoutes = require('./routes/invoicesRoute.js')
const productRoutes = require('./routes/product.js');
const categoryRoutes = require('./routes/category.js');
const statusRoutes = require('./routes/status.js');
const orderRoutes = require('./routes/order.js');
const stageRoutes = require('./routes/prospectStage.js');
const purchaseRoutes = require('./routes/purchase.js');
const contactusRoutes = require('./routes/contactus.js');
const userActivityRoutes = require('./routes/userActivity.js');
const bankdetailRoutes= require("./routes/bankdetail.js");
const paymentRoutes = require('./routes/payment.js');
const userController = require("./controllers/user");

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from crm server" });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/user", userRoutes);
app.use("/api/quotation", quotationRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/prospect', prospectRoutes);
app.use('/api/invoice',invoiceRoutes);
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/stage', stageRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/contactus', contactusRoutes);
app.use('/api/userActivity', userActivityRoutes);
app.use('/api/bankdetail', bankdetailRoutes);
app.use('/api/payment', paymentRoutes);
connectDB()
  .then(() => {
    userController.createDefaultUsers();
    app.listen(PORT, () => {
      console.log(`Server start http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1);
  });
