import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  // First argument: Configuration object containing id and triggers
  {
    id: "sync-user-from-clerk",
    event: "clerk/user.created" // Triggers go here
  },
  // Second argument: The actual handler function
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`.trim(),
      image: image_url,
    };

    await User.create(userData);
  }
);

// Inngest function to delete user to a database
const syncUserDeletion = inngest.createFunction(
  // Argument 1: Config object
  { id: "delete-user-with-clerk",
    event: "clerk/user.deleted"
  },
  // Argument 3: The Handler function
  async ({ event, step }) => {
    const { id } = event.data;

    await step.run("delete-from-db", async () => {
      await User.findByIdAndDelete(id);
    });
  }
);

// Inngest function to update user data to a database
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-with-clerk", // ID must be a string
    event: "clerk/user.updated"   // Trigger belongs inside this object
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData);
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
];

// om vercel at 5:05:05