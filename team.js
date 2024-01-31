// Global variables to store team details and transaction history
let teamDetails = {};
let teamId = null;
let portWorth = 0;
let portfolio = [];

// Function to handle broker login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const loginApiUrl = 'https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/teams/auth';

        const response = await fetch(loginApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const responseData = await response.json();
        console.log(responseData)

        if (responseData.statusCode === 200) {
            // Login successful, store team ID
            teamId = responseData.data;

            // Hide the login section and show the broker interface section
            document.getElementById('teamLoginForm').classList.add('hidden');
            document.getElementById('teamInterface').classList.remove('hidden');
            updateTeamDetails();

            // Fetch latest stock prices (assuming this function is defined in your app)
            // fetchLatestStockPrices();
        } else {
            // Handle login failure
            alert(`Login failed. ${responseData.error}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. An unexpected error occurred.');
    }
}

function holdings()
{
    portfolio = [];
    portWorth = 0;
    teamDetails.portfolio.forEach(element => {
        let stockDet = teamDetails.stockDetails.find((ele)=> {return ele._id===element.stocks})
        portfolio.push({
            "_id" : element.stocks,
            "numberOfStocks" : element.numberOfStocks,
            "sellingPrice" : (stockDet.valuation/stockDet.availableStocks).toFixed(2),
            "companyName" : stockDet.companyName
        })

        portfolio.forEach(holdings => {
            portWorth += holdings.sellingPrice * holdings.numberOfStocks
        })
    });

    // console.log(portfolio)
    // console.log(portWorth)

}

// Function to update team details and transaction history
async function updateTeamDetails() {
    teamDetails = await fetchTeamDetails(teamId);
    document.getElementById('teamId').textContent = teamDetails.teamId || 'N/A';
    document.getElementById('teamName').textContent = teamDetails.teamName || 'N/A';
    document.getElementById('currentCashBalance').textContent = teamDetails.currentBalance.toFixed(2);
    
    holdings();
    document.getElementById('portfolioWorth').textContent = portWorth.toFixed(2);
    
    const holdingsSection = document.getElementById('holdingsSection');
    holdingsSection.innerHTML = '';

    portfolio.forEach(holding => {
        const holdingCard = document.createElement('div');
        holdingCard.className = 'bg-white p-4 rounded-md shadow-md';

        const stockNameElement = document.createElement('h3');
        stockNameElement.className = 'text-xl font-bold mb-2';
        stockNameElement.textContent = holding.companyName;
        holdingCard.appendChild(stockNameElement);

        const holdingDetailsElement = document.createElement('p');
        holdingDetailsElement.className = 'text-gray-600 p-4';
        holdingDetailsElement.textContent = `Quantity: ${holding.numberOfStocks} \n Current Stock Price: ${holding.sellingPrice}`;
        holdingCard.appendChild(holdingDetailsElement);

        holdingsSection.appendChild(holdingCard);
    });

}
async function fetchTeamDetails(teamId) {
    try {
        
        const teamDetailsEndpoint = `https://stock-market-simulator-qn698.ondigitalocean.app/api/v1/teams/getPortfolioDetails?id=${teamId}`;
        const response = await fetch(teamDetailsEndpoint);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching team details for Team ID ${teamId}:`, error);
        return {};
    }
}


//updateTeamDetails();
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('refresh').addEventListener('click', updateTeamDetails);
// Update data regularly (every 5 minutes in this example, adjust as needed)
// setInterval(() => {
    
//     updateTeamDetails();
// }, 300000);


// function populateTransactionHistory() {
//     const transactionSection = document.getElementById('transactionSection');
    
//     // Clear existing transaction cards
//     transactionSection.innerHTML = '';

//     transactions.forEach(transaction => {
//         const transactionCard = document.createElement('div');
//         transactionCard.className = 'bg-white p-4 rounded-md shadow-md';

//         const timeElement = document.createElement('p');
//         timeElement.className = 'text-gray-500 mb-2';
//         timeElement.textContent = transaction.time;
//         transactionCard.appendChild(timeElement);

//         const stockNameElement = document.createElement('h3');
//         stockNameElement.className = 'text-xl font-bold mb-2';
//         stockNameElement.textContent = transaction.stockName;
//         transactionCard.appendChild(stockNameElement);

//         const transactionDetailsElement = document.createElement('p');
//         transactionDetailsElement.className = 'text-gray-600';
//         transactionDetailsElement.textContent = `Quantity: ${transaction.quantity} x Price: $${transaction.price} Value: $${transaction.value}`;
//         transactionCard.appendChild(transactionDetailsElement);

//         // Color coding for buy (green) and sell (red) transactions
//         if (transaction.type === 'buy') {
//             transactionCard.classList.add('bg-green-100');
//         } else if (transaction.type === 'sell') {
//             transactionCard.classList.add('bg-red-100');
//         }

//         transactionSection.appendChild(transactionCard);
//     });
// }