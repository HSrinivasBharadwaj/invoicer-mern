const express = require("express");
const ValidateToken = require("../middleware/validateToken");
const { ValidateClientSignUpData } = require("../utils/validate");
const client = require("../models/client");
const clientRouter = express.Router();

//Create Client
clientRouter.post("/create/client", ValidateToken, async (req, res) => {
  try {
    ValidateClientSignUpData(req.body);
    const loggedInUser = req.user;
    const { name, email, phone, address } = req.body;
    const newClient = new client({
      user: loggedInUser._id,
      name,
      email,
      phone,
      address,
    });
    await newClient.save();
    return res.status(201).json({
      message: "Client created successfully",
      client: newClient,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get All the Clients
clientRouter.get("/view/client", ValidateToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const getAllClients = await client.find({ user: loggedInUser._id });
    return res.status(200).json({ user: getAllClients });
  } catch (error) {
    console.log("Error fetching clients:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Client By Id
clientRouter.get("/view/client/:id", ValidateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user;
    //Check whether Client with id exists in db
    const Client = await client.findById(id);
    if (!Client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }
    //Check the ownership whether he is the loggedinuser
    if (loggedInUser._id.toString() !== Client.user.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this client",
      });
    }
    //Return client data
    return res.status(200).json({ Client: Client });
  } catch (error) {
    console.error("Error fetching client:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//Delete Client
clientRouter.delete("/delete/client/:id", ValidateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user;
    //Check whether the client exists in db
    const Client = await client.findById(id);
    if (!Client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }
    //Check the ownership
    if (loggedInUser._id.toString() !== Client.user.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this client",
      });
    }
    const deletedClient = await client.findByIdAndDelete({
      _id: id,
      user: loggedInUser.id,
    });
    if (!deletedClient) {
      return res
        .status(404)
        .json({ message: "Client not found or not owned by you" });
    }
    return res
      .status(200)
      .json({ message: "User deleted successfully", client: deletedClient });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Update Client By Id
clientRouter.patch("/update/client/:id", ValidateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user;
    const { name, email, phone, address } = req.body;
    const foundClient = await client.findById(id);
    if (!foundClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }
    if (loggedInUser._id.toString() !== foundClient.user.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this client",
      });
    }
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = name;
    if (req.body.email !== undefined) updateData.email = email;
    if (req.body.phone !== undefined) updateData.phone = phone;
    if (req.body.address !== undefined) updateData.address = address;
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        message: "No changes provided",
        client: foundClient,
      });
    }
    const updatedClient = await client.findByIdAndUpdate(
      id,
      { $set: updateData },           
      { new: true, runValidators: true } 
    );
    return res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = clientRouter;
