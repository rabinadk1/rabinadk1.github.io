+++
date = "2021-05-07"
title = "Training of Word Embeddings"
description = "This article goes through the basics of tokenization and word embeddings along with a brief insight into how its training is done in text corpora"
images = ["/images/nearest_ten_points_of_man.webp"]
keywords = "tokenization embeddeding training"
tags = [
    "Word Embeddings",
    "Tokenization"
]
categories = [
    "Deep Learning"
]
series = ["Artificial Intelligence"]
+++

## Tokenization


Since the computer doesn’t understand strings as a numerical value, they need to be converted into numeric forms.
So the sentences used for training are converted into sequence tokens using some kind of tokenizer.
The process of converting a text into a sequence of tokens is called tokenization.
Tokenization can be broadly classified into 3 types viz. word, character, and subword (n-gram characters).

### Word Tokenizer

Word tokenizers tokenize each word separately by splitting the sentence with spaces.
But soon enough, we find out that they are not that great to capture the relationship between the words.
“Don’t” and “Do not” are the same for us as humans but not for the tokenizer which may result in different meanings for these words to the model.
To overcome this kind of problem different rules started to be used to separate a text into tokens.
We’ll get different tokenized versions of the same text depending on the rules we apply to split our texts into tokens.
So the pre-trained model will not perform well if the same rules used to pre-train them are not used when evaluating or fine-tuning them.

Another drawback of this method is the vocabulary associated with it.
An increase in vocabulary means an increase in the size of the embedding matrix, which causes huge consumption of memory.

### Character Tokenizer

Character tokenizers tokenize each character as a token.
Its main advantages are its simplicity and speed and less use of memory than word tokenizers.
But this doesn’t allow the model to capture long-term dependencies in a sentence and performs poorly.
The model fails to learn a representation of texts as meaningful as when using a word tokenization.

### Sub-word Tokenizer

To get the best of both word-level and character-level tokenizers, sub-word tokenizers are used.
They use less memory than word-level tokenizers and help capture a more meaningful representation of texts than character-level tokenizers.

Old language models based on word-level tokenization learned the relationship between words from the same stem-like “big”, “bigger”, and “biggest” from their word embedding built from the provided corpus but they couldn’t generalize the learned dimension to similar word vectors like “old”, “older”, and “oldest”.
If we learned somehow to differentiate the stem word from the words then the effect of the same suffix or prefix is also similar in the case of other words.
Sub-word tokenization addresses this problem to a certain extent.
This keeps the same representation for the common words but breaks the rate words into sub-word tokens.

Different types of sub-word tokenizers currently being used in the field of <abbr title="Natural Language Processing">NLP</abbr> are described in brief below.

#### Byte Pair Encoding (BPE)

