# slack-friends

Make it easy to send to Slack from your application

## Installation

```javascript
💡 npm install slack-friends
```

## How to get bot token
1. [https://api.slack.com/](https://api.slack.com/) <br />
2. Your apps <br />
3. Create New App <br />
4. OAuth & Permissions - Bot User OAuth Token <br />
```
Bot Token scopes 
  * channels:join
  * channels:read
  * chat:write
```


## Usage

```tsx
import { SlackFriends } from "slack-friends";

const slack = new SlackFriends({
  token: "Your Bot Token",
  channel: "Channel Name",
});
```

- `token` : Please refer to 'How to get bot token' to issue the token
- `channel` : write channel name  eg) #channelName -> remove `#` and only use `channelName`

### Common Message
```tsx
slack.send("hello world");
```

### Custom Message
Please refer to the detail to build Custom Message
https://app.slack.com/block-kit-builder/

```tsx
const customMessage = {
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "This is a section block with a button."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Click Me",
          "emoji": true
        },
        "value": "click_me_123",
        "action_id": "button-action"
      }
    }
  ]
}

slack.send(customMessage);
```

### Cron Message
```tsx
slack.cron("* * * * *", "hello World");
```
```
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
```
This is a quick reference to cron syntax and also shows the options supported by node-cron.

### Schedule Message
```tsx
slack.time(new Date("2022-06-18T05:17:00Z"), "hello World");
```
