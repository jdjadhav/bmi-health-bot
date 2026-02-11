document.addEventListener('DOMContentLoaded', () => {
    // 1. Get latest data
    const latestData = JSON.parse(localStorage.getItem('currentBMIResult'));
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];

    if (!latestData) {
        // No data found, redirect to calc page
        // window.location.href = 'index.html'; 
        // For dev, allow viewing empty dashboard
        const insightBox = document.getElementById('dashInsight');
        if (insightBox) insightBox.innerText = "No calculation found. Start a new one!";
    } else {
        renderDashboard(latestData);
    }

    renderHistory(history);

    // Chart.js instance storage
    let myChart = null;
    renderChart(history);

    // Re-render chart on theme change
    document.addEventListener('themeChange', () => {
        renderChart(history);
    });

    function renderDashboard(data) {
        // Basic Info
        const dashBMI = document.getElementById('dashBMI');
        const dashCategory = document.getElementById('dashCategory');
        if (dashBMI) dashBMI.innerText = data.bmi;
        if (dashCategory) dashCategory.innerText = data.label;

        // Insights
        if (data.recommendations && data.recommendations.insight) {
            const dashInsight = document.getElementById('dashInsight');
            if (dashInsight) dashInsight.innerText = `"${data.recommendations.insight}"`;
        }

        // Recommendations
        const dietList = document.getElementById('dietList');
        const exList = document.getElementById('exerciseList');

        // Clear previous list items to prevent duplication on re-render
        if (dietList) dietList.innerHTML = '';
        if (exList) exList.innerHTML = '';

        if (data.recommendations) {
            if (dietList && data.recommendations.diet) {
                data.recommendations.diet.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    dietList.appendChild(li);
                });
            }

            if (exList && data.recommendations.exercise) {
                data.recommendations.exercise.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    exList.appendChild(li);
                });
            }
        }

        // Color coding
        const badge = document.querySelector('.status-badge');
        let color = '#6C63FF';
        if (data.label === 'Normal') color = '#1dd1a1';
        else if (data.label === 'Overweight') color = '#ff9f43';
        else if (data.label === 'Obese') color = '#ff6b6b';
        else if (data.label === 'Underweight') color = '#54a0ff';

        if (badge) badge.style.color = color;

        // Update Visual Scale
        updateBMIScale(data.bmi);
    }

    function updateBMIScale(bmi) {
        const marker = document.getElementById('bmiMarker');
        if (!marker) return;

        // Scale range: 0 to 40 (approx)
        // 18.5 is start of normal
        // 25 is start of overweight
        // 30 is start of obese
        // Max clamped at 40 for visual purposes

        // Calculate percentage (0-100%)
        // Let's assume the bar represents BMI 10 to 45 for better visualization
        const minBMI = 10;
        const maxBMI = 45;

        let percentage = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;

        // Clamp between 0% and 100%
        percentage = Math.max(0, Math.min(100, percentage));

        // Apply position
        setTimeout(() => {
            marker.style.left = `${percentage}%`;
        }, 100); // Small delay to allow CSS transition to trigger
    }

    function renderHistory(history) {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;

        tbody.innerHTML = ''; // Clear existing rows
        // Show last 5 entries, newest first
        const recent = history.slice().reverse().slice(0, 5);

        recent.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${entry.date}</td>
            <td><strong>${entry.bmi}</strong></td>
            <td>${entry.label}</td>
        `;
            tbody.appendChild(row);
        });
    }

    function renderChart(history) {
        const canvas = document.getElementById('bmiChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Prepare data (reverse back to chronological order for chart)
        const chartData = history.slice().splice(-10); // Last 10 entries
        const labels = chartData.map(entry => entry.date);
        const bmiValues = chartData.map(entry => entry.bmi);

        // Get theme colors
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? '#f0f0f0' : '#333';

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'BMI Trend',
                    data: bmiValues,
                    borderColor: '#6C63FF',
                    backgroundColor: 'rgba(108, 99, 255, 0.2)',
                    borderWidth: 3,
                    tension: 0.4, // Smooth curves
                    pointBackgroundColor: isDark ? '#fff' : '#6C63FF',
                    pointBorderColor: '#6C63FF',
                    pointRadius: 5,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                        titleColor: isDark ? '#fff' : '#333',
                        bodyColor: isDark ? '#fff' : '#666',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: textColor
                        }
                    }
                }
            }
        });
    }
});
