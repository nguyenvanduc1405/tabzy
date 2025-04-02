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
   this._init();
}

Tabzy.prototype._init = function () {
   const tab = this.tabs[0];
   tab.closest("li").classList.add(this.opt.activeClassName);
   this.tabs.forEach((tab) => {
      tab.onclick = (event) => this._handleActiveTabClick(event, tab);
   });
   this.panels.forEach((panel) => (panel.hidden = true));
   const panel = this.panels[0];
   panel.hidden = false;
};

Tabzy.prototype._handleActiveTabClick = function (event, tab) {
   event.preventDefault();
   this.tabs.forEach((tab) => {
      tab.closest("li").classList.remove(this.opt.activeClassName);
   });
   tab.closest("li").classList.add(this.opt.activeClassName);
   this.panels.forEach((panel) => (panel.hidden = true));
   const panel = document.querySelector(tab.getAttribute("href"));
   panel.hidden = false;
};
