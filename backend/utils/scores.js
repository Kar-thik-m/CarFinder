export function scoreCar(car, preferences = {}) {
    let score = 0;


    score += Math.min(car.mileage / 50, 1) * 30;


    score += (car.safetyRating / 5) * 25;


    score += (car.reviewscore / 5) * 20;


    const maxPrice = preferences.maxPrice || 100000;
    const priceScore = Math.max(0, 1 - car.price / maxPrice);
    score += priceScore * 15;


    let match = 1;
    if (preferences.bodytype && car.bodytype === preferences.bodytype) {
        match += 0.5;
    }
    if (preferences.fueltype && car.fueltype === preferences.fueltype) {
        match += 0.5;
    }

    score += Math.min(match, 1) * 10;

    return Math.round(score);
}