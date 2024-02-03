from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import numpy as np
import requests

response_API = requests.get('http://localhost:3000/api/word2vec')

data = response_API.json()

words = list(data['wordList'])
vectors = np.array(data['vectors'])

# Common parameters
scatter_params = dict(marker='o', s=50, alpha=0.7)

# t-SNE Visualization
tsne = TSNE(n_components=2, random_state=42)
vectors_2d = tsne.fit_transform(vectors)

plt.figure(figsize=(10, 8))
plt.scatter(vectors_2d[:, 0], vectors_2d[:, 1], c='blue', **scatter_params)

for i, word in enumerate(words):
    plt.annotate(word, (vectors_2d[i, 0], vectors_2d[i, 1]), alpha=0.7)

plt.title('t-SNE Visualization of Word2Vec Embeddings')
plt.show()

# PCA Visualization
pca = PCA(n_components=2)
vectors_2d = pca.fit_transform(vectors)

plt.figure(figsize=(10, 8))
plt.scatter(vectors_2d[:, 0], vectors_2d[:, 1], c='red', **scatter_params)

for i, word in enumerate(words):
    plt.annotate(word, (vectors_2d[i, 0], vectors_2d[i, 1]), alpha=0.7)

plt.title('PCA Visualization of Word2Vec Embeddings')
plt.show()