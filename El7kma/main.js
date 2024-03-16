// Function to fix navigation when scrolling
function fixNavigationOnScroll() {
  let fixedNav = document.querySelector('.header'),
  scrollBtn = document.querySelector('.scrollBtn');
  window.addEventListener("scroll", () => {
    window.scrollY > 20 ? fixedNav.classList.add('active') : fixedNav.classList.remove('active');

    if(window.scrollY > 20) 
    {
      scrollBtn.classList.add('active')
    }
    else{
      scrollBtn.classList.remove('active')

    }
  });
}



function fixNavigationOnScroll() {
  let fixedNav = document.querySelector('.header');
  window.addEventListener("scroll", () => {
    window.scrollY > 100 ? fixedNav.classList.add('active') : fixedNav.classList.remove('active');
  });
}

// Function to change Hadith
function changeHadith() {
  let hadithContainer = document.querySelector('.hadithContainer');
  let next = document.querySelector('.buttons .next');
  let prev = document.querySelector('.buttons .prev');
  let number = document.querySelector('.buttons .number');
  let hadithIndex = 0;

  fetch("https://api.hadith.gading.dev/books/muslim?range=1-300")
    .then(response => response.json())
    .then(data => {
      let hadithList = data.data.hadiths;

      function updateHadith() {
        hadithContainer.innerText = hadithList[hadithIndex].arab;
        number.innerText = `300 - ${hadithIndex + 1}`;
      }

      updateHadith();

      next.addEventListener('click', () => {
        hadithIndex++;
        if (hadithIndex >= hadithList.length) {
          hadithIndex = 0;
        }
        updateHadith();
      });

      prev.addEventListener('click', () => {
        hadithIndex--;
        if (hadithIndex < 0) {
          hadithIndex = hadithList.length - 1;
        }
        updateHadith();
      });
    })
    .catch(error => console.error(error));
}

// Function to get Surahs and Ayahs
function getSurahsAndAyahs() {
  let surahsContainer = document.querySelector(".surahsContainer");

  fetch("https://api.alquran.cloud/v1/meta")
    .then(response => response.json())
    .then(data => {
      let surahs = data.data.surahs.references;
      surahsContainer.innerHTML = "";
      for (let i = 0; i < surahs.length; i++) {
        surahsContainer.innerHTML +=
          `<div class="surah">
            <p>${surahs[i].name}</p>
            <p>${surahs[i].englishName}</p>
          </div>`;
      }

      let surahTitles = document.querySelectorAll('.surah');
      let popup = document.querySelector('.surah-popup');
      let ayatContainer = document.querySelector('.ayat');

      surahTitles.forEach((title, index) => {
        title.addEventListener('click', () => {
          fetch(`https://api.alquran.cloud/v1/surah/${index + 1}`)
            .then(response => response.json())
            .then(data => {
              ayatContainer.innerHTML = "";
              let ayat = data.data.ayahs;
              ayat.forEach(aya => {
                popup.classList.add('active');
                ayatContainer.innerHTML += `<p>(${aya.numberInSurah}) - ${aya.text}</p>`;
              });
              let closepopup = document.querySelector('.close-popup');
              closepopup.addEventListener('click', () => {
                popup.classList.remove('active');
              });
            })
            .catch(error => console.error(error));
        });
      });
    })
    .catch(error => console.error(error));
}

// Function to scroll to the hadith section
function scrollToHadithSection() {
  const hadithButton = document.querySelector('#hadithButton');
  hadithButton.addEventListener('click', () => {
    document.querySelector('.hadithContainer').scrollIntoView({ behavior: 'smooth' });
  });
}

// Main function to initialize everything
function initialize() {
  fixNavigationOnScroll();
  changeHadith();
  getSurahsAndAyahs();
  scrollToHadithSection();
}

// Call the initialize function when the document is loaded
document.addEventListener("DOMContentLoaded", initialize);

