import re
from collections import Counter
from typing import Dict, List
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from .schemas import SentimentResponse, WordFreq

_analyzer = SentimentIntensityAnalyzer()

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
    "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't",
    "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
    "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
    "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on",
    "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
    "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
    "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
    "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we",
    "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with",
    "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
    "yours", "yourself", "yourselves", "felt", "feel", "workout", "session", "today", "day"
}


def analyze_workout_feedback(note: str) -> SentimentResponse:
    scores = _analyzer.polarity_scores(note)
    compound = scores["compound"]

    if compound >= 0.05:
        label = "Positive"
        summary = "Great session! Your sentiment shows high motivation, physical endurance, and workout satisfaction."
    elif compound <= -0.05:
        label = "Negative"
        summary = "Challenging workout. High strain or fatigue noted. Consider prioritising recovery, hydration, and lower intensity next time."
    else:
        label = "Neutral"
        summary = "Balanced routine. Steady physical effort maintained without extreme fatigue or euphoric peak."

    # Extract clean words for frequency / word-cloud
    words = re.findall(r"\b[a-zA-Z]{3,}\b", note.lower())
    meaningful_words = [w for w in words if w not in STOPWORDS]
    counts = Counter(meaningful_words)

    word_freqs: List[WordFreq] = [
        WordFreq(text=w, value=c) for w, c in counts.most_common(20)
    ]

    return SentimentResponse(
        sentiment_label=label,
        compound_score=round(compound, 3),
        positive_score=round(scores["pos"], 3),
        neutral_score=round(scores["neu"], 3),
        negative_score=round(scores["neg"], 3),
        summary=summary,
        word_frequencies=word_freqs,
        total_words=len(words),
    )

