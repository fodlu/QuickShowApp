import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from 'stripe'

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
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        // creating line items for Stripe
        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancelUrl: `${origin}my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60 // expires in 3o minutes
        })

        booking.paymentLink = session.url;
        await booking.save();

        // Run inngest scheduler function to check payment status after 10 minutes
        await inngest.send({
            name: 'app/checkpayment',
            data: {
                bookingId: booking._id.toString()
            }
        })

        res.json({success: true, url: session.url})

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