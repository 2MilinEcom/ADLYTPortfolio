from huggingface_hub import hf_hub_download
from segment_anything import build_sam, SamPredictor
import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
from vit import vit_box
from segment_anything import sam_model_registry

def mask_image(product_path, frame_path, product_prompt=None, frame_prompt=None):
    """
    Masks both the product and frame images using the SAM model and saves the masked images.
    Args:
        product_path (str): Path to the product image.
        frame_path (str): Path to the frame image to be masked.
        product_prompt (str, optional): Product prompt (used for object detection in the product image).
        frame_prompt (str, optional): Frame prompt (used for object detection in the frame image).
    """
    # Log prompts if provided
    if product_prompt:
        print(f"Product prompt: {product_prompt}")
    if frame_prompt:
        print(f"Frame prompt: {frame_prompt}")

    # Download and load the model
    chkpt_path = hf_hub_download("ybelkada/segment-anything", "checkpoints/sam_vit_b_01ec64.pth")
    sam = sam_model_registry["vit_b"](checkpoint=chkpt_path)
    predictor = SamPredictor(sam)

    # Helper to process and save masked image
    def process_and_save(image_path, prompt, label):
        image_array = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
        predictor.set_image(image_array)
        input_box = np.array(vit_box(image_path, prompt))
        masks, scores, _ = predictor.predict(
            point_coords=None,
            point_labels=None,
            box=input_box[None, :],
            multimask_output=True,  # Enable multiple masks
        )
        # Find the highest scoring mask
        best_idx = scores.argmax()
        mask = masks[best_idx]
        h, w = mask.shape[-2:]
        masked_image = mask.reshape(h, w, 1) * image_array
        base, ext = os.path.splitext(image_path)
        masked_path = base + f"_masked_{label}.png"
        plt.imsave(masked_path, masked_image.astype(np.uint8))
        print(f"Masked image saved to: {masked_path}")
        return masked_path

    # Process product image
    if product_path and product_prompt:
        process_and_save(product_path, product_prompt, "product")
    # Process frame image
    if frame_path and frame_prompt:
        process_and_save(frame_path, frame_prompt, "frame")


