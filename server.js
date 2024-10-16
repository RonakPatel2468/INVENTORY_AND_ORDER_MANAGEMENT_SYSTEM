const app = require('./app');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send(`
        <center>
            <h1>Welcome to the Inventory-Order-Management-System!</h1>
            <br>
            <p>
                Get INVENTORY_AND_ORDER_MANAGEMENT_SYSTEM: 
            <a href="https://github.com/RonakPatel2468/INVENTORY_AND_ORDER_MANAGEMENT_SYSTEM.git" target="_blank">Repository:INVENTORY_AND_ORDER_MANAGEMENT_SYSTEM </a>
            </p>
        </center>
    `);
  }); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
