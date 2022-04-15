const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();
const patients = require("../model/patients");
const encounters = require("../model/encounters");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!("query" in req.body)) {
      query = {};
    } else {
      query = req.body.query;
    }
    if (!("limit" in req.body)) {
      limitQuery = 10;
    } else {
      limitQuery = req.body.limit;
    }
    if (!("collection" in req.body)) {
      res.status(200).json({
        message: "Collection not requested!",
      });
    }
    collection = req.body.collection;
    if (!("fields" in req.body)) {
      fields = { _id: 0 };
    } else {
      fields = req.body.fields;
    }
    if(collection === "patients"){
      queryCollection = patients
    }
    else if(collection === "encounters"){
      queryCollection = encounters
    }
    const result = await queryCollection.find(query, fields).limit(limitQuery);
    res.status(200).json({
      result: result,
    });
  })
);

module.exports = router;
