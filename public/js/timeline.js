
const days = document.querySelectorAll('.days li')
const hours = document.querySelector('.numbers .hours')
const minutes = document.querySelector('.numbers .minutes')
const month = document.querySelector('.date .month')
const dayMonth = document.querySelector('.date .day-month')
const year = document.querySelector('.date .year')

let date = new Date()

days[date.getDay()].classList.add('actual')

const addSpace = num => {
	splitNum = num.toString().split('')
	result = num

	if(splitNum.length !== 2) {
		result = '0' + num
	}

	return result
}

setInterval(() => {
	let date = new Date()
	hours.textContent = addSpace(date.getHours())
	minutes.textContent = addSpace(date.getMinutes())
	month.textContent = addSpace(date.getMonth() + 1)
	dayMonth.textContent = addSpace(date.getDate())
	year.textContent = date.getFullYear()
}, 1000)

const preloader = document.querySelector('.preloader')
document.addEventListener('DOMContentLoaded', () => {
	preloader.style.display = 'none'
})

