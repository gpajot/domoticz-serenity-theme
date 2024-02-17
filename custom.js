// Patch to store a reference to the websocket.
var websocket;
const nativeWebSocket = window.WebSocket;
window.WebSocket = function(...args) {
  const socket = new nativeWebSocket(...args);
  if (args[1][0] === 'domoticz') {
    websocket = socket;
  };
  return socket;
};

// Initial theme setup.
setupTheme();

// Watch for color scheme changes to update the theme-color.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
  'change',
  function(event) {
    setThemeColor();
  },
);

// Refresh things when page gets back in focus.
document.addEventListener("visibilitychange", onVisibilityChange);
function onVisibilityChange(event) {
  if (event.type !== "visibilitychange" || document.visibilityState !== "visible") {
    return;
  }
  reconnectWebsocket();
  refreshDeviceData();
};

// Ensure the websocket is active as it may get 'stuck' when the page is too long in the background.
function reconnectWebsocket() {
  if (websocket) {
    // Just close it, it will be automatically reopened.
    websocket.close();
  };
};

// Refresh device data.
function refreshDeviceData() {
  $.ajax({
    url: "/json.htm?type=command&param=getdevices&filter=all&used=true",
    async: true,
    dataType: 'json',
    success: function (data) {
      if (typeof data.result != 'undefined') {
        var rootScope = angular.element(document.body).scope().$root;
        data.result.forEach(function(deviceData) {
          rootScope.$broadcast('device_update', deviceData);
        });
      };
    },
  });
};

// Settings.
const variableDefinitions = [
  { name: "serenity-color-hue-primary", initial: "145" },
  { name: "serenity-color-hue-secondary", initial: "330" },
  { name: "serenity-color-scheme-preference", initial: "system" },
  { name: "serenity-hide-back-to-top", initial: "true" },
  { name: "serenity-hide-copyright", initial: "true" },
  { name: "serenity-hide-last-update", initial: "true" },
  { name: "serenity-hide-logo", initial: "true" },
  { name: "serenity-hide-menu-icons", initial: "true" },
  { name: "serenity-hide-time-sun", initial: "true" },
];

// Setup theme settings.
function setupTheme() {
  $.ajax({
    url: "/json.htm?type=command&param=getuservariables",
    async: true,
    dataType: 'json',
    success: function (data) {
      const variables = {};
      if (typeof data.result !== "undefined") {
        data.result.forEach(function(variable) {
          if (variable.Name.substr(0, 9) === 'serenity-') {
            variables[variable.Name] = variable.Value;
          }
        });
      };
      variableDefinitions.forEach(function(variableDef) {
        // Initialize the user variable if needed.
        if (!variables[variableDef.name]) {
          setUserVariable(variableDef.name, variableDef.initial);
          variables[variableDef.name] = variableDef.initial;
        }
      });
      setupColors(variables);
      setupHiddenElements(variables);
      setupiOSIcon();
    },
  });
};

function setUserVariable(name, value) {
  $.ajax({
    url: `/json.htm?type=command&param=adduservariable&vname=${name}&vtype=2&vvalue=${value}`,
    async: true,
    dataType: "json",
  });
}

// Setup iphone icon.
function setupiOSIcon() {
  document.querySelectorAll("link[rel^='apple-touch-icon']").forEach(e => e.remove());
  var link = document.createElement("link");
  link.setAttribute("rel", "apple-touch-icon");
  link.setAttribute("href", 'styles/domoticz-serenity-theme/images/apple-touch-icon.png');
  document.getElementsByTagName("head")[0].appendChild(link);
}

// Setup CSS color variables.
function setupColors(variables) {
  const root = document.documentElement;
  root.style.setProperty('--primary-hue', variables['serenity-color-hue-primary']);
  root.style.setProperty('--secondary-hue', variables['serenity-color-hue-secondary']);
  switch(variables['serenity-color-scheme-preference']) {
    case 'dark':
      root.style.setProperty('color-scheme', 'only dark');
      break;
    case 'light':
      root.style.setProperty('color-scheme', 'only light');
      break;
  }
  setThemeColor();
}

// Load style sheets for hidden elements.
function setupHiddenElements(variables) {
  variableDefinitions.forEach(function(variableDef) {
    if (variableDef.name.substr(0, 14) === 'serenity-hide-' && variables[variableDef.name] === "true") {
      var link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", `styles/domoticz-serenity-theme/hide/${variableDef.name.substr(14)}.css`);
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  });
};

// Dynamically set theme color based on body background.
// To avoid complicated computations converting LCH to RGB, let the browser do it.
const canvas = document.createElement("canvas");
canvas.width = canvas.height = 1;
const ctx = canvas.getContext("2d");
async function setThemeColor() {
  while (!document.body) {
    await new Promise(r => setTimeout(r, 50));
  }
  ctx.fillStyle = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
  ctx.fillRect(0, 0, 1, 1);
  const rgba = ctx.getImageData(0, 0, 1, 1).data;
  document.querySelector("meta[name='theme-color']").setAttribute(
    'content',
    `rgb(${rgba.slice(0, 3).join(',')})`,
  );
}
