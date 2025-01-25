# import torch

# if torch.cuda.is_available():
#     print(f"GPU is available. Using device: {torch.cuda.get_device_name(0)}")
# else:
#     print("No GPU available.")
import tensorflow as tf
print("TensorFlow version:", tf.__version__)
print("CUDA version:", tf.sysconfig.get_build_info()['cuda_version'])
print("cuDNN version:", tf.sysconfig.get_build_info()['cudnn_version'])

