
class BudgetTracker {
	transactions = [];
	chart = null;

	//the elements
	totalEl = document.querySelector(`#total`);
	tableEl = document.querySelector(`#tbody`);

	nameEl = document.querySelector(`#t-name`);
	amountEl = document.querySelector(`#t-amount`);
	errorEl = document.querySelector(`form .error`);

	constructor() {
		this.getData();
	}

	//fetch data
	getData() {
		fetch(`/api/transaction`)
			.then(response => response.json())
			.then(data => {
				// save db data on global variable
				this.transactions = data;
				this.displayTotal();
				this.createTable();
				this.createChart();
			});
	}

	displayTotal() {
		const total = this.transactions.reduce(	(currTotal, t) => currTotal + parseInt(t.value), 0);
		this.totalEl.textContent = total;
	}


	createTable() {
		this.tableEl.innerHTML = ``;
		this.transactions.forEach(transaction => {
			// create and populate a table row
			const tr = document.createElement(`tr`);
			tr.innerHTML = `<td>${transaction.name}</td><td>${transaction.value}</td>`;
			this.tableEl.appendChild(tr);
		});
	}

	createChart() {
		// copy array and reverse it
		const reversedTransactions = this.transactions.slice().reverse();
		let sum = 0;

		// create date labels for chart
		const labels = reversedTransactions.map(t => {
			const date = new Date(t.date);
			return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
		});

		// create incremental values for chart
		const data = reversedTransactions.map(t => {
			sum += parseInt(t.value);
			return sum;
		});

		// remove old chart if it exists
		if (this.chart) {
			this.chart.destroy();
		}

		const ctx = document.getElementById(`chart`).getContext(`2d`);

		this.chart = new Chart(ctx, {
			type: `line`,
			data: {
				labels,
				datasets: [
					{
						label: `Total Over Time`,
						fill: true,
						backgroundColor: `#5bc0de`,
						data
					}
				]
			}
		});
	}

	sendTransaction(isAdding) {
		// validate form
		if (this.nameEl.value === `` || this.amountEl.value === ``) {
			this.errorEl.textContent = `Missing Information`;
			return;
		} else {
			this.errorEl.textContent = ``;
		}

		// create record
		const transaction = {
			name: this.nameEl.value,
			value: this.amountEl.value,
			date: new Date().toISOString()
		};

		// if subtracting funds, convert amount to negative number
		if (!isAdding) {
			transaction.value *= -1;
		}

		// add to beginning of current array of data
		this.transactions.unshift(transaction);

		// re-run logic to populate ui with new record
		this.createChart();
		this.createTable();
		this.displayTotal();

		// also send to server
		fetch(`/api/transaction`, {
			method: `POST`,
			body: JSON.stringify(transaction),
			headers: {
				Accept: `application/json, text/plain, */*`,
				'Content-Type': `application/json`
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data.errors) {
					this.errorEl.textContent = `Missing Information`;
				} else {
					// clear form
					this.nameEl.value = ``;
					this.amountEl.value = ``;
				}
			})
			.catch(err => {
				// fetch failed, so save in indexed db
				saveRecord(transaction);

				// clear form
				this.nameEl.value = ``;
				this.amountEl.value = ``;
			});
	}
}


const InitApp = () => {
	const budgetTracker = new BudgetTracker();

	document.querySelector(`#add-btn`).addEventListener(`click`, event => {
		event.preventDefault();
		budgetTracker.sendTransaction(true);
	});


	document.querySelector(`#sub-btn`).addEventListener(`click`, event => {
		event.preventDefault();
		budgetTracker.sendTransaction(false);
	});
}

InitApp();

