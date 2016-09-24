---
layout: markdown
title: Documentation
---
<ul class="c-Index">
  <li class="c-Index__item"><a href="#introduction">1. Introduction</a></li>
  <li class="c-Index__item"><a href="#prerequisites">2. Prerequisites</a></li>
  <li class="c-Index__item"><a href="#installation">3. Installation</a>
    <ul class="c-Index__nested">
      <li class="c-Index__item"><a href="#permissions">3.1. Permissions</a></li>
    </ul>
  </li>
  <li class="c-Index__item"><a href="#configuration">4. Configuration</a>
    <ul class="c-Index__nested">
      <li class="c-Index__item"><a href="#profiles">4.1. Profiles</a></li>
      <li class="c-Index__item"><a href="#scheduling-tests">4.2. Scheduling tests</a></li>
      <li class="c-Index__item"><a href="#alerts">4.3. Alerts</a></li>
      <li class="c-Index__item"><a href="#budgets">4.4. Budgets</a></li>
    </ul>
  </li>
  <li class="c-Index__item"><a href="#run">5. Run a test</a></li>
</ul>

<h1 id="introduction">1. Introduction</h1>

SpeedTracker consists of two separate components: an API layer and a visualisation layer. The former is a Node.js application that processes test requests and handles all communication between you, WebPageTest and GitHub. The latter is a [Jekyll](http://jekyllrb.com/) running a small React application.

Both these pieces are available as open-source projects, which you can run on your own infrastructure. However, this guide will document the use case of using our hosted API layer, publicly available for anyone to use for free, and hosting the visualisation component on a GitHub repository, served via GitHub Pages.

If you wish to run the API yourself, please refer to the documentation on the [GitHub repository](https://github.com/speedtracker/speedtracker-app).

<h1 id="prerequisites">2. Prerequisites</h1>

SpeedTracker is built on top of WebPageTest. If you don't have access to a private WebPageTest instance, you can use the public one, for which you will need to [request an API key](https://www.webpagetest.org/getkey.php). SpeedTracker will use this key to request tests on your behalf.

Each key comes with a limit of 200 page loads per day, as explained on the link above. You will be subject to the WebPageTest terms of service.

<h1 id="installation">3. Installation</h1>

The first step is to set up a copy of the visualisation layer. To do this, fork the repository at [speedtracker/speedtracker-frontend](https://github.com/speedtracker/speedtracker-frontend) into your own GitHub account or organisation.

SpeedTracker will read from a number of files in your repository, namely `speedtracker.yml`, the main config file. But before you start editing it, you need to set up an encryption key.

This key will need to be supplied as a URL parameter to every request made to the API, as it's used to ensure all requests are coming from you, as well as to obfuscate critical information that will be left visible to the public eye (unless your repository is private).

Choose a strong and long string as your key and store it somewhere safe. [This tool](https://lastpass.com/generatepassword.php) might help you generate one.

<h2 id="permissions">3.1. Permissions</h2>

SpeedTracker must have push access to your newly-created GitHub repository. To avoid asking you for a Personal Access Token, which would grant us push access to all your repositories, you can simply give push access to our [friendly bot](https://github.com/speedtracker-bot) on a single repository.

To do this, go to the **Settings** pane on your repository, navigate to **Collaborators** and add the user **speedtracker-bot**. At this point, the invitation will be pending, so you need to nudge the bot for it to accept your request.

Just open the following link in your browser, replacing the placeholders with your GitHub username or organisation, the name of the repository and the name of the branch you installed the Jekyll site on (typically *master* or *gh-pages*):

```
https://api.speedtracker.org/v1/connect/{USERNAME}/{REPOSITORY}/{BRANCH}
```

<h1 id="configuration">4. Configuration</h1>

To install your key, you need to create an encrypted version of it. [This tool](/encrypt) allows you to encrypt any piece of text with a key of your choice. Start by encrypting the key itself (so if your key is `foobar123`, encrypt that with `foobar123`) and set that as the value of `encryptionKey` in your `speedtracker.yml` file.

The table below shows what each configuration parameter is for, and whether or not its contents must be encrypted.

| Parameter | Description | Encrypted |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| `encryptionKey` | Key to be used for encrypting parameters | Yes |
| `wptKey` | WebPageTest API key | Yes |
| `alerts` | Channels for performance budget alerts to be delivered on (see [alerts](#alerts)) | Partially |

<h2 id="profiles">4.1. Profiles</h2>

Every test runs against a profile, which consists of a pre-defined group of parameters, such as the website URL and other parameters used by WebPageTest, such as connectivity type, location or number of runs.

You can use different profiles to monitor different sites, or simply different variations of the same test (e.g. one profile for a Cable connection, another one for 3G). You need to define at least one profile, so start by editing the existing `_profiles/default.html`.

The following parameters can be used to configure a profile:

| Parameter | Description | Example |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| `default` | Whether the profile is the default one, loaded on the root path | `true` |
| `interval` | Defines an interval (in hours) for the test to be executed (see [scheduling tests](#scheduling-tests)) | `12` |
| `name` | Name of the profile | `eduardoboucas.com (3G)` |
| `budgets` | Performance budgets | See [budgets](#budgets) |
| `parameters` | WebPageTest test parameters. `url` is mandatory | See below |

The `parameters` key will accept any parameter used by the [WebPageTest API](https://github.com/marcelduran/webpagetest-api). The following block shows how to configure a profile to test https://eduardoboucas.com on a 3G connection, from Dulles, with 1 run and video capture. Only `url` is mandatory.

Since we're setting `default: true`, this will be the main test and will be the one shown when we access our root URL.

```markdown
---
default: true
name: 'eduardoboucas.com (3G)'
parameters:
  connectivity: '3G'
  location: 'Dulles:Chrome'
  firstViewOnly: true
  runs: 1
  url: "https://eduardoboucas.com"
  video: true
---
```

<h2 id="scheduling-tests">4.2. Scheduling tests</h2>

Recurring tests can be set by defining an `interval` property within each profile. We currently allow 2 scheduled tests per day, so the minimum value for `interval` is `12`.

You can choose to cancel these at any time by removing the `interval` property from the profile.

<h2 id="alerts">4.3. Alerts</h2>

If you define [performance budgets](#budgets), you can choose to receive alerts when any of the metrics goes above its budget. Currently, notifications can be delivered via e-mail or Slack messages.

An alert is defined as an object inside `alerts` in the main config, where the key is an identifier of the alert. Different alert types have different configuration parameters.

| Parameter | Specific to alert | Description |  Encrypted |
|-----------------|-----|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| `type` | — | Type of the alert (e.g. `email`) |  No |
| `recipients` | `email` | List of e-mail addresses to receive the alert fo | Yes |
| `hookUrl` | `slack` | Slack webhook URL | Yes |
| `channel` | `slack` | Slack channel | No |
| `username` | `slack` | Username for the Slack bot | No |
| `iconEmoji` | `slack` | Emoji to be used as icon by the Slack bot | No |

For example, the following block would define two alerts, one of type e-mail and another one of type Slack. The following should go in the main config file (`speedtracker.yml`).

```yml
alerts:
  mainAlert:
    type: 'email'
    recipients: ['1q2w3e4r']
  slackAlert:
    type: 'slack'
    hookUrl: 'p0o9o8i7u6y5t4r3e2w1q'
    channel: '#speedtracker'
    username: 'SpeedTracker'
    iconEmoji: ':grimacing:'
```

<h2 id="budgets">4.4. Budgets</h2>

Performance budgets are defined per-profile, within the profile configuration file, and can monitor any metric used by SpeedTracker. A budget is defined with the following parameters.

| Parameter | Description | Example |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| `metric` | Id of the metric to monitor | `firstPaint` |
| `min` | Defines a minimum value for the metric | `900` |
| `max` | Defines a maximum value for the metric | `90000` |
| `alerts` | List of alerts to trigger when the budget is overrun. These are the alert identifiers you define on [alerts](#alerts) | `eduardoboucas.com (3G)` |

The following block, extracted from `_profiles/default.html`, shows how to define a budget of 5s for `fullyLoaded`, which will trigger `mainAlert` and `slackAlert`, as well as a budget of 3s for `firstPaint`, triggering `slackAlert` only.

```yml
budgets:
  -
    metric: fullyLoaded
    max: 5000
    alerts: ['mainAlert', 'slackAlert']
  -
    metric: firstPaint
    max: 3000
    alerts: ['slackAlert']
```

<h1 id="run">5. Run a test</h1>

With everything configured we can finally run a test! Just fire a `GET` or `POST` request to the following URL, replacing the placeholders with your GitHub username or organisation, the name of the repository, the branch, the id of the profile and the encryption key, respectively.

```
https://api.speedtracker.org/v1/test/{USERNAME}/{REPOSITORY}/{BRANCH}/{PROFILE}?key={KEY}
```