document.getElementById('bmiForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const calculateBtn = document.getElementById('calculateBtn');

    // Clear previous errors
    clearErrors();

    let isValid = true;

    // Validate Height
    const hValue = parseFloat(height);
    if (!height) {
        showError('height', 'Please enter your height.');
        isValid = false;
    } else if (hValue < 50 || hValue > 300) {
        showError('height', 'Height must be between 50 and 300 cm.');
        isValid = false;
    }

    // Validate Weight
    const wValue = parseFloat(weight);
    if (!weight) {
        showError('weight', 'Please enter your weight.');
        isValid = false;
    } else if (wValue < 20 || wValue > 500) {
        showError('weight', 'Weight must be between 20 and 500 kg.');
        isValid = false;
    }

    if (!isValid) return;

    function showError(fieldId, msg) {
        const input = document.getElementById(fieldId);
        const errorSpan = document.getElementById(fieldId + 'Error');
        if (input) input.classList.add('invalid');
        if (errorSpan) {
            errorSpan.innerText = msg;
            errorSpan.classList.add('visible');
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('input').forEach(el => el.classList.remove('invalid'));
    }

    // Auto-clear on input
    ['height', 'weight'].forEach(id => {
        document.getElementById(id).addEventListener('input', function () {
            this.classList.remove('invalid');
            const err = document.getElementById(id + 'Error');
            if (err) err.classList.remove('visible');
        });
    });

    // Show loading state
    const originalBtnText = calculateBtn.innerText;
    calculateBtn.innerText = "Calculating...";
    calculateBtn.disabled = true;

    try {
        // Call local Flask API
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ height, weight })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Save to LocalStorage
        const resultData = {
            ...data,
            date: new Date().toLocaleDateString()
        };

        localStorage.setItem('currentBMIResult', JSON.stringify(resultData));

        // Update History
        const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
        history.push(resultData);
        localStorage.setItem('bmiHistory', JSON.stringify(history));

        // Redirect to Dashboard
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to calculate BMI. Please ensure the backend server is running.');
    } finally {
        calculateBtn.innerText = originalBtnText;
        calculateBtn.disabled = false;
    }
});

function displayResult(bmi, category) {
    const resultDiv = document.getElementById('result');
    const bmiValueElement = document.getElementById('bmiValue');
    const bmiCategoryElement = document.getElementById('bmiCategory');
    const resultCard = document.querySelector('.result-card');

    bmiValueElement.innerText = bmi;
    bmiCategoryElement.innerText = category;

    // Set color based on category
    let color = '#6C63FF';
    if (category === 'Normal') color = '#1dd1a1';
    else if (category === 'Overweight') color = '#ff9f43';
    else if (category === 'Obese') color = '#ff6b6b';
    else if (category === 'Underweight') color = '#54a0ff';

    resultCard.style.borderLeftColor = color;
    bmiCategoryElement.style.color = color;

    resultDiv.classList.remove('hidden');

    // Re-initialize anti-gravity for the new visible element
    if (window.initAntiGravity) {
        // slight delay to ensure layout is computed
        setTimeout(() => {
            window.initAntiGravity('.result-card'); // Target the card specifically regarding the feedback
            // Or target the container if preferred, but existing code put class on wrapper
            window.initAntiGravity();
        }, 100);
    }
}
