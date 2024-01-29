import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import json

# Dataset 'stopwords.csv' from: https://www.kaggle.com/datasets/heeraldedhia/stop-words-in-28-languages?select=english.txt

cred = credentials.Certificate('ics5111-firebase-adminsdk-z4nck-a0b4f57c40.json')
firebase_admin.initialize_app(cred)

db = firestore.client()


def stopwords(csv_path, collection_name):
    stopwords_df = pd.read_csv(csv_path, header=None, names=['stopword'], encoding='latin1')

    stopwords_list = stopwords_df['stopword'].tolist()

    for stopword in stopwords_list:
        db.collection(collection_name).add({'word': stopword})

def foundation_foods(csv_path, collection_name):
    df = pd.read_csv(csv_file_path)

    grouped = df.groupby('food_category_id')['description'].agg(lambda x: x.str.lower().tolist())

    foods_list = [{'target': df.loc[df['food_category_id'] == cat, 'food_category_name'].iloc[0], 'context': descriptions}
          for cat, descriptions in grouped.items()]

    for food in foods_list:
        db.collection(collection_name).add(food)

def foundation_foods_to_json(csv_path):
    df = pd.read_csv(csv_file_path)

    grouped = df.groupby('food_category_id')['description'].agg(lambda x: x.str.lower().tolist())

    foods_list = [{'target': df.loc[df['food_category_id'] == cat, 'food_category_name'].iloc[0], 'context': descriptions}
          for cat, descriptions in grouped.items()]

    food_list_json = json.dumps(foods_list)

    with open("foundation_foods.json", "w") as outfile:
        outfile.write(food_list_json)


if __name__ == "__main__":
    # csv_file_path = 'data/stopwords.csv'
    # firestore_collection = 'stopwords'

    # stopwords(csv_file_path, firestore_collection)

    csv_file_path = 'data/foundationfoods.csv'
    firestore_collection = 'foundationfoods'

    foundation_foods_to_json(csv_file_path)
