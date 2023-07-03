import axios from 'axios';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

new SlimSelect({
  select: '#single',
});

axios.defaults.headers.common['x-api-key'] =
  'live_569M8WA1rbrKuOyDARN9KjkPG0iY3771VVLpsuMj7XjhIKgb0fZfDzkMSaSfkH1k';

import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  selector: document.querySelector('.breed-select'),
  divCatInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  myLoader: document.querySelector('.myloader'),
};

refs.myLoader.classList.add('hidden');
refs.divCatInfo.classList.add('hidden');

//function getAllCats(arr)

function getAllCats(arr) {
  arr.forEach(cat => {
    const optionsElement = document.createElement('option');
    optionsElement.value = cat.id;
    optionsElement.textContent = cat.name;
    refs.selector.appendChild(optionsElement);
  });
}

// function addInfo

addInfo();
function addInfo() {
  fetchBreeds().then(getAllCats).catch(showError);
}

refs.selector.addEventListener('change', createModal);

// function onSelectBreed

function onSelectBreed() {
  refs.loader.classList.remove('hidden');
  refs.myLoader.classList.remove('hidden');

  const selectedValue = refs.selector.options[refs.selector.selectedIndex];
  const selectedId = selectedValue.value;

  return selectedId;
}

// function markup
function markup(arr) {
  let imgUrl = arr.map(link => link.url);

  let catDescription = arr.map(cat => cat.breeds[0].description);

  let catTemperament = arr.map(cat => cat.breeds[0].temperament);

  const markup = `<img class="cat-img" src="${imgUrl}" width="400">
    <h2 class="heading ">Description:</h2> <p class="text ">${catDescription}</p>
    <h2 class="heading ">Temperament:</h2><p class="text ">${catTemperament}</p>`;

  refs.divCatInfo.insertAdjacentHTML('beforeend', markup);
  new SlimSelect({
    select: '#single',
  });
}

// function createModal
function createModal() {
  const breedId = onSelectBreed();
  const isContent = document.querySelector('.cat-img');

  if (isContent) {
    clearContent();
  }

  fetchCatByBreed(breedId)
    .then(markup)
    .catch(() => {
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    })
    .finally(() => {
      refs.loader.classList.add('hidden');
      refs.divCatInfo.classList.remove('hidden');
      refs.myLoader.classList.add('hidden');
    });
}

const clearContent = () => {
  const children = Array.from(refs.divCatInfo.children);
  children.forEach(child => child.remove());
};

function showError() {
  Notify.failure('Oops! Something went wrong! Try reloading the page!');
}
