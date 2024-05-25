# ICS5111-Mining-Large-Scale-Data

## Project Details

#### Title: Utilising Text Mining Techniques for Personalised Diet Recommendations using Heterogeneous Data

Created in fulfillment of the requirements for the ICS5111 Mining Large Scale Data assignment by [Nathan Portelli](https://github.com/NathanPortelli/) and [Oleg Grech](https://github.com/oleggrech7).

### Public Datasets/Websites used

[FoodData Central](https://fdc.nal.usda.gov/) ; [Jamie Oliver Recipes](https://www.jamieoliver.com/recipes/) ; [Spoonacular](https://spoonacular.com/food-api/) ; [Stopwords](https://www.kaggle.com/datasets/heeraldedhia/stop-words-in-28-languages?select=english.txt)

## Abstract

This project aims to develop a personalised diet recommender system by leveraging text-mining techniques to extract insights from diverse data sources. Datasets comprising structured, semi-structured, and unstructured nutritional information and recipes, with the latter scraped using the Beautiful Soup library, are utilised to offer tailored meal plans matching individual needs. Word2Vec is also implemented for ingredient extraction from recipe data. The implementation identifies ingredients, calories, and nutritional values while considering users’ Basal Metabolic Rate (BMR) and preferences. Collaborative filtering is explored for recommending similar recipes based on user data. A Proof of concept, developed using Next.js and deployed on [ics5111.vercel.app](https://ics5111.vercel.app/), showcases intelligent meal plan recommendations. This prototype was well-received in a usability study, with an average SUS Score of 93.25.

More information can be found in the project's [report](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/blob/main/Report/ICS5111%20Assignment%20-%20Report.pdf) or [presentation](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/blob/main/Report/ICS5111%20Assignment%20-%20Presentation.pdf).

## Vercel Deployment
This application has been deployed online through Vercel via the link: [ics5111.vercel.app](https://ics5111.vercel.app/).

### To run the application locally
- Open the folder in the IDE of your choice.
- Ensure that you create the ```.env``` file based on the ```.env.example```.
- Obtain a [Spoonacular API key](https://spoonacular.com/food-api/), and add it to the ```.env``` file.
- Open the terminal and run ```npm install```. Please ensure that you are using ```Node.js``` version **20** or higher. 
- Run ```npm run dev```.

If you are on macOS and have ```nvm``` installed, run ```nvm install``` and ```nvm use```.

### To run the Python scripts
- Open to the ```Extra``` folder on the IDE of your choice, and navigate to the required script.
- Run ```python *name_of_script*.py```

## How it works

1. Click "Click here to get started" button.
   ![Screenshot 2024-05-25 192035](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/31106f2d-8368-4aad-a197-a96949e83bb3)

   Click "Don't have an account? Register" to create an account.
   ![Screenshot 2024-05-25 192103](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/e1aebd08-ad01-4316-a02d-fff9ef545ee3)

2. Input your information into the "Personal Details", "Food Preferences" and "Food Restrictions" sections.
   ![Screenshot 2024-05-25 192146](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/39ea37fb-0d25-46eb-9aeb-2151911df223)
   
3. Pick your diet plan goal, then click "Generate Recommendations".
   ![Screenshot 2024-05-25 192227](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/783d6a5c-3acd-4f0d-b12b-8b5580af774e)
   
4. Pick one item from the Breakfast, Lunch, and Dinner options.
   ![Screenshot 2024-05-25 192329](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/0b501207-cb71-48f8-bad7-0565b03383b3)

5. If none of the recommendations are to your liking, you can click "Find Alternatives" on an item closest to your liking, then pick one of the three alternative recommendations.
   ![Screenshot 2024-05-25 192530](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/ddbf6279-3d40-4eba-a05e-f483a52cfcb5)
    
6. Rate your recommendations, then click "Set Menu for Today". A pop-up should appear informing you that the meal plan can be found in the History tab.
   ![Screenshot 2024-05-25 192545](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/c284164e-4ed7-4867-bc23-a4e86bc62a00)
   ![Screenshot 2024-05-25 192608](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/fb719d2f-c7f0-497d-ae9c-3277d9ed22bc)
    
7. Click on "History" tab at the top to get a full list of ingredients and instructions to prepare your meal.
   ![Screenshot 2024-05-25 192703](https://github.com/NathanPortelli/ICS5111-Mining-Large-Scale-Data/assets/61872215/49c5d874-b522-4dc2-9c97-d440f3a14241)

8. Prepare, then enjoy your meals! 😊