document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://api.aladhan.com/v1/timingsByCity?city=cairo&country=egypt&method=8";

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const prayerTimes = data.data.timings;
          const prayerNamesArabic = {
              Fajr: 'الفجر',
              Dhuhr: 'الظهر',
              Asr: 'العصر',
              Maghrib: 'المغرب',
              Isha: 'العشاء'
          };
          const prayerTimes12HourArabic = convertTo12HourFormatArabic(prayerTimes, prayerNamesArabic);
          displayPrayerTimes(prayerTimes12HourArabic);
      })
      .catch(error => {
          console.error("Error fetching prayer times:", error);
      });

  function convertTo12HourFormatArabic(prayerTimes, prayerNamesArabic) {
      const prayerTimes12HourArabic = {};
      for (const [name, time] of Object.entries(prayerTimes)) {
          const arabicName = prayerNamesArabic[name];
          if (arabicName) {
              prayerTimes12HourArabic[arabicName] = formatTime12Hour(time);
          }
      }
      return prayerTimes12HourArabic;
  }

  function formatTime12Hour(time) {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours < 12 ? "ص" : "م";
      const hours12 = hours % 12 || 12;
      const hoursZeroPadded = hours12.toString().padStart(2, '0');
      const minutesZeroPadded = minutes.toString().padStart(2, '0');
      return `${hoursZeroPadded}:${minutesZeroPadded} ${period}`;
  }

  function displayPrayerTimes(prayerTimes) {
    const prayerList = document.querySelector('.prayer-list');

    for (const [name, time] of Object.entries(prayerTimes)) {
        const prayerItem = document.createElement('div');
        prayerItem.classList.add('prayer-item');
        if (name === 'الفجر' || name === 'المغرب') {
            prayerItem.innerHTML = `<strong style="color: #43a047">${name}</strong><span style="color: #43a047">${time}</span>`;
        } else {
            prayerItem.innerHTML = `<strong>${name}</strong> ${time}`;
        }
        prayerList.appendChild(prayerItem);
    }
}
})

document.addEventListener("DOMContentLoaded", function() {
    const menuItem = document.querySelector('li[data-target="homepage"]');
    const targetSection = document.querySelector('.main');

    menuItem.addEventListener('click', () => {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const hadithMenuItem = document.querySelector('li[data-filter=""]');
    const hadithContainer = document.querySelector('.hadithContainer');

    hadithMenuItem.addEventListener('click', () => {
        hadithContainer.scrollIntoView({ behavior: 'smooth' });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const surahsMenuItem = document.querySelector('li[data-filter="1"]');
    const surahsContainer = document.querySelector('.surahsContainer');

    surahsMenuItem.addEventListener('click', () => {
        surahsContainer.scrollIntoView({ behavior: 'smooth' });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const prayerTimesMenuItem = document.querySelector('li[data-filter="hello"]');
    const prayerTimesSection = document.querySelector('#prayer-times');

    prayerTimesMenuItem.addEventListener('click', () => {
        prayerTimesSection.scrollIntoView({ behavior: 'smooth' });
    });
});

function fetchRadioStations() {
  fetch("https://www.mp3quran.net/api/v3/radios?language=ar")
    .then(response => response.json())
    .then(data => {
      const radioList = document.querySelector('.radio-list');
      data.radios.forEach(radio => {
        const radioItem = document.createElement('div');
        radioItem.classList.add('radio-item');

        const radioName = document.createElement('h3');
        const nameParts = radio.name.split(' ');
        const sheikhName = nameParts.filter(part => part !== 'إذاعة').join(' ');
        radioName.textContent = `الشيخ ${sheikhName}`;
        radioItem.appendChild(radioName);

        const audioPlayer = document.createElement('audio');
        audioPlayer.controls = true;
        const source = document.createElement('source');
        source.src = radio.url;
        source.type = 'audio/mpeg';
        audioPlayer.appendChild(source);

        radioItem.appendChild(audioPlayer);

        radioList.appendChild(radioItem);
      });
    })
    .catch(error => console.error(error));
}

// Call the function to fetch and display radio stations
fetchRadioStations();



document.addEventListener("DOMContentLoaded", function() {
    const menuItem = document.querySelector('li[data-filter="2"].active');
    const section = document.querySelector('#quran-voice, #radio-list');

    menuItem.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth' });
    });
});



document.addEventListener("DOMContentLoaded", function() {
    const logoElement = document.querySelector('.logo');

    logoElement.addEventListener('click', () => {
        location.reload();
    });
});
