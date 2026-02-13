import csv
import random

def calculate_bmi(height, weight):
    return weight / ((height / 100) ** 2)

def get_label(bmi):
    if bmi < 18.5:
        return 'Underweight'
    elif 18.5 <= bmi < 25:
        return 'Normal'
    elif 25 <= bmi < 30:
        return 'Overweight'
    else:
        return 'Obese'

def generate_data(filename, num_samples=500):
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['Height', 'Weight', 'BMI', 'Label']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        
        # Ranges
        height_range = (140, 210) # cm
        weight_range = (40, 160) # kg - adjusted slightly to ensure realistic spread
        
        for _ in range(num_samples):
            height = random.randint(*height_range)
            weight = random.randint(*weight_range)
            bmi = calculate_bmi(height, weight)
            label = get_label(bmi)
            
            writer.writerow({
                'Height': height,
                'Weight': weight,
                'BMI': f"{bmi:.2f}",
                'Label': label
            })
            
    print(f"Successfully generated {num_samples} records in {filename}")

if __name__ == "__main__":
    generate_data('d:/BMI/dataset/bmi_data.csv')
