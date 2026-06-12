import Car from "../Modals/cardetailmodal.js";

import {
    extractUserIntent
} from "../Services/llm.js";

import {
    scoreCars
} from "../Services/recommendationService.js";

import {
    explainCar
} from "../Services/explanationService.js";

export async function searchCars(
    req,
    res
) {
    try {
        const { query } = req.body;

        const intent =
            await extractUserIntent(query);

        if (intent.intent === "recommend") {
            const cars = await Car.find();

            const recommendations =
                scoreCars(cars, intent);

            return res.json({
                type: "recommendations",
                recommendations
            });
        }

        if (
            intent.intent ===
            "brand_search"
        ) {
            const cars = await Car.find({
                make: intent.brand
            });

            return res.json({
                type: "brand_search",
                cars
            });
        }

        if (
            intent.intent ===
            "car_details"
        ) {
            const car =
                await Car.findOne({
                    model: {
                        $regex:
                            intent.specificCar,
                        $options: "i"
                    }
                });

            return res.json({
                type: "car_details",
                car
            });
        }

        if (
            intent.intent ===
            "compare"
        ) {
            const cars =
                await Car.find({
                    model: {
                        $in: intent.cars
                    }
                });

            return res.json({
                type: "compare",
                cars
            });
        }

        return res.status(400).json({
            message:
                "Unable to determine intent"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export async function explain(
    req,
    res
) {
    try {
        const {
            carId,
            query
        } = req.body;

        const car =
            await Car.findById(carId);

        const explanation =
            await explainCar(
                query,
                car
            );

        res.json({
            explanation
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}