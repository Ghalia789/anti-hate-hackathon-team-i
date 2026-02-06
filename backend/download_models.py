"""
Pre-download ML models during Docker build
This prevents downloading at runtime and avoids HuggingFace rate limits
"""
import os
from transformers import pipeline
import torch

def download_models():
    """Download all required models to cache"""
    print("=" * 60)
    print("PRE-DOWNLOADING MODELS FOR DOCKER IMAGE")
    print("=" * 60)
    
    device = 0 if torch.cuda.is_available() else -1
    cache_dir = os.environ.get('TRANSFORMERS_CACHE', '/app/.cache')
    
    print(f"\nDevice: {'GPU' if device == 0 else 'CPU'}")
    print(f"Cache directory: {cache_dir}\n")
    
    # Download sentiment model
    print("1/2 Downloading sentiment analysis model...")
    print("    Model: cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual")
    sentiment_model = pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual",
        device=device
    )
    print("    ✓ Sentiment model downloaded\n")
    
    # Download toxicity model
    print("2/2 Downloading toxicity detection model...")
    print("    Model: unitary/multilingual-toxic-xlm-roberta")
    toxicity_model = pipeline(
        "text-classification",
        model="unitary/multilingual-toxic-xlm-roberta",
        device=device,
        top_k=None
    )
    print("    ✓ Toxicity model downloaded\n")
    
    print("=" * 60)
    print("ALL MODELS SUCCESSFULLY DOWNLOADED!")
    print("Models cached and ready for instant loading")
    print("=" * 60)

if __name__ == "__main__":
    download_models()
