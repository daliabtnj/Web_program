// manage-request.js 
// Manage client requests
// url : http://localhost:3000

const express = require('express');
const cors = require('cors');
const router = express.Router();
const mysql = require('mysql2');

// Setup CORS
router.use(cors());

// Database connection setup
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "service_hub_db",
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database.");
    } else {
        console.log("Connected to the database.");
    }
});

// Fetch all service requests
router.get('/service-requests', (req, res) => {
    const query = "SELECT * FROM ServiceRequests";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching service requests:", err);
            return res.status(500).send("Could not fetch service requests.");
        }
        res.json(results);
    });
});

// Delete request due to cancellation (by clients and admins)
router.get("/delete-request/:id", (req, res) => {
    const { id } = req.params; // Extract service request ID from URL

    // Fetch service request details
    const fetchRequestSql = "SELECT * FROM ServiceRequests WHERE id = ?";
    db.query(fetchRequestSql, [id], (err, requestResult) => {
        if (err) {
            console.error(`Error fetching the service request with ID = ${id}`, err);
            return res.status(500).send(`Error fetching the service request with ID = ${id}`);
        }

        if (requestResult.length === 0) {
            return res.status(404).send(`No service request found with ID = ${id}`);
        }

        const request = requestResult[0]; // Extract service request details

        // Delete the service request
        const deleteRequestSql = "DELETE FROM ServiceRequests WHERE id = ?";
        db.query(deleteRequestSql, [id], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error(`Error deleting the service request with ID = ${id}`, deleteErr);
                return res.status(500).send(`Could not delete the service request with ID = ${id}`);
            }

            // Confirmation message
            res.send(`
                <html>
                    <body>
                        <h1>Service Request Deleted Successfully!</h1>
                    </body>
                </html>
            `);
        });
    });
});

// Update request status
router.put('/service-requests/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Log the status to see what is being received
    console.log('Received status:', status); // Debugging line

    // Validate the status input (it should be one of "Completed", "Booked", or "Pending")
    const validStatuses = ["Completed", "Booked", "Pending"];
    if (!validStatuses.includes(status)) {
        console.log('Invalid status:', status); // Debugging line
        return res.status(400).send("Invalid status.");
    }

    const query = `UPDATE ServiceRequests SET status = ? WHERE id = ?`;

    try {
        await db.promise().query(query, [status, id]);
        res.status(200).send("Status updated successfully!");
    } catch (err) {
        console.error("Error updating status:", err); // Log database errors
        res.status(500).send("Failed to update status.");
    }
});

// Export the router
module.exports = router;
