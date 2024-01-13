import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

# Dataset 'stopwords.csv' from: https://www.kaggle.com/datasets/heeraldedhia/stop-words-in-28-languages?select=english.txt

cred = credentials.Certificate('ics5111-firebase-adminsdk-z4nck-a0b4f57c40.json')
firebase_admin.initialize_app(cred)

db = firestore.client()


def main(csv_path, collection_name):
    stopwords_df = pd.read_csv(csv_path, header=None, names=['stopword'], encoding='latin1')

    stopwords_list = stopwords_df['stopword'].tolist()

    for stopword in stopwords_list:
        db.collection(collection_name).add({'word': stopword})


if __name__ == "__main__":
    csv_file_path = 'data/stopwords.csv'
    firestore_collection = 'stopwords'

    main(csv_file_path, firestore_collection)
