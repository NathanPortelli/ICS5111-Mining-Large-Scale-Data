from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import numpy as np
import requests

url = 'http://localhost:3000/api/word2vec'
body = { "text": "Preheat the oven to 180°C/350°F/gas 4. Line a 25cm ovenproof frying pan or tin with a scrunched sheet of wet greaseproof paper. Place 200g of figs in a food processor with the oil, yoghurt, vanilla extract, peeled bananas and eggs, then blitz until smooth. Add the flour, baking powder, ground almonds, poppy seeds and turmeric and pulse until just combined, but don't overwork the mixture. Coarsely grate and stir in the apple. Spoon the mixture into the prepared pan and spread out evenly. Tear over the remaining figs, pushing them in slightly, then chop the almonds and scatter over. Bake for 35 to 40 minutes, or until golden, cooked through and an inserted skewer comes out clean. Transfer to a wire rack to cool a little. I like to serve each portion with 1 tablespoon of nut butter, 1 tablespoon of natural yoghurt and some wedges of blood orange. Store any extra portions in an airtight container, where it will keep for 2 to 3 days." }
response_API = requests.post(url, json=body)

data = response_API.json()

words = list(data['wordList'])
vectors = np.array(data['vectors'])

# Common parameters
scatter_params = dict(marker='o', s=100, alpha=0.7)

# t-SNE Visualisation
tsne = TSNE(n_components=2, random_state=42)
vectors_2d_tsne = tsne.fit_transform(vectors)

fig, ax = plt.subplots(figsize=(12, 8))  # Adjust the figure size as needed
for i, word in enumerate(words):
    plt.scatter(vectors_2d_tsne[i, 0], vectors_2d_tsne[i, 1], c='blue', label=f'{i+1}: {word}', **scatter_params)
    plt.annotate(str(i+1), (vectors_2d_tsne[i, 0], vectors_2d_tsne[i, 1]), fontsize=8, color='white', ha='center', va='center')

# Create a custom legend with two rows, remove the dots, and center outside on the right
legend_labels = [f'{i+1}: {word}' for i, word in enumerate(words)]
plt.legend(handles=[], labels=legend_labels, loc='center left', bbox_to_anchor=(1, 0.5), fontsize='small', ncol=2, markerscale=0, borderaxespad=0.5, handlelength=0)

plt.title('t-SNE Visualisation of Word2Vec Embeddings')
plt.axvline(0, color='k', linestyle='--', alpha=0.5)
plt.axhline(0, color='k', linestyle='--', alpha=0.5)
plt.tight_layout()  # Adjust layout to prevent clipping
plt.show()

# PCA Visualisation
pca = PCA(n_components=2)
vectors_2d_pca = pca.fit_transform(vectors)

fig, ax = plt.subplots(figsize=(12, 8))  # Adjust the figure size as needed
for i, word in enumerate(words):
    plt.scatter(vectors_2d_pca[i, 0], vectors_2d_pca[i, 1], c='red', label=f'{i+1}: {word}', **scatter_params)
    plt.annotate(str(i+1), (vectors_2d_pca[i, 0], vectors_2d_pca[i, 1]), fontsize=8, color='white', ha='center', va='center')

# Create a custom legend with two rows, remove the dots, and center outside on the right
plt.legend(handles=[], labels=legend_labels, loc='center left', bbox_to_anchor=(1, 0.5), fontsize='small', ncol=2, markerscale=0, borderaxespad=0.5, handlelength=0)

plt.title('PCA Visualisation of Word2Vec Embeddings')
plt.axvline(0, color='k', linestyle='--', alpha=0.5)
plt.axhline(0, color='k', linestyle='--', alpha=0.5)
plt.tight_layout()  # Adjust layout to prevent clipping
plt.show()