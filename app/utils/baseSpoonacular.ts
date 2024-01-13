export function spoonacularBaseAPI(apiURL: string) {
    return fetch(
        process.env.SPOONACULAR_BASE_URL + apiURL,
        {
          method: "GET",
          headers: {
            "x-api-key": process.env.SPOONACULAR_API_KEY!,
          },
        }
      );
}