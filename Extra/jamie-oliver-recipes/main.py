from bs4 import BeautifulSoup
import requests
import json
import csv


def extract_recipe_data(recipe_url):
    response = requests.get(recipe_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Recipe title
    title_element = soup.title
    title = title_element.text.strip() if title_element else ""

    # Recipe subheading
    subheading_element = soup.find('p', {'class': 'subheading'})
    subheading = subheading_element.text.strip() if subheading_element else ""

    # Recipe image link
    hero_wrapper_element = soup.find('div', {'class': 'hero-wrapper'})
    image_link_element = hero_wrapper_element.find('img') if hero_wrapper_element else None
    image_link = image_link_element['src'] if image_link_element else ""

    # Recipe details (serves, time, intro)
    serves_element = soup.find('div', {'class': 'recipe-detail serves'})
    serves = serves_element.text.strip().split()[-2:] if serves_element else ""

    time_element = soup.find('div', {'class': 'recipe-detail time'})
    time = time_element.text.strip().split()[-2:] if time_element else ""

    intro_element = soup.find('div', {'class': 'recipe-intro'})
    intro = intro_element.text.strip() if intro_element else ""

    # Nutrition information (Calories, Fat, Saturates, Sugars, Salt, Protein, Carbs, Fibre)
    nutrition_data = {}
    nutrition_elements = soup.select('.nutrition-expanded li')
    for item in nutrition_elements:
        nutrition_title = item.find('span', {'class': 'title'}).text.strip()
        value = item.find('span', {'class': 'top'}).text.strip()
        nutrition_data[nutrition_title] = value

    # Ingredients list from <ul class="ingred-list">
    ingredients_list = [item.text.strip() for item in soup.select('ul.ingred-list li')]
    if not ingredients_list:
        print(f"Ingredients list not found for recipe: {recipe_url}")

    # Recipe
    recipe_steps = [step.text.strip() for step in soup.select('.recipe-instructions .recipeSteps li')]

    # Dictionary for csv
    return {
        'Recipe title': title,
        'Subheading': subheading,
        'Image (link)': image_link,
        'Recipe-detail serves': serves,
        'Recipe-detail time': ' '.join(time),
        'Recipe-detail': intro,
        'Calories': nutrition_data.get('Calories', ''),
        'Fat': nutrition_data.get('Fat', ''),
        'Saturates': nutrition_data.get('Saturates', ''),
        'Sugars': nutrition_data.get('Sugars', ''),
        'Salt': nutrition_data.get('Salt', ''),
        'Protein': nutrition_data.get('Protein', ''),
        'Carbs': nutrition_data.get('Carbs', ''),
        'Fibre': nutrition_data.get('Fibre', ''),
        'Ingred-list': ', '.join(ingredients_list),
        'RecipeSteps': ', '.join(recipe_steps),
    }


def write_to_csv(data, filename='recipes.csv'):
    headers = data[0].keys()
    with open(filename, 'w', newline='', encoding='utf-8') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=headers)
        writer.writeheader()
        writer.writerows(data)


def get_recipe_urls(category_url):
    response = requests.get(category_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Finding categories
    recipe_section = soup.find('section', {'id': 'recipe-subcat-listing'})

    if recipe_section:
        # JSON data
        script_tag = recipe_section.find('script', {'type': 'application/ld+json'})

        if script_tag:
            # Parse JSON data
            json_data = json.loads(script_tag.text)

            # Extract URLs from the JSON data
            urls = [item['url'] for item in json_data['itemListElement']]
            return urls
        else:
            print(f"Script tag not found in category: {category_url}")
    else:
        print(f"Recipe section not found in category: {category_url}")
    return []


# URL of the page to scrape -- contains list of all food categories based on main ingredients
url = "https://www.jamieoliver.com/recipes/category/ingredient/"

# HTTP request to the URL
response = requests.get(url)

soup = BeautifulSoup(response.text, 'html.parser')  # Parse HTML content
recipe_section = soup.find('section', {'id': 'recipe-cat-listing'})  # Find categories

# Check if section is found [Scraping fails after a number of requests]
if recipe_section:
    # Find all recipe blocks within section
    recipe_blocks = recipe_section.find_all('div', {'class': 'recipe-block'})

    # Categories to skip -- These were already scraped in a previous runs
    #skip_categories = ['apple', 'broccoli', 'tuna', 'asparagus', 'chorizo', 'cauliflower', 'leek', 'beetroot', 'mushroom', 'lentil', 'rhubarb', 'scallops', 'spinach', 'steak', 'tofu', 'rice', 'prawn', 'turkey', 'goose', 'mussels', 'seafood', 'vegetables', 'eggs', 'chicken', 'bread', 'fish', 'fruit', 'lamb', 'pasta', 'beef', 'avocado', 'cheese', 'butternut-squash', 'chocolate', 'duck', 'game', 'pork', 'sea-bass', 'salmon', 'aubergine', 'courgette', 'couscous', 'kale', 'mince', 'potato', 'sausage', 'sweet-potato']
    skip_categories = []

    for recipe_block in recipe_blocks:
        category_url = recipe_block.find('a')['href']

        # Check with list of categories to skip
        if any(skip_category in category_url for skip_category in skip_categories):
            print(f"Skipping category: {category_url}")
            continue

        print(category_url)
        recipe_urls = get_recipe_urls(category_url)

        all_recipe_data = []
        for url in recipe_urls:
            print(url)
            recipe_data = extract_recipe_data(url)
            all_recipe_data.append(recipe_data)

        # Save data to CSV for each category_url -- prevents total data loss when site blocks scraping
        if all_recipe_data:
            csv_filename = f"{category_url.split('/')[-2]}.csv"
            write_to_csv(all_recipe_data, filename=csv_filename)
            print("Data saved to ", csv_filename)
else:
    print("Recipe section not loading/found.")
