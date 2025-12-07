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

    // Sample Users with different roles
    const hashedSuperAdminPassword = await hashPassword("superadmin123");
    const hashedAdminPassword = await hashPassword("admin123");
    const hashedOwnerPassword = await hashPassword("owner123");
    const hashedCustomerPassword = await hashPassword("customer123");

    // Super Admin (Developer)
    const superAdminUsers = [
      {
        name: "Developer Admin",
        email: "superadmin@foodhub.com",
        password: hashedSuperAdminPassword,
        role: "superadmin",
        phone: "+91-9999999999",
        address: "Tech Hub, Bangalore, Karnataka",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        isActive: true,
        totalEarnings: 0,
        totalOrders: 0,
        totalSpent: 0
      }
    ];

    // Restaurant Owners (Admins)
    // System Admin
    const systemAdminUsers = [
      {
        name: "System Administrator",
        email: "admin@foodhub.com",
        password: hashedAdminPassword,
        role: "admin",
        phone: "+91-9876543210",
        address: "Connaught Place, New Delhi",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        isActive: true,
        totalEarnings: 0,
        totalOrders: 0,
        totalSpent: 0
      }
    ];

    // Indian names for customers
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

    // Restaurant Owners (first 30 from a names list, or you can create names)
    const ownerNames = ["Rajesh Sharma", "Priya Singh", "Vikram Kumar", "Anjali Patel", "Suresh Reddy", "Meera Verma", "Arjun Gupta", "Kavita Rao", "Ravi Joshi", "Poonam Agarwal", "Deepak Yadav", "Sneha Kapoor", "Manoj Tiwari", "Rekha Mishra", "Anil Choudhary", "Kiran Saxena", "Vivek Pandey", "Neha Jain", "Sanjay Bhatia", "Preeti Malhotra", "Rohit Khanna", "Alka Sinha", "Nitin Chopra", "Rashmi Iyer", "Karan Gill", "Pallavi Roy", "Aditya Bose", "Shweta Das", "Rahul Mukherjee", "Divya Chatterjee"];

    const users = [
      ...superAdminUsers,
      ...systemAdminUsers,
      // Restaurant Owners
      ...ownerNames.map((name, index) => ({
        name,
        email: `owner${index + 1}@foodhub.com`,
        password: hashedOwnerPassword,
        role: "restaurant",
        phone: `+91-98765432${10 + index}`,
        address: `${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'][index % 10]}, India`,
        profilePicture: `https://images.unsplash.com/photo-${1500000000000 + index}?w=150`,
        isActive: true,
        totalEarnings: Math.floor(Math.random() * 50000) + 10000,
        totalOrders: Math.floor(Math.random() * 100) + 20,
      })),

      // Customers
      ...customerNames.map((name, index) => ({
        name,
        email: `customer${index + 1}@foodhub.com`,
        password: hashedCustomerPassword,
        role: "customer",
        phone: `+91-98765432${20 + index}`,
        address: `${['Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Surat', 'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata'][index % 10]}, India`,
        profilePicture: index % 3 === 0 ? `https://images.unsplash.com/photo-${1400000000000 + index}?w=150` : null,
        isActive: true,
        totalOrders: Math.floor(Math.random() * 15) + 1,
        totalSpent: Math.floor(Math.random() * 5000) + 500,
      })),
    ];

    const createdUsers = await User.insertMany(users);
    console.log("✅ Users seeded");

    // Sample Restaurants (30 - added 10 more)
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
      // 10 additional restaurants
      { name: "Northeastern Delights", description: "Exotic flavors from Northeast India", address: "Shillong, Meghalaya", image: "https://images.unsplash.com/photo-1551782450-17144efb5723?w=400" },
      { name: "Coastal Karnataka", description: "Seafood and coastal Karnataka cuisine", address: "Mangalore, Karnataka", image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400" },
      { name: "Marwari Magic", description: "Traditional Marwari Rajasthani food", address: "Jodhpur, Rajasthan", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400" },
      { name: "Tamil Nadu Treasures", description: "Authentic Tamil cuisine and Chettinad dishes", address: "Madurai, Tamil Nadu", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" },
      { name: "Maharashtrian Masala", description: "Punekar and Maharashtrian specialties", address: "Sinhagad Fort, Pune", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
      { name: "Kashmiri Wazwan", description: "Royal Kashmiri multi-course meals", address: "Dal Lake, Srinagar", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },
      { name: "Andhra Spice Route", description: "Hot and spicy Andhra Pradesh cuisine", address: "Tirupati, Andhra Pradesh", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400" },
      { name: "Bengali Sweets & Savories", description: "Bengali mishti and traditional dishes", address: "Howrah Bridge, Kolkata", image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=400" },
      { name: "Haryanvi Haveli", description: "Traditional Haryanvi and Punjabi fusion", address: "Chandigarh, Haryana", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "Uttar Pradesh Royal", description: "Awadhi and Mughlai cuisine from UP", address: "Taj Mahal, Agra", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400" },
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
      // Main Courses
      {
        name: "Butter Chicken",
        description: "Creamy tomato-based curry with tender chicken, served with basmati rice. A rich, flavorful dish with aromatic spices.",
        price: 280,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae391?w=300",
        calories: 450,
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "Medium",
        allergens: ["Dairy", "Chicken"]
      },
      {
        name: "Paneer Tikka Masala",
        description: "Grilled paneer cubes in a spicy tomato-based gravy with bell peppers and onions. Served with jeera rice.",
        price: 250,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300",
        calories: 380,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Medium-High",
        allergens: ["Dairy"]
      },
      {
        name: "Hyderabadi Biryani",
        description: "Fragrant basmati rice layered with marinated chicken, caramelized onions, boiled eggs, and saffron. A royal dish.",
        price: 320,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300",
        calories: 520,
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "Medium",
        allergens: ["Eggs"]
      },
      {
        name: "Masala Dosa",
        description: "Crispy fermented crepe filled with potato masala, served with sambar and coconut chutney.",
        price: 120,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300",
        calories: 320,
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "Low",
        allergens: ["Gluten"]
      },
      {
        name: "Fish Curry",
        description: "Fresh fish simmered in tangy tamarind and coconut curry with traditional South Indian spices.",
        price: 300,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1551782450-17144efb5723?w=300",
        calories: 280,
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "High",
        allergens: ["Fish", "Coconut"]
      },
      {
        name: "Chana Masala",
        description: "Chickpeas cooked in a spicy tomato-based gravy with garam masala and fresh cilantro.",
        price: 180,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300",
        calories: 220,
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "Medium",
        allergens: []
      },

      // Appetizers
      {
        name: "Punjabi Samosa",
        description: "Crispy pastry filled with spiced potatoes, peas, and green chilies. Served with tamarind chutney.",
        price: 40,
        category: "Appetizers",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300",
        calories: 180,
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "Medium",
        allergens: ["Gluten"]
      },
      {
        name: "Paneer Pakora",
        description: "Deep-fried paneer fritters coated in spiced chickpea batter. Perfect crispy starter.",
        price: 80,
        category: "Appetizers",
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300",
        calories: 240,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Low",
        allergens: ["Dairy", "Gluten"]
      },
      {
        name: "Chicken 65",
        description: "Spicy, deep-fried chicken bites marinated in red chili, curry leaves, and South Indian spices.",
        price: 150,
        category: "Appetizers",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300",
        calories: 320,
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "High",
        allergens: ["Chicken"]
      },

      // Desserts
      {
        name: "Ras Malai",
        description: "Soft cheese dumplings soaked in sweetened cardamom-flavored milk. A Bengali delicacy.",
        price: 80,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=300",
        calories: 150,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "None",
        allergens: ["Dairy"]
      },
      {
        name: "Gulab Jamun",
        description: "Warm milk dumplings soaked in rose-flavored sugar syrup. Served hot.",
        price: 70,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=300",
        calories: 180,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "None",
        allergens: ["Dairy"]
      },
      {
        name: "Rasgulla",
        description: "Spongy cheese balls in light sugar syrup. A traditional Bengali sweet.",
        price: 60,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=300",
        calories: 120,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "None",
        allergens: ["Dairy"]
      },

      // Beverages
      {
        name: "Sweet Lassi",
        description: "Thick yogurt drink sweetened with sugar and flavored with cardamom. Refreshing and creamy.",
        price: 50,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1551782450-17144efb5723?w=300",
        calories: 180,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "None",
        allergens: ["Dairy"]
      },
      {
        name: "Masala Chai",
        description: "Traditional Indian spiced tea with ginger, cardamom, cloves, and cinnamon. Served hot.",
        price: 30,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300",
        calories: 80,
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "Low",
        allergens: []
      },
      {
        name: "Fresh Lime Soda",
        description: "Sparkling lemon drink with mint leaves and a hint of salt. Perfect summer refresher.",
        price: 40,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300",
        calories: 45,
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "None",
        allergens: []
      },

      // Sides
      {
        name: "Butter Naan",
        description: "Soft, fluffy Indian bread brushed with butter. Perfect accompaniment to curries.",
        price: 25,
        category: "Sides",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300",
        calories: 150,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "None",
        allergens: ["Gluten", "Dairy"]
      },
      {
        name: "Jeera Rice",
        description: "Basmati rice tempered with cumin seeds and ghee. Aromatic and flavorful.",
        price: 80,
        category: "Sides",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300",
        calories: 200,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Low",
        allergens: ["Dairy"]
      },
      {
        name: "Mixed Vegetable Raita",
        description: "Yogurt with cucumber, tomatoes, and mild spices. Cooling accompaniment to spicy dishes.",
        price: 40,
        category: "Sides",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300",
        calories: 90,
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "Low",
        allergens: ["Dairy"]
      }
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