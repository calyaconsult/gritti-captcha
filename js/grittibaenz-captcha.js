const selectedSquares = new Set();
  function createShuffler() {
      // Initialize the array with decimal strings '00' to '15'
      let array = Array.from({ length: 16 }, (_, i) => i.toString().padStart(2, '0')); // ['00', '01', ..., '15']

      function shuffleAndPick() {
          // Shuffle the array using the Fisher-Yates algorithm
          for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
          }

          // Remove and return the first element
          return array.shift();
      }

      return shuffleAndPick;
  }

  let shuffler = createShuffler();

  function getImgName(i) {
    //var iStr = (i>9)? `${i}` : `0${i}`;
    iStr = i;
    return `images/gb${iStr}.webp`;
  }

  class CaptchaGrid { // Refactored from the code in grittibaenz-captcha-2.1.html by https://chatgpt.com/c/6740246d-106c-800d-b5d0-073bba004efd
    constructor() {
      this.grid = document.getElementById('captchaGrid');
      this.skipButton = document.getElementById('skipButton');
      this.cb1 = document.getElementById('cb1');
      this.cb2 = document.getElementById('cb2');
      this.cb3 = document.getElementById('cb3');
      this.selectedSquares = new Map();

      if (!this.grid || !this.skipButton) {
        throw new Error('Required elements #captchaGrid or #skipButton are missing from the DOM.');
      }

      this.init();
      this.addEventListeners();
    }

    init() {
      // Create 16 grid items
      for (let i = 0; i < 16; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.dataset.index = i;

        const img = document.createElement('img');
        img.src = getImgName(shuffler());
        img.alt = `Grid item ${i + 1}`;

        gridItem.appendChild(img);
        this.grid.appendChild(gridItem);
      }
    }

    addEventListeners() {
      // Handle grid item clicks
      this.grid.addEventListener('click', (e) => {
        const gridItem = e.target.closest('.grid-item');
        if (!gridItem) {
          console.warn('Click occurred outside a grid item.');
          return;
        }
        const imgElement = gridItem.querySelector('img');
        const imageUrl = new URL(imgElement.src).pathname.split('/').pop().replace('.webp','');
        const index = Number(gridItem.dataset.index);

        if (this.selectedSquares.has(index)) {
          this.selectedSquares.delete(index);
          gridItem.classList.remove('selected');
        } else {
          this.selectedSquares.set(index, imageUrl);
          gridItem.classList.add('selected');
        }

        console.log('Selected squares:', Object.fromEntries(this.selectedSquares));
      });

      // Handle skip button
      this.skipButton.addEventListener('click', () => {
        let result = Array.from(this.selectedSquares.entries());
        result = result.reduce((acc, current) => [...acc,current[1]], []).sort().join('')
        console.log('Selected squares:', result);
        const resultDiv = document.getElementById('result');
        if (result === 'gb01gb02gb06gb07') {
          resultDiv.classList.add('green');
          resultDiv.innerHTML = '<p>Ja, so sehen wir das auch!</p><p><a href="/">Hier geht es zur nächsten Seite</a></p>';
        } else {
          resultDiv.classList.add('red');
          resultDiv.textContent = 'Wir scheinen in Sachen Grittibänz verschiedene Vorstellungen zu haben.';
        }

        this.selectedSquares.clear();
        this.grid.querySelectorAll('.grid-item').forEach((item) => {
          item.classList.remove('selected');
        });
      });

      // Handle cb1 button click: clear and re-render the CAPTCHA
      this.cb1.addEventListener('click', () => {
        console.log('Clearing and re-rendering CAPTCHA');
        this.selectedSquares.clear(); // Clear selected squares
        document.getElementById('captchaGrid').innerHTML = '';
        document.getElementById('result').innerHTML = '';
        document.getElementById('result').textContent = '';
        document.getElementById('result').classList.remove('green');
        document.getElementById('result').classList.remove('red');
        shuffler = createShuffler();
        this.init(); // Re-render the grid
      });
      // Handle cb1 button click: clear and re-render the CAPTCHA
      this.cb2.addEventListener('click', () => {
        alert('Die Audio-Funktion steht leider noch nicht zur Verfügung.');
      });
      // Handle cb1 button click: clear and re-render the CAPTCHA
      this.cb3.addEventListener('click', () => {
        alert('Dieses CAPTCHA prüft nicht wirklich, ob Sie ein Mensch sind. Es übermittelt auch keine Daten an irgendwen. Es dient nur zum Spass.');
      });
    }
  }
  // Initialize the CAPTCHA grid
  const captcha = new CaptchaGrid();
