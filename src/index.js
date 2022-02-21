import './css/styles.css';
import debounce from 'lodash/debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import CountryListTpl from './template/template_list.hbs';
import CountryCardTpl from './template/template_info.hbs';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(listEl);
    cleanMarkup(infoEl);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.dir(data);
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name');
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(listEl);
      cleanMarkup(infoEl);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(listEl);
    const mapArrayData = data => {
      return data.map(
        ({ name, capital, population, flags, languages }) =>
          CountryCardTpl({ name, capital, population, flags, languages:Object.values(languages) }))
    }
    const markupInfo = mapArrayData(data);
    infoEl.innerHTML = markupInfo;
  } else {
    cleanMarkup(infoEl);
    const mapArrayDataList = data => {
      return data.map(({ name, flags }) =>
        CountryListTpl({ name, flags })).join('');
    }
    const markupList = mapArrayDataList(data);
    listEl.innerHTML = markupList;
  }
};

inputEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));