# domoticz-serenity-theme

This is a more modern, flat and leaner theme for the [Domoticz](https://www.domoticz.com) web interface, [gallery](#gallery) below.

It is based on two colors, and has a dark mode that follows the OS setting.
Certain theme settings such as colors and hidden elements can be configured through Domoticz user variables.
Icons are sourced from [Material Design Icons](https://pictogrammers.com/library/mdi/).

> ⚠️ This is still an early version, there are a number of untested things:
> 
> - floorplans, scenes and weather sensors as I don't use those
> - Browsers other than Safari, Firefox and Chrome

## Installation

1. Clone this repository in `domoticz/www/styles`.
2. Select `domoticz-serenity-theme` as the theme in Domoticz settings.
3. Go to user variables, search for `serenity-` and customize as you wish 😊

By default, all variables are initialized to their default value to be easily changed. Here is some details about what they do:
- `serenity-color-hue-`: primary and secondary colors (hue in LCH space - 60% lightness and 0.07 chroma, you can use this [color picker](https://oklch.com/#60,0.07,145,100))
- `serenity-color-scheme-preference`: change to force a given sheme (`system`, `light` or `dark`).
- `serenity-hide-`: hidden elements, set to `true` to hide and `false` to show

## Adding missing icons

Get black `.png` icons with a size of `256px` from [MDI](https://pictogrammers.com/library/mdi/).

## Gallery

### Light mode and narrow

[<img src="./gallery/light-narrow-dashboard.png" alt="Dashboard - light & narrow" height="500"/>](./gallery/light-narrow-dashboard.png)
[<img src="./gallery/light-narrow-devices.png" alt="Devices - light & narrow" height="500"/>](./gallery/light-narrow-devices.png)
[<img src="./gallery/light-narrow-user-variables.png" alt="User variables - light & narrow" height="500"/>](./gallery/light-narrow-user-variables.png)

### Dark mode and wide

[<img src="./gallery/dark-wide-dashboard.png" alt="Dashboard - dark & wide" height="300"/>](./gallery/dark-wide-dashboard.png)
[<img src="./gallery/dark-wide-devices.png" alt="Devices - dark & wide" height="300"/>](./gallery/dark-wide-devices.png)
[<img src="./gallery/dark-wide-user-variables.png" alt="User variables - dark & wide" height="300"/>](./gallery/dark-wide-user-variables.png)
