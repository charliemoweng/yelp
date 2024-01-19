import 'dotenv/config'
import query from "./db/index.js"
import express from "express"
import morgan from "morgan" // HTTP request logger middleware (3rd party middleware)
// const db = require("./db");
// const express = require("express");
// const morgan = require('morgan');

const app = express();

app.use(morgan("tiny"));

app.use(express.json()); // need to use this to get req.body

// the middleware, between the requests and the route handlers
// define the middleware at the top
// can create as many middleware as you want
app.use((req, res, next) => {
    // console.log("the middleware");
    next();
});

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    const results = await query('SELECT * FROM restaurants');
    // console.log(results);
    res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: {
            restaurants: results.rows,
        },
    });
});

// Get one restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
    const results = await query('SELECT * FROM restaurants WHERE id = $1', [req.params.id]);
    // console.log(req.params);
    res.status(200).json({
        status: "success",
        data: {
            restaurant: results.rows[0],
        },
    });
});

// Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    const results = await query(
        'INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *', 
        [req.body.name, req.body.location, req.body.price_range]
    );
    // console.log(results);
    res.status(201).json({
        status: "success",
        data: {
            restaurant: results.rows[0],
        },
    });
});

// Update a restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
    const results = await query(
        'UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *',
        [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    // console.log(req.params.id);
    // console.log(req.body);
    res.status(200).json({
        status: "success",
        data: {
            restaurant: results.rows[0],
        },
    });
});

// Delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    const results = await query('DELETE FROM restaurants WHERE id = $1', [req.params.id]);
    res.status(204).json({
        status: "success",
    });
});


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});
