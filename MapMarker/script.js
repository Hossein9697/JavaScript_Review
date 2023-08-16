'use strict';

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

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}
`;
  }
}

class Runnig extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
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
    this._setDescription();
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
  #zoomLevel = 13;
  constructor() {
    this._getPosition();
    this._restorePreviousPositions();
    form.addEventListener('submit', this._submitForm.bind(this));
    inputType.addEventListener('change', this._toggleWorkout);
    containerWorkouts.addEventListener('click', this._moveToWorkout.bind(this));
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
    this.#map = L.map('map').setView(coords, this.#zoomLevel);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this._loadForm.bind(this));

    this.#workouts.forEach(workout => this._createMarker(workout));
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
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
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

    this._renderWorkout(workout);

    this._createMarker(workout);

    this._hideForm();

    this._addToLocalStorage();
  }

  _toggleWorkout() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `;
    if (workout.type === 'running')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `;
    if (workout.type === 'cycling')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elev}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
      `;

    form.insertAdjacentHTML('afterend', html);
  }

  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputElevation.value =
      inputDuration.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _moveToWorkout(e) {
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const selectedWorkout = this.#workouts.find(
      workout => workout.id === workoutEl.dataset.id
    );

    this.#map.setView(selectedWorkout.coords, this.#zoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _addToLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _restorePreviousPositions() {
    const workouts = JSON.parse(localStorage.getItem('workouts'));

    if (!workouts) return;

    this.#workouts = workouts;

    this.#workouts.forEach(workout => this._renderWorkout(workout));
  }

  _reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
