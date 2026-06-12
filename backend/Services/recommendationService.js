export function scoreCars(
    cars,
    preferences
) {
    const scoredCars = cars.map((car) => {
        let score = 0;

        if (
            preferences.budget &&
            car.price <= preferences.budget
        ) {
            score += 40;
        }

        score += car.safetyRating * 10;

        score += car.mileage;

        score += car.reviewScore * 5;

        return {
            ...car.toObject(),
            score
        };
    });

    return scoredCars
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}