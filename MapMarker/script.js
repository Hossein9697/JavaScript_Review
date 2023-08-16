'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Runnig extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.distance / this.duration;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elev) {
    super(coords, distance, duration);
    this.elev = elev;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.elev / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #mapClickEvent;
  #workouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._submitForm.bind(this));
    inputType.addEventListener('change', this._toggleWorkout);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Can not get your current location');
        }
      );
    }
  }

  _loadMap({ coords: { latitude, longitude } }) {
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this._loadForm.bind(this));
  }

  _loadForm(e) {
    this.#mapClickEvent = e;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _createMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('Hello')
      .openPopup();
  }

  _submitForm(e) {
    e.preventDefault();
    const validateNumber = (...inputs) =>
      inputs.every(input => Number.isFinite(input));
    const validatePositive = (...inputs) => inputs.every(input => input > 0);

    let workout;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const elevation = +inputElevation.value;
    const cadence = +inputCadence.value;

    const location = [
      this.#mapClickEvent.latlng.lat,
      this.#mapClickEvent.latlng.lng,
    ];

    if (inputType.value === 'running') {
      if (
        !validateNumber(distance, duration, cadence) ||
        !validatePositive(distance, duration, cadence)
      )
        return alert('Numbers should be positive');
      workout = new Runnig(location, distance, duration, cadence);
    }
    if (inputType.value === 'cycling') {
      if (
        !validateNumber(distance, duration, elevation) ||
        !validatePositive(distance, duration)
      )
        return alert('Numbers should be positive');
      workout = new Cycling(location, distance, duration, elevation);
    }

    this.#workouts.push(workout);

    this._createMarker(workout);

    inputDistance.value =
      inputCadence.value =
      inputElevation.value =
      inputDuration.value =
        '';
  }

  _toggleWorkout() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
}

const app = new App();
