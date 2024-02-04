from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import numpy as np
import requests

url = 'http://localhost:3000/api/word2vec'
body = { "text": "Preheat the oven to 180°C/350°F/gas 4. Place a large non-stick ovenproof frying pan on a medium-high heat. Peel the onions, cut into quarters and quickly break apart into petals directly into the pan, tossing regularly, then add 1 tablespoon of olive oil and a pinch of sea salt and black pepper. Quarter and core the apples, then toss into the pan. Use a speed-peeler to peel the parsnips into long strips. Stir 1 tablespoon of red wine vinegar into the frying pan, then pile the parsnip strips on top of the apples and onions. Lay the sausages on top, then drizzle with 1 tablespoon of olive oil and add a pinch of black pepper from a height. Bake for 30 minutes, then drizzle over the honey and return to the oven for 5 minutes, or until golden and delicious." }
response_API = requests.post(url, json=body)

data = response_API.json()

words = list(data['wordList'])
vectors = np.array(data['vectors'])

# Common parameters
scatter_params = dict(marker='o', s=100, alpha=0.7)

# t-SNE Visualization
tsne = TSNE(n_components=2, random_state=42)
vectors_2d_tsne = tsne.fit_transform(vectors)

fig, ax = plt.subplots(figsize=(12, 8))  # Adjust the figure size as needed
for i, word in enumerate(words):
    plt.scatter(vectors_2d_tsne[i, 0], vectors_2d_tsne[i, 1], c='blue', label=f'{i+1}: {word}', **scatter_params)
    plt.annotate(str(i+1), (vectors_2d_tsne[i, 0], vectors_2d_tsne[i, 1]), fontsize=8, color='white', ha='center', va='center')

# Create a custom legend with two rows, remove the dots, and center outside on the right
legend_labels = [f'{i+1}: {word}' for i, word in enumerate(words)]
plt.legend(handles=[], labels=legend_labels, loc='center left', bbox_to_anchor=(1, 0.5), fontsize='small', ncol=2, markerscale=0, borderaxespad=0.5, handlelength=0)

plt.title('t-SNE Visualization of Word2Vec Embeddings')
plt.axvline(0, color='k', linestyle='--', alpha=0.5)
plt.axhline(0, color='k', linestyle='--', alpha=0.5)
plt.tight_layout()  # Adjust layout to prevent clipping
plt.show()

# PCA Visualization
pca = PCA(n_components=2)
vectors_2d_pca = pca.fit_transform(vectors)

fig, ax = plt.subplots(figsize=(12, 8))  # Adjust the figure size as needed
for i, word in enumerate(words):
    plt.scatter(vectors_2d_pca[i, 0], vectors_2d_pca[i, 1], c='red', label=f'{i+1}: {word}', **scatter_params)
    plt.annotate(str(i+1), (vectors_2d_pca[i, 0], vectors_2d_pca[i, 1]), fontsize=8, color='white', ha='center', va='center')

# Create a custom legend with two rows, remove the dots, and center outside on the right
plt.legend(handles=[], labels=legend_labels, loc='center left', bbox_to_anchor=(1, 0.5), fontsize='small', ncol=2, markerscale=0, borderaxespad=0.5, handlelength=0)

plt.title('PCA Visualization of Word2Vec Embeddings')
plt.axvline(0, color='k', linestyle='--', alpha=0.5)
plt.axhline(0, color='k', linestyle='--', alpha=0.5)
plt.tight_layout()  # Adjust layout to prevent clipping
plt.show()