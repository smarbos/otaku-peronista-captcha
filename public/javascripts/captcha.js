class opCaptcha {
  constructor(options, callback) {
    this.options = options;
    this.callback = callback;
    this.overlay = document.createElement("div");
    this.opCaptchaContainer = document.createElement("div");
    this.opCaptchaModal = document.createElement("div");
    this.opCaptcha = document.createElement("div");
    this.opCheckbox = document.createElement("div");
    this.opCaptchaCard = document.createElement("div");
    this.opLoading = document.createElement("div");
    this.imgSrc = null;
    this.imgData = null;
    this.loading = true;
  }

  debug(msg) {
    if (this.debug.debug) {
      console.debug(msg);
    }
  }

  createContainer () {
    debug("createContainer");
    return new Promise((resolve) => {
      this.opCaptchaContainer.id = 'op-captcha-container';
      this.opCaptchaContainer.style.display = "flex";
      this.opCaptchaContainer.style.justifyContent = "center";
      this.opCaptchaContainer.style.alignItems = "center";
      this.opCaptchaContainer.style.height = "100%";
      this.opCaptchaContainer.style.position = "absolute";
      this.opCaptchaContainer.style.top = "0";
      this.opCaptchaContainer.style.left = "0";
      this.opCaptchaContainer.style.right = "0";
      this.opCaptchaContainer.style.bottom = "0";
      document.body.appendChild(this.opCaptchaContainer);
      resolve();
    })
  }

  createOverlay () {
    debug("createOverlay");
    return new Promise((resolve) => {
      if (this.options.overlay) {
        this.overlay = document.createElement("div");
        this.overlay.id = 'op-captcha-overlay';
        this.overlay.style.backgroundColor = "#000000c9";
        this.overlay.style.position = "absolute";
        this.overlay.style.top = "0";
        this.overlay.style.left = "0";
        this.overlay.style.right = "0";
        this.overlay.style.bottom = "0";
        this.overlay.style.zIndex = "1337";
        this.opCaptchaContainer.appendChild(this.overlay);
      }
      resolve();
    });
  }
  
  createCaptcha() {
    debug("createCaptcha");
    return new Promise((resolve) => {
      this.opCaptcha.id = 'op-captcha';
      this.opCaptcha.style.display = "none";
      this.opCaptchaCard.style.visibility = 'visible'
      this.opCaptchaCard.style.zIndex = '7331'
      this.opCaptchaCard.id = 'op-card'
      this.opCaptchaCard.classList.add("mystyle")
      this.opCaptchaContainer.appendChild(this.opCaptchaCard);
      resolve();
    });
  }

  renderCard() {
    debug("renderCard");
    return new Promise((resolve) => {
      this.opCaptchaCard.innerHTML = `
      <div id="op-card" class="card op-captcha-card" style="z-index:7331;">
        <img id="op-captcha-img" alt="" src="${this.imgSrc}">
        <footer>
              <button id="op-captcha-otaku" class="op-captcha-bg-otaku">Otaku</button>
              <button id="op-captcha-peronista" class="op-captcha-bg-peronista">Peronista</button>
          <input id="op-captcha-uuid" value="${this.imgData.uuid}" type="hidden">
        </footer>
      <div>
      `;
      resolve();
    })
  }

  addListeners() {
    debug("addListeners");
    const otakuBtn = document.querySelector('#op-captcha-otaku')
    const peronistaBtn = document.querySelector('#op-captcha-peronista')

    otakuBtn.addEventListener('click', () => {
      this.validateCaptcha(this.imgData.id, 'o', this.imgData.uuid, callback)
    }, true);
  
    peronistaBtn.addEventListener('click', () => {
      this.validateCaptcha(this.imgData.id, 'p', this.imgData.uuid, callback)
    }, true);
  }

  createCheckbox() {
    debug("createCheckbox");
    return new Promise((resolve) => {
      this.opCheckbox.id = 'op-captcha-checkbox';
      this.opCheckbox.innerHTML = `
          <input type="checkbox">
          <label for="op-captcha-checkbox">Resolver captcha</label>
        `
    
      document.getElementById(this.options.target).appendChild(this.opCheckbox);
    
      const checkBox = document.querySelector('#op-captcha-checkbox');
      
      checkBox.addEventListener('click', () => {
        checkBox.disabled = true
        this.showCaptcha();
      });
      resolve();
  });
  }

  showCaptcha() {
    this.opCheckbox.innerHTML = "Cargando..."
      this.loadCaptcha().then(() => {
        this.createContainer().then(() => {
          this.createOverlay().then(() => {
            this.renderCard().then(() => {
              this.createCaptcha().then(()=> {
                this.addListeners();
                debug("Ready");
                this.loading = false;
                this.opCheckbox.style.display = "none";
                this.opCheckbox.style.visibility = "hiden";
              });
            });
          });
        });  
    });
  }

  success(res) {
    debug("success");
    return new Promise((resolve) => {
      localStorage.setItem('op-captcha-validator', JSON.stringify(res));
      this.opCaptchaCard.innerHTML =  `
        <div id="op-card" class="card op-captcha-card" style="z-index:7331;">
          <img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGNsYXNzPSJoYXMtc29saWQgIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIGZvY3VzYWJsZT0iZmFsc2UiIHJvbGU9ImltZyIgd2lkdGg9IjM1IiBoZWlnaHQ9IjM1IiBmaWxsPSIjMTNlNzc5Ij48cGF0aCBjbGFzcz0iY2xyLWktb3V0bGluZSBjbHItaS1vdXRsaW5lLXBhdGgtMSIgZD0iTTE4LDZBMTIsMTIsMCwxLDAsMzAsMTgsMTIsMTIsMCwwLDAsMTgsNlptMCwyMkExMCwxMCwwLDEsMSwyOCwxOCwxMCwxMCwwLDAsMSwxOCwyOFoiLz48cGF0aCBjbGFzcz0iY2xyLWktb3V0bGluZSBjbHItaS1vdXRsaW5lLXBhdGgtMiIgZD0iTTE2LjM0LDIzLjc0bC01LTVhMSwxLDAsMCwxLDEuNDEtMS40MWwzLjU5LDMuNTksNi43OC02Ljc4YTEsMSwwLDAsMSwxLjQxLDEuNDFaIi8+PHBhdGggY2xhc3M9ImNsci1pLXNvbGlkIGNsci1pLXNvbGlkLXBhdGgtMSIgZD0iTTMwLDE4QTEyLDEyLDAsMSwxLDE4LDYsMTIsMTIsMCwwLDEsMzAsMThabS00Ljc3LTIuMTZhMS40LDEuNCwwLDAsMC0yLTJsLTYuNzcsNi43N0wxMywxNy4xNmExLjQsMS40LDAsMCwwLTIsMmw1LjQ1LDUuNDVaIiBzdHlsZT0iZGlzcGxheTpub25lIi8+PC9zdmc+">
          <label for="op-captcha-checkbox">Ganaste!</label>
        <div>   
        `;
      setTimeout(() => {
        debug("hideCaptcha!");
        this.overlay.style.visibility = "hidden";
        this.opCaptchaContainer.style.display = "none";
        resolve();
      }, "2000");
    });
    
  }

  async init() {
    debug("init");
    this.createCheckbox();
  }

  async getRandomImage() {
    debug("getRandomImage");
    return fetch('https://captcha.meme.ar/captcha')
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error));
  }

  async validateCaptcha(imgId, option, uuid, callback) {
    debug("validateCaptcha");
    await fetch('https://captcha.meme.ar/captcha/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imgId: imgId, option: option, uuid: uuid })
    })
      .then((res) => res.json())
      .then((res) => {
        debug(res);
        if (res.status) {
          this.success(res).then(() => {
            this.callback(res);
            document.getElementById(this.options.target).innerHTML = this.options.okMessage
          });
        } else {
          debug("somethingHappens");
          this.updateCaptcha().then(() => {
            this.renderCard();
          })
        }
      })
      .catch((err) => {
        console.error(err)
        callback(err);
      })
  }

  async loadCaptcha() {
    debug("loadCaptcha");
    this.imgData = await this.getRandomImage()
    return new Promise((resolve) => {
      this.overlay.style.display = "block";
      this.imgSrc = `data:image/jpeg;base64,${this.imgData.image}`;
      resolve();
    });
  } 

  async updateCaptcha() {
    debug("updateCaptcha");
    this.imgData = await this.getRandomImage()
    this.overlay.style.display = "block";
    this.imgSrc = `data:image/jpeg;base64,${this.imgData.image}`;
  }

}