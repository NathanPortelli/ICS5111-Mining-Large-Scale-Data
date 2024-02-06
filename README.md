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

## To run the application locally
- Open the folder in the IDE of your choice.
- Ensure that you create the ```.env``` file based on the ```.env.example```.
- Obtain a [Spoonacular API key](https://spoonacular.com/food-api/), and add it to the ```.env``` file.
- Open the terminal and run ```npm install```. Please ensure that you are using ```Node.js``` version **20** or higher. 
- Run ```npm run dev```.

If you are on macOS and have ```nvm``` installed, run ```nvm install``` and ```nvm use```.

## To run the Python scripts
- Open to the ```Extra``` folder on the IDE of your choice, and navigate to the required script.
- Run ```python *name_of_script*.py```
