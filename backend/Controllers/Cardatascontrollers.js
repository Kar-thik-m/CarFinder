import CarData from "../Modals/cardetailmodal.js";
import { generateMongoQuery } from "../Services/llm.js";
import { scoreCar } from "../utils/scores.js";

export const GetCarData = (req, res) => {
    CarData.find().then((result) => {
        res.json({ data: result });
    }).catch((err) => {
        res.json({ error: err });
    })
}

export const PostCarData = (req, res) => {
    if (Array.isArray(req.body)) {
        CarData.insertMany(req.body)
            .then((result) => {
                res.status(201).json({ message: "Bulk data inserted successfully", count: result.length, data: result });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    } else {
        const { make, model, variant, safetyRating, price, mileage, reviewscore, fueltype, bodytype } = req.body;
        const carData = new CarData({ make, model, variant, safetyRating, price, mileage, reviewscore, fueltype, bodytype });
        carData.save().then((result) => {
            res.status(201).json({ data: result });
        }).catch((err) => {
            res.status(500).json({ error: err.message });
        });
    }
}


export const SearchCar = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const finalResult = await resultodsearch(query);

        if (finalResult.success) {
            res.status(200).json(finalResult);
        } else {
            res.status(500).json(finalResult);
        }

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to search cars" });
    }
}

const sanitizeQuery = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(sanitizeQuery);
    } else if (obj !== null && typeof obj === "object") {
        if (obj.$regex !== undefined) {
            return new RegExp(obj.$regex, obj.$options || "");
        }

        const newObj = {};
        for (const key in obj) {
            newObj[key] = sanitizeQuery(obj[key]);
        }
        return newObj;
    }

    return obj;
};

const resultodsearch = async (prompt) => {
    try {
        const llmResponse = await generateMongoQuery(prompt);

        let dbQuery = llmResponse.query || {};
        const intent = llmResponse.intent || "unknown";
        const preferences = llmResponse.preferences || {};

        // Convert regex objects properly
        dbQuery = sanitizeQuery(dbQuery);

        let results = [];

        // Query DB (even if dbQuery is empty, to get all cars for scoring based on preferences)
        results = await CarData.find(dbQuery);

        // No cars found
        if (results.length === 0) {
            return {
                success: true,
                reply: "I couldn't find any cars matching your criteria. Try adjusting your search!",
                intent,
                matchedCarsCount: 0,
                searchQuery: dbQuery,
                carDetails: [] // or "" if you prefer
            };
        }

        // Score cars
        const scoredCars = results.map((car) => ({
            ...car.toObject(),
            score: scoreCar(car, preferences)
        }));

        // Sort by score
        const topCars = scoredCars
            .sort((a, b) => b.score - a.score)
            .slice(0, 2);

        let replyMessage = `Found ${results.length} cars matching your criteria.`;

        if (intent === "recommendations") {
            replyMessage = `Here are the top ${topCars.length} recommendations:`;
        }

        return {
            success: true,
            reply: replyMessage,
            intent,
            matchedCarsCount: results.length,
            searchQuery: dbQuery,
            carDetails: topCars
        };

    } catch (error) {
        console.error("Error inside resultodsearch:", error);

        return {
            success: false,
            error: "An error occurred during the search process."
        };
    }
};