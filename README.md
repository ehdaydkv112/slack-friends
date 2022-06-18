# slack-friend

<br />

```javascript
💡 npm install slack-friend
```

------

```tsx
import slackFriend from "slack-friends";
import 'dotenv/config';

const slack = new slackFriend({
  token: process.env.token,
  channel: "testChannel",
});

// Common Message
slack.send("hello world");

// Custom Message
// https://app.slack.com/block-kit-builder/
const customMessage = {
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "This is a section block with a button."
      },
      "accessory": {
        "type": "button",+
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

// Cron Message
slack.cron("* * * * *", "hello World");

// Schedule Message
slack.time(new Date("2022-06-18T05:17:00Z"), "hello World");
```

------

**etc**
<details>
<summary>How to get token</summary>
1. [https://api.slack.com/](https://api.slack.com/) <br />
2. Your apps <br />
3. Create New App <br />
4. OAuth & Permissions - Bot User OAuth Token <br />
