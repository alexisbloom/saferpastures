import { db } from "./firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

async function addTransportRequest() {
  try {
    await addDoc(collection(db, "transportRequests"), {
      pickup: "Farm A",
      dropoff: "Farm B",
      animals: 10,
      status: "pending",
    });
    console.log("✅ Transport request added!");
  } catch (error) {
    console.error("❌ Error adding transport request:", error);
  }
}

addTransportRequest();