const Reservation = require("../models/Reservation");
const Field = require("../models/Field");

const addReservation = async (fieldId, user_id, reservationData) => {
  try {
    const field = await Field.findById(fieldId);
    if (!field) {
      return { success: false, error: new Error("Field not found") };
    }

    const newReservation = new Reservation({
      field_id: fieldId,
      field_name: field.field_name,
      user_id,
      mobile_number: field.mobile_number,
      ...reservationData,
    });

    const savedReservation = await newReservation.save();

    return { success: true, data: savedReservation };
  } catch (error) {
    console.error("Error in addReservation:", error);
    return { success: false, error };
  }
};

const getAllReservations = async () => {
  try {
    const reservations = await Reservation.find();
    return { success: true, data: reservations };
  } catch (error) {
    return { success: false, error };
  }
};

const updateReservation = async (id, reservationData) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      reservationData,
      {
        new: true,
      }
    );
    return { success: true, data: updatedReservation };
  } catch (error) {
    return { success: false, error };
  }
};

const getReservationbyID = async (id) => {
  try {
    const reservation = await Reservation.findById(id);
    return { success: true, data: reservation };
  } catch (error) {
    return { success: false, error };
  }
};

const getReservationbyFieldID = async (id) => {
  try {
    const reservation = await Reservation.find({ field_id: id });
    return { success: true, data: reservation };
  } catch (error) {
    return { success: false, error };
  }
};

const getReservationbyUserID = async (id) => {
  try {
    const reservation = await Reservation.find({ user_id: id });
    return { success: true, data: reservation };
  } catch (error) {
    return { success: false, error };
  }
};

module.exports = {
  addReservation,
  getAllReservations,
  updateReservation,
  getReservationbyID,
  getReservationbyFieldID,
  getReservationbyUserID,
};