Byte Pair Encoding, also known as diagram coding, is a simple form of lossless data compression in which the most common pair of consecutive bytes of data is replaced with a byte different from the ones originally in the data or corpus of texts.
A variant of this technique is used in different state-of-the-art natural language processing applications, like Transformers, and OpenAI’s GPT, GPT-2, and GPT-3.
A very good example of encoding a word with byte pair encoding is provided in the Wikipedia article [Byte Pair Encoding](https://en.wikipedia.org/wiki/Byte_pair_encoding).

Byte pair encoding is a sub-word tokenizer used to make parts of words as a token rather than treating a single word as a single token.
When we have a corpus of text and we need to build a byte pair encoder, we start by appending a special token like `</w>` to the end of each token to mark the end of words since our tokens are subwords.
We build a dictionary of the frequency of words to count the frequency of different byte pairs.
We start by splitting words into letters and assigning them unique tokens, which will be stored in a dictionary, making each word a sequence of tokens, in which each token is of a single character
We find the most frequent consecutive character tokens and replace them with a new token.
This goes on until no consecutive tokens are repeated in the corpus more than once.
This can also be controlled by setting maximum sub-word length and maximum iteration to continue the above process.
Practically it can be found that during the above recursive process, the number of tokens increases first then starts to decrease.
The source code of doing byte pair encoding for a corpus of code can be found in [Unsupervised Word Segmentation for Neural Machine Translation and Text Generation](https://github.com/rsennrich/subword-nmt) which was used in the paper [Neural Machine Translation of Rare Words with Subword Units](https://arxiv.org/abs/1508.07909).

Another advantage of this method is that this generalizes better than word tokenizer to out of vocabulary words.
It splits the out of vocabulary words into a token of subwords with maximum length lying in the given word.
An out of vocabulary word like transformer can be encoded to `[“trans”, “former”, “</w>”]` if it had seen “trans” and “former” previously.
But if we chose to remove infrequent tokens to reduce the vocabulary size and we don’t have all the characters from which our corpus is built then tokenized texts contain another special token called `<oov>` or `<unk>` which stands for out of vocabulary and unknown tokens respectively.
For example, if “h” is not in our vocabulary, “hype” may be tokenized as `[“<oov>”, “ype”]`.
Practically, this happens mainly to special characters like emojis and may occur more in non-English languages.

#### Byte-level BPE

The base characters for the vocabulary can be quite big if we opted to incorporate all the Unicode characters.
The problem of tokenizing texts with `<oov>` tokens is more prominent in a non-English language.
Byte-level BPE is a clever tweak of its predecessor BPE in which bytes are included in the base vocabulary.
Since a byte consists of 8 bits, there are 2<sup>8</sup> i.e. 256 combinations of words that are included in the base vocabulary.
This helps to tokenize every text without needing an out of vocabulary token.
This clever trick was proposed in [GPT-2 Paper](https://openai.com/blog/better-language-models/).

#### WordPiece

WordPiece is a sub-word tokenization algorithm that is used in language representation models like [BERT](https://arxiv.org/abs/1810.04805) and was outlined in [JAPANESE AND KOREAN VOICE SEARCH](https://static.googleusercontent.com/media/research.google.com/ja//pubs/archive/37842.pdf) paper.

It relies on the same base as BPE, which is to initialize the vocabulary to every character present in the corpus and progressively learn a given number of merge rules.
The difference is in choosing the tokens to be merged.
BPE chooses the most frequent pair of tokens to be substituted with a new token.
In contrast to it, WordPiece chooses the pair which will maximize the likelihood of the corpus once merged.

Mathematically speaking, if `P(X)` is the probability of occurring a token `X` in the corpus, BPE chooses the pair `yz` with the maximum probability of `P(yz)`.
In contrast to it, WordPiece chooses a pair `yz` with maximum conditional probability of `P(yz|y,z)` which is the probability of getting a `yz` pair given that the tokens `y` and `z` occur.
In layman’s terms, it evaluates what it loses by merging two symbols and makes sure it’s worth it.
It focuses more on rare sub-word tokens.

#### SentencePiece

All the tokenizing methods discussed above required some pre-tokenization.
Those methods act like sub-word tokenizers which have to know what words are.
Since some languages like Chinese, Japanese, Thai, etc. don't use spaces to separate words, the aforementioned methods cannot be used in those languages.

[SentencePiece](https://arxiv.org/abs/1808.06226) introduces a novel technique for tokenization.
It treats the input as a raw stream, i.e. sentence as a whole rather than a collection of words, and includes space in the set of characters to use and then uses BPE or unigram to construct the appropriate vocabulary.

The implementation of this algorithm commonly represents a space character as a `_` character.
So we may find different tokens with `_` in them.
The models like XLM described in [Cross-lingual Language Model Pretraining](https://arxiv.org/abs/1901.07291) described in use this kind of tokenization.
This is considered to be the state-of-the-art tokenizer at the time of writing this document.

## One-Hot Encoding

Since tokens are just numbers, they might represent a token to be of higher importance than others.
So they need to be converted into a one-hot vector.
One-hot vectors are those vectors in which only one component of the vector is hot (one), all the other components are zero.
But the problem with the one-hot vector is that their dimension is equal to the vocabulary size of the corpus, which can be quite large.
Also since the vectors are one-hot encoded, they are all perpendicular to each other.
So there is no sense of similarity between them.

## Word Embedding

People started to search for a method to compress the one-hot vector to save space and provide a sense of similarity between the word vectors.
In layman’s words, word embedding is a learned representation of text where words with similar meanings have similarities among them.

The tokens are passed from the tokenizer to the model which then picks up a vector of a predefined dimension, which is unique to each token, from a matrix called embedding matrix.
The embedding matrix has one dimension to be the vocabulary size and another dimension to be the embedding size.
The embedding size is the dimension of each dense vector that is used to represent a token.
More the dimension, more similarities can be captured between the words.
But generally, 300-dimensional embedding is sufficient to capture the similarities of the word vectors.

Dense vectors, also known as embeddings, for different words are compared using distance metrics like cosine, euclidean distance, etc. to find the similarities between them.
Due to the word embeddings, the effect of swapping a word with its similar word is almost similar to the model.
Word embeddings can capture the syntactic and semantic similarity between words.
**Syntactic similarity** refers to the similarity in the grammatical structure of the words whereas **semantic similarity** refers to the similarity in the meaning of the words and their interpretation.
This enables the model to answer the question “Man is to king as woman is to what?”.
Answering these types of questions successfully means that the model was able to find the semantic similarities between them.
This particular example tells us that the embedding of the learned vectors was able to find a dimension corresponding to “royalness”.

For the sake of illustration, the embeddings produced by [word2vec](https://arxiv.org/abs/1301.3781) are similar to the one below.
The figure shows that the resulting vector from _king-man+woman_ doesn't exactly equal _queen_, but _queen_ is the closest word to it from all the other word embeddings in the corpus.

![king - man + wan ~= queen](/images/king-man-woman.webp#center)

_Credit: [The Illustrated Word2vec – Jay Alammar](https://jalammar.github.io/illustrated-word2vec/)_

Embeddings capture the direction to different things like gender, tense, etc.
Since the bases are not predefined, certain combinations of the learned bases represent different quantities.
The figure below helps to understand this concept more clearly.

![word embeddings capturing directions](/images/direction_in_word_embeddings.webp#center)

Since the embeddings are vectors in a higher dimension and show the similarities between the words, they can be projected down to 2D or 3D space using various techniques like [UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction](https://umap-learn.readthedocs.io/en/latest/), [t-distributed stochastic neighbor embedding](https://en.wikipedia.org/wiki/T-distributed_stochastic_neighbor_embedding), [Principal Component Analysis (PCA)](https://en.wikipedia.org/wiki/Principal_component_analysis), etc. according to the need.
The projections of common embeddings can be found in [Embedding projector - visualization of high-dimensional data](https://projector.tensorflow.org/) where you can upload your custom embeddings too.
A sample image showing the nearest ten points of word _man_ for the _Word2Vec 10K_ model in terms of cosine similarity, projected to 2D space using <abbr title="Principal Component Analysis">PCA</abbr> and sphering the data is shown below.

![nearest ten points of man](/images/nearest_ten_points_of_man.webp#center)

Since the word embeddings are built solely upon the data seen by the model, they may contain biases in terms of race and gender as described in [Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings](https://arxiv.org/abs/1607.06520). The embeddings should be debiased before taking the model into production.

## Training Word Embeddings

Each token picks up a randomly initialized vector from the embedding matrix using its unique index and the loss of the model is backpropagated to update the vectors and ultimately the matrix.
When the training is complete the embedding matrix contains dense vectors for each token which can be used to make different interpretations about the model and the particular task on which the model was trained.

Word embeddings are normally trained for a particular task.
The word embedding for the task of classifying the text can be different from that of generating alt text for the images.
Pre-trained word embedding can also be used and fine-tuned for the specific task.
Since the pre-trained embeddings have more vocab size than text available for the specific task they help even when we get the words that were not present in the training data while testing.
Those pre-trained embeddings are trained in an unsupervised way so that they preserve the context of the text in which they are trained and maximize the likelihood of the sentences in the training set.

## References and Further Readings

- [Summary of the Tokenizers - Hugging Face](https://huggingface.co/transformers/tokenizer_summary.html)
- [The Illustrated Word2vec - Jay Alammar](https://jalammar.github.io/illustrated-word2vec/)

So that’s it for today. Let me know your views and reactions in the comments below.
