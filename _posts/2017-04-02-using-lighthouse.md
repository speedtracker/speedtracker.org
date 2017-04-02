---
title: Getting Lighthouse PWA score
---
Version [1.2.0](https://github.com/speedtracker/speedtracker/releases/tag/1.2.0) added data from [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) to the SpeedTracker dashboard, indicating the overall PWA score. But for now this functionality is limited to a subset of the WebPageTest locations and only works with Chrome.<!--more-->

To use Lighthouse, use one of the following settings as the `location` parameter on your profile:

- `Dulles_Linux:Chrome`
- `Dulles_MotoG4:Chrome`
- `Dulles_MotoG:Chrome`

For example:

```yml
parameters:
  runs: 1
  url: "https://speedtracker.org"
  browser: "Chrome"
  location: "Dulles_Linux"
```