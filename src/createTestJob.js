import { db } from "./firebaseConfig.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";

async function createTestJob() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const jobData = {
      customerId: "test-customer-123",
      customerName: "Test Customer",
      status: "pending",
      pickupLocation: {
        address: "123 Farm Road, Rural County, TX",
        coordinates: {
          lat: 30.267153,
          lng: -97.743057
        }
      },
      dropoffLocation: {
        address: "456 Ranch Avenue, Countryside, TX",
        coordinates: {
          lat: 29.951065,
          lng: -95.369804
        }
      },
      pickupTime: Timestamp.fromDate(tomorrow),
      estimatedDistance: 35.7,
      estimatedDuration: 55, // minutes
      price: 420.50,
      livestockDetails: {
        type: "Cattle",
        quantity: 8,
        weight: 3200,
        specialRequirements: "Animals need water access during transport. Handle with care."
      },
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, "jobs"), jobData);
    console.log("✅ Test job created successfully with ID:", docRef.id);
    console.log("You can now log in as a transporter to view this job.");
    
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating test job:", error);
  }
}

createTestJob();