import 'dotenv/config';
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Restaurant from "./models/Restaurant.js";
import FoodItem from "./models/FoodItem.js";
import Order from "./models/Order.js";
import Payment from "./models/Payment.js";
import Review from "./models/Review.js";

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("🌱 Seeding database...");

    // Clear existing data (optional, uncomment if needed)
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    await Order.deleteMany();
    await Payment.deleteMany();
    await Review.deleteMany();

    // Hash password function
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Sample Users
    const hashedAdminPassword = await hashPassword("admin123");
    const hashedOwnerPassword = await hashPassword("owner123");
    const hashedCustomerPassword = await hashPassword("customer123");

    // Indian names for customers and owners
    const customerNames = [
      "Amit Sharma", "Priya Patel", "Rajesh Kumar", "Sunita Singh", "Vikram Gupta",
      "Anjali Desai", "Suresh Reddy", "Meera Joshi", "Arjun Nair", "Kavita Rao",
      "Ravi Verma", "Poonam Agarwal", "Deepak Yadav", "Sneha Kapoor", "Manoj Tiwari",
      "Rekha Mishra", "Anil Choudhary", "Kiran Saxena", "Vivek Pandey", "Neha Jain",
      "Sanjay Bhatia", "Preeti Malhotra", "Rohit Khanna", "Alka Sinha", "Nitin Chopra",
      "Rashmi Iyer", "Karan Gill", "Pallavi Roy", "Aditya Bose", "Shweta Das",
      "Rahul Mukherjee", "Divya Chatterjee", "Arun Pillai", "Lakshmi Menon", "Siddharth Nair",
      "Ananya Krishnan", "Vijayalakshmi Subramanian", "Karthik Venkatesan", "Padma Srinivasan", "Ganesh Balasubramanian",
      "Indira Raman", "Srinivasan Iyer", "Lalitha Krishnamurthy", "Raghavan Narayan", "Kamala Venkataraman",
      "Sundar Rajagopal", "Meenakshi Sundaram", "Ranganathan Krishnan", "Valliappan Chidambaram", "Saravanan Muthusamy"
    ];

    const restaurantOwnerNames = [
      "Rajendra Prasad", "Lakshmi Devi", "Suresh Babu", "Meera Bai", "Arjun Singh",
      "Priyanka Chopra", "Vikram Rathore", "Anjali Kumari", "Ravi Shankar", "Sunita Rani",
      "Mohan Lal", "Kavita Sharma", "Deepak Kumar", "Sneha Patel", "Nitin Verma",
      "Rekha Gupta", "Anil Yadav", "Kiran Joshi", "Vivek Agarwal", "Neha Tiwari"
    ];

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedAdminPassword,
        role: "admin",
        phone: "+91-9876543210",
        address: "Connaught Place, New Delhi",
        isActive: true,
      },
      // Restaurant Owners
      ...restaurantOwnerNames.map((name, index) => ({
        name,
        email: `owner${index + 1}@example.com`,
        password: hashedOwnerPassword,
        role: "restaurant",
        phone: `+91-98765432${10 + index}`,
        address: `${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][index % 5]}, India`,
        isActive: true,
      })),
      // Customers
      ...customerNames.map((name, index) => ({
        name,
        email: `customer${index + 1}@example.com`,
        password: hashedCustomerPassword,
        role: "customer",
        phone: `+91-98765432${20 + index}`,
        address: `${['Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Surat'][index % 5]}, India`,
        isActive: true,
        totalOrders: Math.floor(Math.random() * 5),
        totalSpent: Math.floor(Math.random() * 1000),
      })),
    ];

    const createdUsers = await User.insertMany(users);
    console.log("✅ Users seeded");

    // Sample Restaurants (20)
    const restaurantData = [
      { name: "Taj Mahal Restaurant", description: "Authentic Mughlai cuisine with royal flavors", address: "Gateway of India, Mumbai", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" },
      { name: "Spice Garden", description: "Fresh spices and traditional Indian dishes", address: "Connaught Place, Delhi", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400" },
      { name: "Biryani House", description: "World-famous Hyderabadi biryani", address: "Charminar, Hyderabad", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400" },
      { name: "South Indian Delight", description: "Dosas, idlis, and authentic South Indian food", address: "Marina Beach, Chennai", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" },
      { name: "Bengali Bites", description: "Traditional Bengali cuisine with fish and sweets", address: "Victoria Memorial, Kolkata", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
      { name: "Punjabi Tadka", description: "Rich Punjabi curries and tandoori dishes", address: "Golden Temple Road, Amritsar", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },
      { name: "Rajasthani Royals", description: "Royal Rajasthani thalis and desert cuisine", address: "City Palace, Jaipur", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400" },
      { name: "Kerala Spice", description: "Coconut-based Kerala delicacies", address: "Backwaters, Kochi", image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=400" },
      { name: "Maharaja's Kitchen", description: "Palace-style Indian food", address: "Mysore Palace, Mysore", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "Gujarati Ghar", description: "Sweet and savory Gujarati specialties", address: "Sabarmati Ashram, Ahmedabad", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400" },
      { name: "Goan Feast", description: "Portuguese-influenced Goan cuisine", address: "Baga Beach, Goa", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?w=400" },
      { name: "Assamese Aromas", description: "Unique Assamese flavors", address: "Kaziranga National Park, Assam", image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400" },
      { name: "Bihari Bhog", description: "Traditional Bihari dishes", address: "Bodh Gaya, Bihar", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400" },
      { name: "Odia Oasis", description: "Coastal Odisha cuisine", address: "Konark Sun Temple, Odisha", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" },
      { name: "Himachali Heights", description: "Mountain cuisine from Himachal", address: "Shimla, Himachal Pradesh", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
      { name: "Uttarakhand Flavors", description: "Garhwali and Kumaoni dishes", address: "Rishikesh, Uttarakhand", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },
      { name: "Jharkhand Jungle", description: "Tribal and local Jharkhand cuisine", address: "Ranchi, Jharkhand", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400" },
      { name: "Chhattisgarh Charm", description: "Central Indian flavors", address: "Raipur, Chhattisgarh", image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=400" },
      { name: "Madhya Pradesh Meals", description: "Diverse MP cuisine", address: "Khajuraho, Madhya Pradesh", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "Telangana Treats", description: "Hyderabadi and Telangana specialties", address: "Hitech City, Hyderabad", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400" },
    ];

    const restaurants = restaurantData.map((rest, index) => ({
      ...rest,
      owner: createdUsers[index + 1]._id, // Owners start from index 1
      approvalStatus: "approved",
      isActive: true,
      rating: (4 + Math.random()).toFixed(1),
      totalOrders: Math.floor(Math.random() * 50) + 10,
      totalEarnings: Math.floor(Math.random() * 50000) + 10000,
    }));

    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log("✅ Restaurants seeded");

    // Update users with restaurant IDs
    for (let i = 0; i < createdRestaurants.length; i++) {
      await User.findByIdAndUpdate(createdUsers[i + 1]._id, { restaurantId: createdRestaurants[i]._id });
    }

    // Sample Food Items (about 5-8 per restaurant, total ~120)
    const foodCategories = ["Main Course", "Appetizers", "Desserts", "Beverages", "Sides"];
    const foodItemsData = [];

    const sampleFoods = [
      { name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken", price: 280, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae391?w=300" },
      { name: "Paneer Tikka Masala", description: "Grilled paneer in spicy tomato gravy", price: 250, category: "Main Course", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300" },
      { name: "Hyderabadi Biryani", description: "Fragrant basmati rice with marinated meat", price: 320, category: "Main Course", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300" },
      { name: "Masala Dosa", description: "Crispy crepe filled with potato masala", price: 120, category: "Main Course", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300" },
      { name: "Fish Curry", description: "Tangy fish curry with coconut milk", price: 300, category: "Main Course", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?w=300" },
      { name: "Chana Masala", description: "Spicy chickpea curry", price: 180, category: "Main Course", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300" },
      { name: "Samosa", description: "Crispy pastry filled with spiced potatoes", price: 40, category: "Appetizers", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300" },
      { name: "Pakora", description: "Deep-fried vegetable fritters", price: 60, category: "Appetizers", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300" },
      { name: "Ras Malai", description: "Soft cheese dumplings in sweetened milk", price: 80, category: "Desserts", image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=300" },
      { name: "Gulab Jamun", description: "Warm milk dumplings in rose syrup", price: 70, category: "Desserts", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=300" },
      { name: "Lassi", description: "Yogurt-based drink, sweet or salty", price: 50, category: "Beverages", image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=300" },
      { name: "Masala Chai", description: "Spiced tea with milk", price: 30, category: "Beverages", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300" },
      { name: "Naan", description: "Soft Indian bread", price: 25, category: "Sides", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300" },
      { name: "Jeera Rice", description: "Cumin-flavored basmati rice", price: 80, category: "Sides", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300" },
      { name: "Raita", description: "Yogurt with cucumber and spices", price: 40, category: "Sides", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300" },
    ];

    for (let i = 0; i < createdRestaurants.length; i++) {
      const numItems = Math.floor(Math.random() * 4) + 5; // 5-8 items per restaurant
      for (let j = 0; j < numItems; j++) {
        const food = sampleFoods[Math.floor(Math.random() * sampleFoods.length)];
        foodItemsData.push({
          ...food,
          restaurant: createdRestaurants[i]._id,
          isAvailable: true,
          rating: (4 + Math.random()).toFixed(1),
          totalRatings: Math.floor(Math.random() * 50) + 5,
          preparationTime: Math.floor(Math.random() * 30) + 10,
        });
      }
    }

    const createdFoodItems = await FoodItem.insertMany(foodItemsData);
    console.log("✅ Food Items seeded");

    // Sample Orders (about 100)
    const orders = [];
    const payments = [];
    const reviews = [];

    for (let i = 0; i < 100; i++) {
      const customer = createdUsers[Math.floor(Math.random() * 50) + 21]; // Customers start from index 21
      const restaurant = createdRestaurants[Math.floor(Math.random() * createdRestaurants.length)];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
      const items = [];
      let totalAmount = 0;

      for (let j = 0; j < numItems; j++) {
        const foodItem = createdFoodItems.filter(f => f.restaurant.toString() === restaurant._id.toString())[Math.floor(Math.random() * 5)]; // Random from restaurant's items
        if (foodItem) {
          const quantity = Math.floor(Math.random() * 3) + 1;
          items.push({ foodItem: foodItem._id, quantity, price: foodItem.price });
          totalAmount += foodItem.price * quantity;
        }
      }

      const statusOptions = ["pending", "accepted", "preparing", "ready", "out_for_delivery", "delivered"];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const paymentStatus = status === "delivered" ? "completed" : status === "pending" ? "pending" : "completed";

      const order = {
        user: customer._id,
        restaurant: restaurant._id,
        items,
        totalAmount,
        deliveryAddress: customer.address,
        status,
        paymentStatus,
        paymentMethod: ["card", "upi", "wallet"][Math.floor(Math.random() * 3)],
        paymentId: `PAY_${100000 + i}`,
        ...(status === "delivered" && {
          customerFeedback: ["Great food!", "Delicious!", "Will order again", "Excellent service"][Math.floor(Math.random() * 4)],
          rating: Math.floor(Math.random() * 2) + 4, // 4-5
          deliveredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random within last 30 days
        }),
      };

      orders.push(order);

      if (paymentStatus === "completed") {
        payments.push({
          order: null, // Will set after inserting orders
          user: customer._id,
          amount: totalAmount,
          paymentMethod: order.paymentMethod,
          paymentGateway: "simulated",
          transactionId: `TXN_${100000 + i}`,
          status: "success",
        });

        // Add reviews
        if (Math.random() > 0.5) { // 50% chance of review
          reviews.push({
            order: null, // Will set
            customer: customer._id,
            restaurant: restaurant._id,
            foodItem: items[0].foodItem,
            rating: Math.floor(Math.random() * 2) + 4,
            comment: ["Amazing taste!", "Very authentic", "Quick delivery", "Highly recommended"][Math.floor(Math.random() * 4)],
            type: Math.random() > 0.5 ? "food" : "restaurant",
          });
        }
      }
    }

    const createdOrders = await Order.insertMany(orders);
    console.log("✅ Orders seeded");

    // Update payments and reviews with order IDs
    for (let i = 0; i < payments.length; i++) {
      payments[i].order = createdOrders[i]._id;
    }
    for (let i = 0; i < reviews.length; i++) {
      reviews[i].order = createdOrders[Math.floor(Math.random() * createdOrders.length)]._id; // Random order for reviews
    }

    await Payment.insertMany(payments);
    console.log("✅ Payments seeded");

    await Review.insertMany(reviews);
    console.log("✅ Reviews seeded");

    console.log("🎉 Database seeded successfully with Indian data!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();