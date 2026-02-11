import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
import pickle
import os

# Load dataset
dataset_path = os.path.join(os.path.dirname(__file__), '../dataset/bmi_data.csv')
if not os.path.exists(dataset_path):
    print(f"Error: Dataset not found at {dataset_path}")
    exit(1)

data = pd.read_csv(dataset_path)

# Prepare features and labels
X = data[['Height', 'Weight']]
y = data['Label']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

# Save model
model_path = os.path.join(os.path.dirname(__file__), 'bmi_model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(knn, f)

print(f"Model trained and saved to {model_path}")
print(f"Accuracy: {knn.score(X_test, y_test)}")
