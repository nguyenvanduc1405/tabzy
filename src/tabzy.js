function Tabzy(selector, options = {}) {
   this.container = document.querySelector(selector);
   if (!this.container) {
      console.error(`Tabzy: No container found for selector ${selector}`);
      return;
   }
   this.tabs = Array.from(this.container.querySelectorAll("li a"));
   if (!this.tabs.length) {
      console.error(`Tabzy: No tabs found inside the container`);
      return;
   }
   this.panels = this.tabs
      .map((tab) => {
         const panel = document.querySelector(tab.getAttribute("href"));
         if (!panel) {
            console.error(
               `Tabzy: No panel found for selector '${tab.getAttribute(
                  "href"
               )}'`
            );
         }
         return panel;
      })
      .filter(Boolean);
   if (this.tabs.length !== this.panels.length) {
      return;
   }
   this.opt = Object.assign(
      {
         activeClassName: "tabzy--active",
         remember: false,
      },
      options
   );
   this._originHTML = this.container.innerHTML;
   this._cleanRegex = /[^a-zA-Z0-9]/g;
   this.paramsKey = selector.replace(this._cleanRegex, "");
   this._init();
}

Tabzy.prototype._init = function () {
   let params = new URLSearchParams(location.search);
   let keyParams = params.get(this.paramsKey);
   const tab =
      (this.opt.remember &&
         keyParams &&
         this.tabs.find(
            (tab) =>
               tab.getAttribute("href").replace(this._cleanRegex, "") ===
               keyParams
         )) ||
      this.tabs[0];
   this.tabs.forEach((tab) => {
      tab.onclick = (event) => this._handleActiveTabClick(event, tab);
   });
   this._activeTab(tab, false);
};

Tabzy.prototype._handleActiveTabClick = function (event, tab) {
   event.preventDefault();
   this._activeTab(tab);
};

Tabzy.prototype._activeTab = function (tab, saveUpdateURL = this.opt.remember) {
   this.tabs.forEach((tab) => {
      tab.closest("li").classList.remove(this.opt.activeClassName);
   });
   tab.closest("li").classList.add(this.opt.activeClassName);
   this.panels.forEach((panel) => (panel.hidden = true));
   const panel = document.querySelector(tab.getAttribute("href"));
   panel.hidden = false;

   if (saveUpdateURL) {
      const params = new URLSearchParams(location.search);
      params.set(
         this.paramsKey,
         tab.getAttribute("href").replace(this._cleanRegex, "")
      );
      history.replaceState(null, null, `?${params}`);
   }
};

Tabzy.prototype.switch = function (input) {
   let tab = null;
   if (typeof input === "string") {
      tab = this.tabs.find((tab) => tab.getAttribute("href") === input);
      if (!tab) {
         console.error(`Tabzy: No panel found with ID '${input}'`);
         return;
      }
   } else if (this.tabs.includes(input)) {
      tab = input;
   }
   if (!tab) {
      console.error(`Tabzy: Invalid input '${input}'`);
      return;
   }
   this._activeTab(tab);
};

Tabzy.prototype.destroy = function () {
   this.container.innerHTML = this._originHTML;
   this.panels.forEach((panel) => (panel.hidden = false));
   this.container = null;
   this.tabs = null;
   this.panels = null;
};
