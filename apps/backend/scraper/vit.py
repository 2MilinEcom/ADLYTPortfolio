import requests
from PIL import Image
import torch

from transformers import OwlViTProcessor, OwlViTForObjectDetection

def vit_box(path, description):
    """
    Given an image path and a text description, returns the bounding box for the object best matching the description.
    Args:
        path (str): Path to the image file.
        description (str): Text prompt describing the object to detect.
    Returns:
        list: Bounding box coordinates [x0, y0, x1, y1] for the best match, or None if no match found.
    """
    processor = OwlViTProcessor.from_pretrained("google/owlvit-base-patch32")
    model = OwlViTForObjectDetection.from_pretrained("google/owlvit-base-patch32")

    image_path = path
    image = Image.open(image_path).convert("RGB")
    texts = [[f"{description}"]]

    inputs = processor(text=texts, images=image, return_tensors="pt")
    outputs = model(**inputs)

    # Target image sizes (height, width) to rescale box predictions [batch_size, 2]
    target_sizes = torch.Tensor([image.size[::-1]])
    # Convert outputs (bounding boxes and class logits) to COCO API
    results = processor.post_process_object_detection(outputs=outputs, threshold=0.01, target_sizes=target_sizes)

    i = 0  # Retrieve predictions for the first image for the corresponding text queries
    text = texts[i]
    boxes, scores, labels = results[i]["boxes"], results[i]["scores"], results[i]["labels"]
    lst = []
    # Print detected objects and rescaled box coordinates
    for box, score, label in zip(boxes, scores, labels):
        box = [round(i, 2) for i in box.tolist()]
        print(f"Detected {text[label]} with confidence {round(score.item(), 3)} at location {box}")
        lst.append((box, score.item()))

    # Return the box with the highest score, or None if no boxes
    return max(lst, key=lambda x: x[1])[0] if lst else None 