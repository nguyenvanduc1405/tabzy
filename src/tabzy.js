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
      },
      options
   );
   this._originHTML = this.container.innerHTML;
   this._init();
}

Tabzy.prototype._init = function () {
   const tab = this.tabs[0];
   this.tabs.forEach((tab) => {
      tab.onclick = (event) => this._handleActiveTabClick(event, tab);
   });
   this._tryActiveTab(tab);
};

Tabzy.prototype._handleActiveTabClick = function (event, tab) {
   event.preventDefault();
   this._tryActiveTab(tab);
};

Tabzy.prototype._tryActiveTab = function (tab) {
   this.tabs.forEach((tab) => {
      tab.closest("li").classList.remove(this.opt.activeClassName);
   });
   tab.closest("li").classList.add(this.opt.activeClassName);
   this.panels.forEach((panel) => (panel.hidden = true));
   const panel = document.querySelector(tab.getAttribute("href"));
   panel.hidden = false;
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
   this._tryActiveTab(tab);
};

Tabzy.prototype.destroy = function () {
   this.container.innerHTML = this._originHTML;
   this.panels.forEach((panel) => (panel.hidden = false));
   this.container = null;
   this.tabs = null;
   this.panels = null;
};
