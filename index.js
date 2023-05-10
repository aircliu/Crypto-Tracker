let chart;


function createBitcoinChart(dates, prices) {
    const ctx = document.getElementById('bitcoinChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Bitcoin price',
                data: prices,
                borderColor: 'rgba(246, 208, 75, 1)',
                backgroundColor: 'rgba(246, 208, 75, 0.1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        font: {
                            size: 16
                        }
                    }
                },
                x: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 16
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 16
                        }
                    },
                    onClick: function (event, legendItem, context) {
                        const coin = chart.data.datasets[0].label.split(' ')[0].toLowerCase();
                        const coins = ['bitcoin', 'ethereum', 'tether', 'litecoin', 'cardano', 'dogecoin'];
                        const coinIndex = coins.indexOf(coin);
                        const nextCoin = coins[(coinIndex + 1) % coins.length];
                        fetchCoinData(nextCoin); // Fetch next coin data when the legend is clicked
                    }
                    
                }
            }
        }
    });
}


function fetchCoinData(coin) {
    fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=30&interval=daily`)
        .then(res => res.json())
        .then(json => {
            const dates = json.prices.map(price => new Date(price[0]).toLocaleDateString());
            const prices = json.prices.map(price => price[1]);

            updateChart(coin, dates, prices);
        });
}


function updateChart(coin, dates, prices) {
    chart.data.labels = dates;
    chart.data.datasets[0].data = prices;
    chart.data.datasets[0].label = `${coin.charAt(0).toUpperCase() + coin.slice(1)} price`;
    chart.update();
}




fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily')
    .then(res => res.json())
    .then(json => {
        const dates = json.prices.map(price => new Date(price[0]).toLocaleDateString());
        const prices = json.prices.map(price => price[1]);

        createBitcoinChart(dates, prices);
    });


fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Ctether%2Cethereum%2Clitecoin%2Ccardano%2Cdogecoin&vs_currencies=usd&include_24hr_change=true')
.then(res => res.json())
    .then(json => {
        const container = document.querySelector('.container');
        const coins = Object.getOwnPropertyNames(json);


        for (let coin of coins) {
            const coinInfo = json[`${coin}`];
            const price = coinInfo.usd;
            const change = coinInfo.usd_24h_change.toFixed(5);

            container.innerHTML += `
                <div class="coin ${change < 0 ? 'falling' : 'rising'}">
                    <div class="coin-logo">
                        <img src="images/${coin}.png">
                    </div>
                    <div class="coin-name">
                        <h3>${coin}</h3>
                        <span>/USD</span>
                    </div>
                    <div class="coin-price">
                        <span class="price">$${price}</span>
                        <span class="change">${change}</span>
                    </div>
                </div>
        `;
        }
    });

