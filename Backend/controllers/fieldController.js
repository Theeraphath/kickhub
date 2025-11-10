const Field = require("../models/Field");
const Reservation = require("../models/Reservation");

const addField = async (fieldData) => {
  try {
    const newField = new Field(fieldData);
    const savedField = await newField.save();
    return { success: true, data: savedField };
  } catch (error) {
    console.error("Error adding field:", error);
    return { success: false, error };
  }
};

const getAllFields = async () => {
  try {
    const fields = await Field.find();
    return { success: true, data: fields };
  } catch (error) {
    console.error("Error fetching fields:", error);
    return { error };
  }
};

const getFieldbyownerID = async (id) => {
  try {
    const fields = await Field.find({ owner_id: id });
    return { success: true, data: fields };
  } catch (error) {
    console.error("Error fetching fields:", error);
    return { success: false, error };
  }
};

const getFieldbyID = async (id) => {
  try {
    const fields = await Field.findById(id);
    return { success: true, data: fields };
  } catch (error) {
    console.error("Error fetching fields:", error);
    return { success: false, error };
  }
};

const updateField = async (id, fieldData) => {
  try {
    const updatedField = await Field.findByIdAndUpdate(id, fieldData, {
      new: true,
    });
    return { success: true, data: updatedField };
  } catch (error) {
    console.error("Error updating field:", error);
    return { success: false, error };
  }
};

const deleteField = async (id) => {
  try {
    const deletedField = await Field.findByIdAndDelete(id);
    return { success: true, data: deletedField };
  } catch (error) {
    console.error("Error deleting field:", error);
    return { success: false, error };
  }
};

const getFieldbyFreetime = async (startdate, enddate) => {
  try {
    const start = new Date(startdate);
    const end = new Date(enddate);
    const reservedFields = await Reservation.find({
      $and: [
        { start_datetime: { $lt: end } },
        { end_datetime: { $gt: start } },
      ],
    }).distinct("field_id");

    const availableFieldsDetails = await Field.find({
      _id: { $nin: reservedFields },
    });

    return { success: true, data: availableFieldsDetails };
  } catch (error) {
    console.error("Error fetching fields:", error);
    return { success: false, error };
  }
};

module.exports = {
  addField,
  getAllFields,
  updateField,
  deleteField,
  getFieldbyownerID,
  getFieldbyID,
  getFieldbyFreetime,
};
