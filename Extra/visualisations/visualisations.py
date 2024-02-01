from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import numpy as np
import requests

response_API = requests.get('http://localhost:3000/api/word2vec')

data = response_API.json()

words = list(data['wordList'])
vectors = np.array(data['vectors'])

# # t-SNE Visualization
# tsne = TSNE(n_components=2, random_state=42)
# vectors_2d = tsne.fit_transform(vectors)

# # Plotting word vectors in a scatter plot
# plt.figure(figsize=(10, 8))
# plt.scatter(vectors_2d[:, 0], vectors_2d[:, 1], marker='o', s=30, alpha=0.6)

# # Annotating words for illustration
# for i, word in enumerate(words):
#     plt.annotate(word, (vectors_2d[i, 0], vectors_2d[i, 1]), alpha=0.6)

# plt.title('t-SNE Visualization of Word2Vec Embeddings')
# plt.show()

# PCA Visualization
pca = PCA(n_components=2)
vectors_2d = pca.fit_transform(vectors)

# Plotting word vectors in a scatter plot
plt.figure(figsize=(10, 8))
plt.scatter(vectors_2d[:, 0], vectors_2d[:, 1], marker='o', s=30, alpha=0.6)

# Annotate some words for illustration
for i, word in enumerate(words):
    plt.annotate(word, (vectors_2d[i, 0], vectors_2d[i, 1]), alpha=0.6)

plt.title('PCA Visualization of Word2Vec Embeddings')
plt.show()