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

function countdown(elementName, minutes, seconds) {
    let element, endTime, hours, mins, msLeft, time;

    function twoDigits(n) {
        return (n <= 9 ? '0' + n : n);
    }

    function updateTimer() {
        msLeft = endTime - (+new Date);

        if (msLeft < 1000) {
            element.innerHTML = '0:00';
        } else {
            time = new Date(msLeft);
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());

            // Save current time locally
            localStorage.setItem('lastHValue', hours);
            localStorage.setItem('lastMValue', mins);
            localStorage.setItem('lastSValue', time.getUTCSeconds());

            setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
        }
    }

    element = document.getElementById(elementName);
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;

    updateTimer();
}

if (localStorage.getItem('lastHValue')) {
    let lastHValue = parseInt(localStorage.getItem('lastHValue')),
        lastMValue = parseInt(localStorage.getItem('lastMValue')),
        lastSValue = parseInt(localStorage.getItem('lastSValue'));

    let totalMValue = parseInt((lastHValue * 60) + lastMValue);

    countdown('countdown', totalMValue, lastSValue);
} else {
    countdown('countdown', 1439, 59);
}

const preloader = document.querySelector('.preloader')
document.addEventListener('DOMContentLoaded', () => {
	preloader.style.display = 'none'
})

