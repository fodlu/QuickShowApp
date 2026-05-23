import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// function to check the availability of selected seats for a movie
const checkSeatAvailability = async (showId, selectedSeat) => {
    try {
        const showData = await Show.findById(showId);

        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeat.some(seat=> occupiedSeats[seat])

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {showId, selectedSeat} = req.body;
        const {origin} = req.headers;

        // check if the seat is available for the selected show
        const isAvailable = await checkSeatAvailability(showId, selectedSeat)

        if(!isAvailable) {
            return res.json({success: false, message: "Selected seats are not available"})
        }

        // Get show details
        const showData = await Show.findById(showId).populate('movie');

        // create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.price * selectedSeat.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat)=> {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        // stripe Gateway Initialize

        res.json({success: true, message: "Booked Successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get occupied seats data
export const getOccupiedSeats = async (req, res) => {
    try {
        const {showId} = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showsData.occupiedSeats)

        res.json({success: true, occupiedSeats})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}